// src/utils/normalizeCreateResponse.ts
import { EntityType } from '../types/listings';

interface EntityConfig {
  idPaths: string[];
  successCodes: Array<string | number>;
  requireId: boolean;
  fallbackMessage: string;
}

const ENTITY_CONFIG: Record<EntityType, EntityConfig> = {
  mobile: {
    idPaths: ['mobileId', 'data.mobileId', 'data.id', 'id'],
    successCodes: ['200', '201', 200, 201],
    requireId: true,
    fallbackMessage: 'Mobile created successfully',
  },
  laptop: {
    idPaths: ['laptopId', 'data.laptopId', 'data.id', 'id'],
    successCodes: ['SUCCESS', 'CREATED', '200', '201', 200, 201],
    requireId: false,
    fallbackMessage: 'Laptop created successfully',
  },
};

const getNestedValue = (source: any, path: string) => {
  if (!source) return undefined;
  return path.split('.').reduce((acc, segment) => {
    if (acc == null) return undefined;
    return acc[segment];
  }, source);
};

const toComparable = (value: string | number | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined;
  return String(value).toUpperCase();
};

export interface NormalizedCreateResponse {
  success: boolean;
  id: number | null;
  message: string;
  rawMessage: string;
  fallbackMessage: string;
}

export const normalizeCreateResponse = (
  response: any,
  entityType: EntityType,
): NormalizedCreateResponse => {
  const config = ENTITY_CONFIG[entityType];
  const id = config.idPaths.reduce<number | null>((acc, path) => {
    if (acc !== null) return acc;
    const candidate = getNestedValue(response, path);
    const numeric = Number(candidate);
    return Number.isFinite(numeric) ? numeric : acc;
  }, null);

  const code = toComparable(response?.code);
  const status = toComparable(response?.status);
  const statusCode = toComparable(response?.statusCode);

  const hasSuccessCode = config.successCodes.some((expected) => {
    const expectedComparable = toComparable(expected);
    return (
      code === expectedComparable ||
      status === expectedComparable ||
      statusCode === expectedComparable
    );
  });

  const rawMessage = (response?.message ?? config.fallbackMessage ?? '').toString().trim();
  const sanitizedMessage =
    rawMessage
      ?.replace(/with id.*$/i, '')
      .replace(/\b(id|ID)[:\s#-]*\d+\b/g, '')
      .trim() || rawMessage || config.fallbackMessage;

  const success = config.requireId ? id !== null && hasSuccessCode : hasSuccessCode || id !== null;

  return {
    success,
    id,
    message: sanitizedMessage,
    rawMessage,
    fallbackMessage: config.fallbackMessage,
  };
};
