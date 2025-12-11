export type ValidationErrorType = "invalid_format" | "invalid_time";

export type validationError = {
  type: ValidationErrorType;
  message: string;
};

export type ValidationFormatError = validationError & { type: "invalid_format" };
export type ValidationTimeError = validationError & { type: "invalid_time" };

export type ValidationResult = {
  isValid: boolean;
  errors: validationError[];
};
