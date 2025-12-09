import { validationError } from ".";

export type TimeRangeErrorKey = keyof typeof TIME_RANGE_ERRORS;

export const TIME_RANGE_ERRORS = {
  EMPTY: {
    type: "invalid_format",
    message: "Time range cannot be empty",
  },
  MISSING_SEPARATOR: {
    type: "invalid_format",
    message: "Time range must contain a '-' separator",
  },
  INVALID_SEPARATOR: {
    type: "invalid_format",
    message: "Only '-' separator is allowed",
  },
  MULTIPLE_SEPERATOR: {
    type: "invalid_format",
    message: "Multiple '-' separator is not allowed",
  },
  MISSING_TIMES: {
    type: "invalid_format",
    message: "Time range must contain start and end times",
  },
  MISSING_START_TIME: {
    type: "invalid_format",
    message: "Start time is missing",
  },
  MISSING_END_TIME: {
    type: "invalid_format",
    message: "End time is missing",
  },
  INVALID_START_TIME_FORMAT: {
    type: "invalid_format",
    message: "Start time must be in HH:MM format",
  },
  INVALID_END_TIME_FORMAT: {
    type: "invalid_format",
    message: "End time must be in HH:MM format",
  },
} as const satisfies Record<string, validationError>;
