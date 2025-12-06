import { MilitaryTimeValidator } from ".";
import { TIME_RANGE_ERRORS } from "./constants";

describe("Military time validator", () => {
  describe("Time Range Format validation ('HH:MM - HH:MM')", () => {
    describe("Valid time range formats", () => {
      it.each([
        "01:12 - 14:32",
        "01:12 -14:32",
        "01:12- 14:32",
        "00:00-23:59",
        " 22:22 - 02:43 ",
      ])("knows '%s' is valid", (timeRange) => {
        const result = MilitaryTimeValidator.isValidRange(timeRange);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe("Invalid time range formats", () => {
      describe("Time range must not be empty", () => {
        it.each(["", "  "])("returns error for empty time range: '%s'", () => {
          const result = MilitaryTimeValidator.isValidRange("");
          expect(result.isValid).toBe(false);
          expect(result.errors).toContainEqual(TIME_RANGE_ERRORS.EMPTY);
        });
      });

      describe("Time range must contain '-' seperator", () => {
        it.each(["01:12", "01:12 14:32"])(
          "returns error for time range '%s' when '-' separator is missing",
          (timeRange) => {
            const result = MilitaryTimeValidator.isValidRange(timeRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
              TIME_RANGE_ERRORS.MISSING_SEPARATOR
            );
          }
        );
      });
    });
  });
});
