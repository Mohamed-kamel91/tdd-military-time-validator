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
} as const satisfies Record<string, validationError>;
