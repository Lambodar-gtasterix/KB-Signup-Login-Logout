import { StyleSheet } from 'react-native';

export const LISTING_UPDATE_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const LISTING_UPDATE_RADII = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const LISTING_UPDATE_COLORS = {
  bg: '#F5F5F5',
  white: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#E0E0E0',
  borderFocus: '#4A90E2',
  primary: '#2C3E50',
  primaryLight: '#34495E',
  stepActive: '#4A90E2',
  stepInactive: '#E0E0E0',
  error: '#E74C3C',
  success: '#27AE60',
  overlay: 'rgba(0, 0, 0, 0.4)',
} as const;

export const listingUpdateStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LISTING_UPDATE_COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: LISTING_UPDATE_COLORS.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: LISTING_UPDATE_SPACING.lg,
  },
  loadingText: {
    marginTop: LISTING_UPDATE_SPACING.md,
    color: LISTING_UPDATE_COLORS.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LISTING_UPDATE_SPACING.lg,
    paddingVertical: LISTING_UPDATE_SPACING.lg,
    backgroundColor: LISTING_UPDATE_COLORS.white,
  },
  backButton: {
    padding: LISTING_UPDATE_SPACING.sm,
    marginLeft: -LISTING_UPDATE_SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: LISTING_UPDATE_COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: LISTING_UPDATE_SPACING.xl,
    backgroundColor: LISTING_UPDATE_COLORS.white,
    marginBottom: LISTING_UPDATE_SPACING.md,
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: LISTING_UPDATE_SPACING.lg,
    paddingTop: LISTING_UPDATE_SPACING.md,
    paddingBottom: LISTING_UPDATE_SPACING.xxxl,
  },
  inputWrapper: {
    marginBottom: LISTING_UPDATE_SPACING.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: LISTING_UPDATE_COLORS.text,
    marginBottom: LISTING_UPDATE_SPACING.sm,
  },
  required: {
    color: LISTING_UPDATE_COLORS.error,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: LISTING_UPDATE_SPACING.sm,
  },
  charCount: {
    fontSize: 12,
    color: LISTING_UPDATE_COLORS.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LISTING_UPDATE_COLORS.white,
    borderRadius: LISTING_UPDATE_RADII.md,
    borderWidth: 1,
    borderColor: LISTING_UPDATE_COLORS.border,
    paddingHorizontal: LISTING_UPDATE_SPACING.md,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: LISTING_UPDATE_COLORS.text,
    paddingVertical: LISTING_UPDATE_SPACING.md,
  },
  inputError: {
    borderColor: LISTING_UPDATE_COLORS.error,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: LISTING_UPDATE_COLORS.text,
    paddingVertical: LISTING_UPDATE_SPACING.md,
  },
  readonlyInput: {
    justifyContent: 'space-between',
  },
  readonlyText: {
    flex: 1,
    fontSize: 16,
    color: LISTING_UPDATE_COLORS.text,
  },
  placeholderText: {
    color: LISTING_UPDATE_COLORS.textMuted,
  },
  dropdown: {
    flex: 1,
    height: 40,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: LISTING_UPDATE_COLORS.textMuted,
  },
  dropdownSelected: {
    fontSize: 16,
    color: LISTING_UPDATE_COLORS.text,
    fontWeight: '500',
  },
  errorText: {
    marginTop: LISTING_UPDATE_SPACING.xs,
    fontSize: 12,
    color: LISTING_UPDATE_COLORS.error,
  },
  footer: {
    backgroundColor: LISTING_UPDATE_COLORS.white,
    paddingHorizontal: LISTING_UPDATE_SPACING.lg,
    paddingTop: LISTING_UPDATE_SPACING.md,
    paddingBottom: LISTING_UPDATE_SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: LISTING_UPDATE_COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: LISTING_UPDATE_COLORS.primary,
    borderRadius: LISTING_UPDATE_RADII.md,
    paddingVertical: LISTING_UPDATE_SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: LISTING_UPDATE_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: LISTING_UPDATE_COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: LISTING_UPDATE_COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: LISTING_UPDATE_COLORS.white,
    borderTopLeftRadius: LISTING_UPDATE_RADII.xl,
    borderTopRightRadius: LISTING_UPDATE_RADII.xl,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LISTING_UPDATE_SPACING.lg,
    paddingVertical: LISTING_UPDATE_SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: LISTING_UPDATE_COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: LISTING_UPDATE_COLORS.text,
  },
  modalButton: {
    paddingVertical: LISTING_UPDATE_SPACING.sm,
    paddingHorizontal: LISTING_UPDATE_SPACING.md,
  },
  modalCancelText: {
    fontSize: 16,
    color: LISTING_UPDATE_COLORS.textSecondary,
    fontWeight: '500',
  },
  modalConfirmText: {
    fontSize: 16,
    color: LISTING_UPDATE_COLORS.stepActive,
    fontWeight: '600',
  },
  yearList: {
    maxHeight: 400,
  },
  yearListContent: {
    paddingVertical: LISTING_UPDATE_SPACING.sm,
  },
  yearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LISTING_UPDATE_SPACING.xl,
    paddingVertical: LISTING_UPDATE_SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LISTING_UPDATE_COLORS.border,
  },
  yearItemSelected: {
    backgroundColor: '#F0F7FF',
  },
  yearText: {
    fontSize: 17,
    color: LISTING_UPDATE_COLORS.text,
    fontWeight: '500',
  },
  yearTextSelected: {
    color: LISTING_UPDATE_COLORS.stepActive,
    fontWeight: '600',
  },
});
