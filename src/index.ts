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

    return {
      isValid: true,
      errors: [],
    };
  }
}
