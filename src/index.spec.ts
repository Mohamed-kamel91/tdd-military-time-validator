import { MilitaryTimeValidator } from ".";
import {
  TIME_RANGE_ERRORS,
  TIME_VALUE_ERRORS,
  TimeRangeErrorKey,
  TimeValueErrorKey,
} from "./constants";

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
        it.each(["", "  "])("rejects empty time range: '%s'", () => {
          const result = MilitaryTimeValidator.isValidRange("");
          expect(result.isValid).toBe(false);
          expect(result.errors).toContainEqual(TIME_RANGE_ERRORS.EMPTY);
        });
      });

      describe("Time range must contain '-' seperator", () => {
        it.each(["01:12", "01:12 14:32"])(
          "rejects time range '%s' when '-' separator is missing",
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
          "rejects time range '%s' with invalid separator '%s'",
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
          "rejects time range '%s' with multiple '-' seperators",
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
          "rejects time range '%s' with missing start and end times",
          (timeRange) => {
            const result = MilitaryTimeValidator.isValidRange(timeRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
              TIME_RANGE_ERRORS.MISSING_TIMES
            );
          }
        );

        it.each([" -17:23", "- 17:23", " - 17:23"])(
          "rejects time range '%s' with missing start time",
          (timeRange) => {
            const result = MilitaryTimeValidator.isValidRange(timeRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
              TIME_RANGE_ERRORS.MISSING_START_TIME
            );
          }
        );

        it.each(["12:23-", "17:23 -", "17:23 - "])(
          "rejects time range '%s' with missing end time",
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
        const expectFormatErrors = (timeRange: string, errorKeys: string[]) => {
          const expectedErrors = errorKeys.map(
            (key) => TIME_RANGE_ERRORS[key as TimeRangeErrorKey]
          );

          const result = MilitaryTimeValidator.isValidRange(timeRange);

          expect(result.isValid).toBe(false);
          expect(result.errors).toEqual(expectedErrors);
        };

        describe("Missing ':' separator", () => {
          it.each([
            ["0112 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["01 12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["01:12 - 1432", "end", ["INVALID_END_TIME_FORMAT"]],
            ["01:12 - 14 32", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              "0112 - 14 32",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time range '%s' with missing colon in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );
        });

        describe("Multiple ':' separators", () => {
          it.each([
            ["01::12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["01:20 - 14:32:12", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              "01::20 - 14:32:12",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time range '%s' with multiple colons in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );
        });

        describe("Invalid time separator", () => {
          it.each([
            ["01—12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["01.12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["01:12 - 14/32", "end", ["INVALID_END_TIME_FORMAT"]],
            ["01:12 - 14_32", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              "01;12 - 14|32",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time range '%s' with wrong separator in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );
        });

        describe("Hours must be exactly two digits", () => {
          it.each([
            ["1:12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["001:12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["10:12 - 1:32", "end", ["INVALID_END_TIME_FORMAT"]],
            ["10:12 - 001:32", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              "1:12 - 1:32",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time range '%s' with invalid hour digits in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );
        });

        describe("Minutes must be exactly two digits", () => {
          it.each([
            ["01:1 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["01:123 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["10:12 - 14:1", "end", ["INVALID_END_TIME_FORMAT"]],
            ["10:12 - 14:123", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              "10:1 - 14:1",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time range '%s' with invalid minute digits in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );
        });

        describe("Missing Hour part in time", () => {
          it.each([
            [":12 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["10:12 - :32", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              ":12 - :32",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time range '%s' with missing hour in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );
        });

        describe("Missing minutes part in time", () => {
          it.each([
            ["01 - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["01: - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["01:12 - 14", "end", ["INVALID_END_TIME_FORMAT"]],
            ["01:12 - 14:", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              "01 - 14",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
            [
              "01: - 14:",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time range '%s' with missing minutes in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );
        });

        describe("Time must not include trailing characters", () => {
          it.each([
            ["10:12 PM - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["10:12 - 14:32 PM", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              "10:12 AM - 14:32 PM",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time '%s' with AM/PM in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );

          it.each([
            ["10:12abc - 14:32", "start", ["INVALID_START_TIME_FORMAT"]],
            ["10:12 - 14:32xyz", "end", ["INVALID_END_TIME_FORMAT"]],
            [
              "10:12test - 14:32foo",
              "both",
              ["INVALID_START_TIME_FORMAT", "INVALID_END_TIME_FORMAT"],
            ],
          ])(
            "rejects time range '%s' with trailing characters in %s time",
            (timeRange, _, errorKeys) => {
              expectFormatErrors(timeRange, errorKeys);
            }
          );
        });
      });
    });
  });

  describe("Time Range Hours/Minutes bounds validation ('00:00 - 23:59')", () => {
    const getTimeValueErrors = (errors: string[]) => 
      errors.map((key) => TIME_VALUE_ERRORS[key as TimeValueErrorKey]);

    describe("Hours must be between 00-23", () => {
      it.each([
        ["25:00 - 12:23", "start", ["INVALID_START_HOUR_RANGE"]],
        ["18:17 - 24:00", "end", ["INVALID_END_HOUR_RANGE"]],
        [
          "99:12 - 26:00",
          "both",
          ["INVALID_START_HOUR_RANGE", "INVALID_END_HOUR_RANGE"],
        ],
      ])(
        "reject time range '%s' with hour out of range in %s time",
        (timeRange, _, errors) => {
          const result = MilitaryTimeValidator.isValidRange(timeRange);
          console.log(getTimeValueErrors(errors));

          expect(result.isValid).toBe(false);
          expect(result.errors).toEqual(getTimeValueErrors(errors));
        }
      );
    });
  });
});
