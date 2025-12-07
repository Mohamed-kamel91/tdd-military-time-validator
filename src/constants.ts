import { validationError } from ".";

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
} as const satisfies Record<string, validationError>;
