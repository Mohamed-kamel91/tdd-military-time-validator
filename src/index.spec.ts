import { MilitaryTimeValidator } from ".";

describe("Military time validator", () => {
  describe("Time Range Format validation ('HH:MM - HH:MM')", () => {
    it("knows that '01:12 - 14:32' is valid military time range format", () => {
      const result = MilitaryTimeValidator.isValidRange();
      expect(result.isValid).toBe(true);
    });
  });
});
