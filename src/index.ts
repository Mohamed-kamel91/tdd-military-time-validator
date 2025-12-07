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
  private static readonly INVALID_SEPARATORS = /[\/|~—]|\bto\b/;

  public static isValidRange(timeRange: string): ValidationResult {
    const errors: ValidationResult["errors"] = [];

    if (!timeRange.trim()) {
      errors.push(TIME_RANGE_ERRORS.EMPTY);
    }

    if (!(timeRange.split("-").length - 1)) {
      errors.push(TIME_RANGE_ERRORS.MISSING_SEPARATOR);
    }

    if (this.INVALID_SEPARATORS.test(timeRange)) {
      errors.push(TIME_RANGE_ERRORS.INVALID_SEPARATOR);
    }

    const dashCount = (timeRange.match(/-/g) || []).length;

    if (dashCount > 1) {
      errors.push(TIME_RANGE_ERRORS.MULTIPLE_SEPERATOR);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
