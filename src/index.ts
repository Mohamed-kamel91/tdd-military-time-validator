import { TIME_RANGE_ERRORS } from "./constants";

export type ErrorType = "invalid_format" | "invalid_time";

export type validationError = {
  type: "invalid_format" | "invalid_time";
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: validationError[];
};

export class MilitaryTimeValidator {
  public static isValidRange(timeRange: string): ValidationResult {
    const errors: ValidationResult["errors"] = [];

    if (!timeRange.trim()) {
      errors.push(TIME_RANGE_ERRORS.EMPTY);
    }

    if (!(timeRange.split("-").length - 1)) {
      errors.push(TIME_RANGE_ERRORS.MISSING_SEPARATOR);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
