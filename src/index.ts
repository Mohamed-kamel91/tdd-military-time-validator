import { TIME_FORMAT_ERRORS, TIME_VALUE_ERRORS } from "./constants";
import { ValidationResult } from "./types";

export class MilitaryTimeValidator {
  private static readonly TIME_FORMAT = /^\d{2}:\d{2}$/;
  private static readonly INVALID_SEPERATOR = /[\/|~—_]|\bto\b/;

  public static validate(timeRange: string): ValidationResult {
    const errors: ValidationResult["errors"] = [];
    const trimmed = timeRange.trim();

    // Basic format validation
    this.validateEmptyRange(trimmed, errors);

    if (errors.length > 0) {
      return this.createValidationResult(errors);
    }

    this.validateRangeSeperator(trimmed, errors);

    if (errors.length > 0) {
      return this.createValidationResult(errors);
    }

    // Structure validation 
    const [start, end] = this.parseTimeRange(trimmed);
    console.log({start, end});
    
    this.validateTimeSlots(start, end, errors);

    if (errors.length > 0) {
      return this.createValidationResult(errors);
    }

    // Time format validation
    const isStartFormatValid = this.validateTimeFormat(start, "start", errors);
    const isEndFormatValid = this.validateTimeFormat(end, "end", errors);

    // Time range validation
    if (isStartFormatValid) {
      this.validateTimeValue(start, "start", errors);
    }

    if (isEndFormatValid) {
      this.validateTimeValue(end, "end", errors);
    }

    return this.createValidationResult(errors);
  }

  private static validateEmptyRange(
    timeRange: string,
    errors: ValidationResult["errors"]
  ) {
    if (!timeRange) {
      errors.push(TIME_FORMAT_ERRORS.EMPTY);
    }
  }

  private static validateRangeSeperator(
    range: string,
    errors: ValidationResult["errors"]
  ) {
    const dashCount = (range.match(/-/g) || []).length;
    const hasInvalidSeperator =this.INVALID_SEPERATOR.test(range);

    if (dashCount === 0) {
      if (hasInvalidSeperator) {
        errors.push(TIME_FORMAT_ERRORS.INVALID_SEPARATOR);
      } else {
        errors.push(TIME_FORMAT_ERRORS.MISSING_SEPARATOR);
      }
    }

    if (dashCount > 1) {
      errors.push(TIME_FORMAT_ERRORS.MULTIPLE_SEPERATOR);
    }
  }

  private static parseTimeRange(timeRange: string): string[] {
    const segments = timeRange.split("-");
    const start = segments[0]?.trim();
    const end = segments[1]?.trim();
    return [start, end];
  }

  private static validateTimeSlots(
    startTime: string,
    endTime: string,
    errors: ValidationResult["errors"]
  ) {
    if (!startTime && !endTime) {
      errors.push(TIME_FORMAT_ERRORS.MISSING_TIMES);
    } else if (!startTime) {
      errors.push(TIME_FORMAT_ERRORS.MISSING_START_TIME);
    } else if (!endTime) {
      errors.push(TIME_FORMAT_ERRORS.MISSING_END_TIME);
    }
  }

  private static validateTimeFormat(
    time: string,
    type: "start" | "end",
    errors: ValidationResult["errors"]
  ) {
    const isValid = this.TIME_FORMAT.test(time);

    if (!isValid) {
      const error =
        type === "start"
          ? TIME_FORMAT_ERRORS.INVALID_START_TIME_FORMAT
          : TIME_FORMAT_ERRORS.INVALID_END_TIME_FORMAT;

      errors.push(error);
    }

    return isValid;
  }

  private static validateTimeValue(
    time: string,
    type: "start" | "end",
    errors: ValidationResult["errors"]
  ) {
    const [h, m] = time.split(":").map(Number);

    const isValidHour = h >= 0 && h < 24;
    const isValidMinute = m >= 0 && m < 60;

    if (!isValidHour) {
      errors.push(
        type === "start"
          ? TIME_VALUE_ERRORS.INVALID_START_HOUR_RANGE
          : TIME_VALUE_ERRORS.INVALID_END_HOUR_RANGE
      );
    }

    if (!isValidMinute) {
      errors.push(
        type === "start"
          ? TIME_VALUE_ERRORS.INVALID_START_MINUTE_RANGE
          : TIME_VALUE_ERRORS.INVALID_END_MINUTE_RANGE
      );
    }
  }

  private static createValidationResult(errors: ValidationResult["errors"]) {
    return {
      isValid: errors.length === 0,
      errors: [...errors],
    };
  }
}

console.log(MilitaryTimeValidator.validate("12:12 to 12:12"));
