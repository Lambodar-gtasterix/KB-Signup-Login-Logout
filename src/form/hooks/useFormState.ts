// src/form/hooks/useFormState.ts
import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

type FormValues = Record<string, any>;

export type FormErrors<TValues extends FormValues> = Partial<Record<keyof TValues, string>>;

export interface UseFormStateOptions<TValues extends FormValues> {
  initialValues: TValues;
  schema: z.ZodObject<any>;
}

export interface UseFormStateReturn<TValues extends FormValues> {
  values: TValues;
  errors: FormErrors<TValues>;
  touched: Partial<Record<keyof TValues, boolean>>;
  setFieldValue: <K extends keyof TValues>(
    field: K,
    value: TValues[K],
    options?: { validate?: boolean },
  ) => void;
  touchField: <K extends keyof TValues>(field: K, touch?: boolean) => void;
  handleBlur: <K extends keyof TValues>(field: K) => void;
  validateForm: () => boolean;
  resetForm: (nextValues?: TValues) => void;
  isValid: boolean;
}

const collectErrors = <TValues extends FormValues>(
  issues: z.ZodIssue[],
): FormErrors<TValues> => {
  const fieldErrors = {} as FormErrors<TValues>;

  issues.forEach((issue) => {
    const [pathSegment] = issue.path;
    if (pathSegment !== undefined && fieldErrors[pathSegment as keyof TValues] == null) {
      fieldErrors[pathSegment as keyof TValues] = issue.message;
    }
  });

  return fieldErrors;
};

export const useFormState = <TValues extends FormValues>({
  initialValues,
  schema,
}: UseFormStateOptions<TValues>): UseFormStateReturn<TValues> => {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<TValues>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof TValues, boolean>>>({});

  const validateValues = useCallback(
    (nextValues: TValues) => {
      const parsed = schema.safeParse(nextValues);
      if (parsed.success) {
        setErrors({});
        return { valid: true, fieldErrors: {} as FormErrors<TValues> };
      }

      const fieldErrors = collectErrors<TValues>(parsed.error.issues);
      setErrors(fieldErrors);
      return { valid: false, fieldErrors };
    },
    [schema],
  );

  const setFieldValue = useCallback(
    <K extends keyof TValues>(field: K, value: TValues[K], options?: { validate?: boolean }) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (options?.validate || touched[field]) {
          const parsed = schema.safeParse(next);
          if (parsed.success) {
            setErrors((prevErrors) => {
              if (prevErrors[field] === undefined) return prevErrors;
              const { [field]: _omitted, ...rest } = prevErrors;
              return rest as FormErrors<TValues>;
            });
          } else {
            const fieldError = parsed.error.issues.find((issue) => issue.path[0] === field);
            setErrors((prevErrors) => ({
              ...prevErrors,
              [field]: fieldError?.message,
            }));
          }
        }
        return next;
      });
    },
    [schema, touched],
  );

  const touchField = useCallback(
    <K extends keyof TValues>(field: K, touch: boolean = true) => {
      setTouched((prev) => ({ ...prev, [field]: touch }));
    },
    [],
  );

  const handleBlur = useCallback(
    <K extends keyof TValues>(field: K) => {
      touchField(field);
      setValues((prev) => {
        const parsed = schema.safeParse(prev);
        if (parsed.success) {
          setErrors((prevErrors) => {
            if (prevErrors[field] === undefined) return prevErrors;
            const { [field]: _omitted, ...rest } = prevErrors;
            return rest as FormErrors<TValues>;
          });
        } else {
          const fieldError = parsed.error.issues.find((issue) => issue.path[0] === field);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: fieldError?.message,
          }));
        }
        return prev;
      });
    },
    [schema, touchField],
  );

  const validateForm = useCallback(() => {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = collectErrors<TValues>(parsed.error.issues);
    setErrors(fieldErrors);
    setTouched((prev) => {
      const next = { ...prev };
      (Object.keys(fieldErrors) as Array<keyof TValues>).forEach((key) => {
        next[key] = true;
      });
      return next;
    });
    return false;
  }, [schema, values]);

  const resetForm = useCallback(
    (nextValues?: TValues) => {
      setValues(nextValues ?? initialValues);
      setErrors({});
      setTouched({});
    },
    [initialValues],
  );

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return {
    values,
    errors,
    touched,
    setFieldValue,
    touchField,
    handleBlur,
    validateForm,
    resetForm,
    isValid,
  };
};
