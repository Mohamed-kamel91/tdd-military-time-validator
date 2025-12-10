import { MilitaryTimeValidator, validationError } from ".";
import { TIME_RANGE_ERRORS, TimeRangeErrorKey } from "./constants";

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

      describe("Only '-' seperator is allowed in time range", () => {
        it.each([
          ["01:12 / 14:32", "/"],
          ["01:12 — 14:32", "—"],
          ["01:12 _ 14:32", "_"],
          ["01:12 | 14:32", "|"],
          ["01:12 ~ 14:32", "~"],
          ["01:12 to 14:32", "to"],
        ])(
          "returns error for time range '%s' with invalid separator '%p'",
          (timeRange) => {
            const result = MilitaryTimeValidator.isValidRange(timeRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
              TIME_RANGE_ERRORS.INVALID_SEPARATOR
            );
          }
        );
      });

      describe("Time range must contain one '-' seperator only", () => {
        it.each([
          "12:21 --",
          "- 17:23 -",
          "- 12:12 - 12:21",
          "- 12:12 - 12:21 -",
          "01:12 -- 14:32",
          "12:23 - 17:23 - 23:11",
        ])(
          "returns error for time range '%s' with multiple '-' seperators",
          (timeRange) => {
            const result = MilitaryTimeValidator.isValidRange(timeRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
              TIME_RANGE_ERRORS.MULTIPLE_SEPERATOR
            );
          }
        );
      });

      describe("Time range must contain two times (start/end)", () => {
        it.each(["-", " - "])(
          "returns error for time range '%s' with missing start and end times",
          (timeRange) => {
            const result = MilitaryTimeValidator.isValidRange(timeRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
              TIME_RANGE_ERRORS.MISSING_TIMES
            );
          }
        );

        it.each([" -17:23", "- 17:23", " - 17:23"])(
          "returns error for time range '%s' with missing start time",
          (timeRange) => {
            const result = MilitaryTimeValidator.isValidRange(timeRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
              TIME_RANGE_ERRORS.MISSING_START_TIME
            );
          }
        );

        it.each(["12:23-", "17:23 -", "17:23 - "])(
          "returns error for time range '%s' with missing end time",
          (timeRange) => {
            const result = MilitaryTimeValidator.isValidRange(timeRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
              TIME_RANGE_ERRORS.MISSING_END_TIME
            );
          }
        );
      });

      describe("Start/End times must be in 'HH:MM' format", () => {
        it.each([
          ["0112 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
          ["01 12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
          ["01:12 - 1432", "end", ["INVALID_END_TIME_FORMAT"]],
          ["01:12 - 14 32", "end", ["INVALID_END_TIME_FORMAT"]],
          [
            "0112 - 14 32",
            "start & end",
            ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
          ],
        ])(
          "returns format error for time range'%s' when %s time missing ':' seperator",
          (timeRange, _, errorKeys) => {
            const expectedErrors = errorKeys.map(
              (key) => TIME_RANGE_ERRORS[key as TimeRangeErrorKey]
            );

            const result = MilitaryTimeValidator.isValidRange(timeRange);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(expectedErrors);
          }
        );

        it.each([
          ["01::12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
          ["01:20 - 14:32:12", "start", ["INVALID_END_TIME_FORMAT"]],
          [
            "01::20 - 14:32:12",
            "end",
            ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
          ],
        ])(
          "returns format error for time range '%s' when %s time with multiple ':' seperators",
          (timeRange, _, errorKeys) => {
            const expectedErrors = errorKeys.map(
              (key) => TIME_RANGE_ERRORS[key as TimeRangeErrorKey]
            );

            const result = MilitaryTimeValidator.isValidRange(timeRange);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(expectedErrors);
          }
        );
      });
    });
  });
});
