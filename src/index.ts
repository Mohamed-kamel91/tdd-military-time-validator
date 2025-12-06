export class MilitaryTimeValidator {
  public static isValidRange(timeRange: string) {
    if (!timeRange.trim()) {
      return {
        isValid: false,
        errors: [
          {
            type: "invalid_format",
            message: "Time range cannot be empty",
          },
        ],
      };
    }

    if (!(timeRange.split("-").length - 1)) {
      return {
        isValid: false,
        errors: [
          {
            type: "invalid_format",
            message: "Time range must contain a '-' separator",
          },
        ],
      };
    }

    return {
      isValid: true,
      errors: [],
    };
  }
}
