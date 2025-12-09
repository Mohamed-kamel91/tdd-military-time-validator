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

    const dashCount = (timeRange.match(/-/g) || []).length;
    const hasInvalidSeperator = /[\/|~—_]|\bto\b/.test(timeRange);

    if (dashCount === 0) {
      errors.push(TIME_RANGE_ERRORS.MISSING_SEPARATOR);
    } else if (dashCount > 1) {
      errors.push(TIME_RANGE_ERRORS.MULTIPLE_SEPERATOR);
    }

    if (hasInvalidSeperator) {
      errors.push(TIME_RANGE_ERRORS.INVALID_SEPARATOR);
    }

    if (errors.length === 0) {
      const [startTime, endTime] = timeRange.split("-");
      const hasStartTime = !!startTime?.trim();
      const hasEndTime = !!endTime?.trim();

      if (!hasStartTime && !hasEndTime) {
        errors.push(TIME_RANGE_ERRORS.MISSING_TIMES);
      } else if (!hasStartTime) {
        errors.push(TIME_RANGE_ERRORS.MISSING_START_TIME);
      } else if (!hasEndTime) {
        errors.push(TIME_RANGE_ERRORS.MISSING_END_TIME);
      }
    }

    if (errors.length === 0) {
      const [startTime, endTime] = timeRange.split("-");
      const isValidTimeFormat = (time: string) => /^\d{2}:\d{2}$/.test(time);
      const { INVALID_START_TIME_FORMAT, INVALID_END_TIME_FORMAT } =
        TIME_RANGE_ERRORS;
        
      if (!isValidTimeFormat(startTime.trim())) {
        errors.push(INVALID_START_TIME_FORMAT);
      }

      if (!isValidTimeFormat(endTime.trim())) {
        errors.push(INVALID_END_TIME_FORMAT);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
