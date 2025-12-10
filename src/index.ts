import { TIME_RANGE_ERRORS, TIME_VALUE_ERRORS } from "./constants";

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

    const trimmed = timeRange.trim();

    if (!trimmed) {
      errors.push(TIME_RANGE_ERRORS.EMPTY);
    }

    const dashCount = (trimmed.match(/-/g) || []).length;
    const hasInvalidSeperator = /[\/|~—_]|\bto\b/.test(trimmed);

    if (dashCount === 0) {
      errors.push(TIME_RANGE_ERRORS.MISSING_SEPARATOR);
    } else if (dashCount > 1) {
      errors.push(TIME_RANGE_ERRORS.MULTIPLE_SEPERATOR);
    }

    if (hasInvalidSeperator && dashCount === 0) {
      errors.push(TIME_RANGE_ERRORS.INVALID_SEPARATOR);
    }

    const segments = trimmed.split("-");
    const startTime = segments[0]?.trim();
    const endTime = segments[1]?.trim();

    if (dashCount === 1) {
      if (!startTime && !endTime) {
        errors.push(TIME_RANGE_ERRORS.MISSING_TIMES);
      } else if (!startTime) {
        errors.push(TIME_RANGE_ERRORS.MISSING_START_TIME);
      } else if (!endTime) {
        errors.push(TIME_RANGE_ERRORS.MISSING_END_TIME);
      }
    }

    const isHHMM = (time: string) => /^\d{2}:\d{2}$/.test(time);

    if (startTime && !isHHMM(startTime)) {
      errors.push(TIME_RANGE_ERRORS.INVALID_START_TIME_FORMAT);
    }

    if (endTime && !isHHMM(endTime)) {
      errors.push(TIME_RANGE_ERRORS.INVALID_END_TIME_FORMAT);
    }

    if (errors.length === 0) {
      const [startHour] = startTime.split(":");
      const [endHour] = endTime.split(":");

      if (Number(startHour) < 0 || Number(startHour) > 23) {
        errors.push(TIME_VALUE_ERRORS.INVALID_START_HOUR_RANGE);
      } 

      if (Number(endHour) < 0 || Number(endHour) > 23) {
        errors.push(TIME_VALUE_ERRORS.INVALID_END_HOUR_RANGE);
      } 
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

console.log(MilitaryTimeValidator.isValidRange("18:17 - 24:00"));
 
