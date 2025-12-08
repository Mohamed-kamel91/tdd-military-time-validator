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

    const times = timeRange.split("-");
    const timesCount = times.filter((time) => time.trim() !== "").length;
    const [start, end] = times;

    if (timesCount === 0) {
      errors.push(TIME_RANGE_ERRORS.MISSING_TIMES);
    }

    if (timesCount === 1) {
      if (start.trim() === "") {
        errors.push(TIME_RANGE_ERRORS.MISSING_START_TIME);
      }

      if (!end || end.trim() === "") {
        errors.push(TIME_RANGE_ERRORS.MISSING_END_TIME);
      }
    }

    if (timesCount > 2) {
      errors.push(TIME_RANGE_ERRORS.TOO_MANY_TIMES);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
