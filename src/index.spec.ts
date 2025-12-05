import { MilitaryTimeValidator } from ".";

describe("Military time validator", () => {
  describe("Time Range Format validation ('HH:MM - HH:MM')", () => {
    describe("Valid time range format", () => {
      it.each([
        "01:12 - 14:32",
        "01:12 -14:32",
        "01:12- 14:32",
        "00:00-23:59",
        " 22:22 - 02:43 ",
      ])("knows '%s' is a valid format", (timeRange) => {
        const result = MilitaryTimeValidator.isValidRange(timeRange);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it("knows that empty time range is invalid", () => {
      const result = MilitaryTimeValidator.isValidRange("");

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        type: "invalid_format",
        message: "Time range cannot be empty",
      });
    });

    it("knows that whitespace-only time range is invalid", () => {
      const result = MilitaryTimeValidator.isValidRange("  ");

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        type: "invalid_format",
        message: "Time range cannot be empty",
      });
    });
  });
});
