# Description

Write a utility class capable of validating whether a string time range is a valid military time range or not.

# Approach

This project validates military time by:

1. Ensuring the input matches a strict pattern
2. Extracting hours and minutes
3. Checking numeric ranges for:
   - Hours: 0–23
   - Minutes: 0–59
4. Returning validation object result

```ts
{
   isValid: boolean,
   errors: {
      type: "invalid_format" | "invalid_time",
      message: string,
   }[]
}
```

# Requirements

## 1. Validate Time Range Format ("HH:MM - HH:MM")

### Valid formats: (DONE)

- `"01:12 - 14:32"`
- `"01:12 -14:32"`
- `"01:12- 14:32"`
- `"00:00-23:59"`
- `" 22:22 - 02:43 "`

#### Time range must not be empty (DONE)

**Valid:**

- `"01:12 - 14:32"`
- `"00:00 - 23:59"`

**Invalid:**

- `""` → invalid_format, time range cannot be empty.
- `" "` → invalid_format, time range cannot be empty.

#### Time range must contain '-' separator (DONE)

**Valid:**

- `"01:12 - 14:32"`
- `"01:12-14:32"`
- `"01:12 -14:32"`
- `"01:12- 14:32"`

**Invalid:**

- `"17:23"` → invalid_format, missing '-' separator."
- `"01:12 14:32"` → invalid_format, missing '-' separator."

#### Only one single '-' seperator is allowed (DONE)

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01:12 -- 14:32"` → invalid_format, multiple '-' separator is not allowed."
- `"12:23 - 17:23 - 23:11"` → invalid_format, multiple '-' separator is not allowed."

#### Only '-' seperator is allowed (DONE)

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01:12 / 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 — 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 | 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 ~ 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 to 14:32"` → invalid_format, only '-' is allowed."

#### Time range must contain exactly two time values

**Valid:**

- `"01:12 - 14:32"`

**Invalid (both times missing):**

- `" "` → invalid_format, time range must contain exactly two time values.
- `" - "` → invalid_format, time range must contain exactly two time values."

**Invalid (Start time missing):**

- `" - 17:23"` → invalid_format, start time is missing."

**Invalid (End time missing):**

- `"12:23"` → invalid_format, end time is missing."
- `"17:23 - "` → invalid_format, end time is missing."

**Invalid (Multiple times):**

- `"12:23 - 17:23 - 23:11"` → invalid_format,time range must contain exactly two time values."

#### Each time must contain exactly one ':' separator

**Valid:**

- `"01:12 - 14:32"`

**Invalid (missing ':'):**

- `"0112 - 14:32"` → invalid_format, ':' is required in start time."
- `"01 12 - 14:32"` → invalid_format, ':' is required in start time."
- `"01:12 - 1432"` → invalid_format, ':' is required in end time."

**Invalid (too many ':'):**

- `"01::12 - 14:32"` → invalid_format, too many ':' in start time."
- `"0:1:12 - 14:32"` → invalid_format, invalid HH:MM format."
- `"01:1:2 - 14:32"` → invalid_format, invalid HH:MM format."

#### Only ':' is allowed as the time separator

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01-12 - 14:32"` → invalid_format, only ':' is allowed in time values."
- `"01/12 - 14:32"` → invalid_format, only ':' is allowed."
- `"01.12 - 14:32"` → invalid_format, only ':' is allowed."
- `"01_12 - 14:32"` → invalid_format, only ':' is allowed."
- `"01;12 - 14:32"` → invalid_format, only ':' is allowed."

#### Hours must be exactly two digits

**Valid:**

- `"01:12 - 14:32"`
- `"00:00 - 23:59"`

**Invalid:**

- `"1:12 - 14:32"` → invalid_format, hour must be exactly two digits."
- `"001:12 - 14:32"` → invalid_format, hour must be exactly two digits."

#### Minutes must be exactly two digits

**Valid:**

- `"01:12 - 14:32"`
- `"23:59 - 00:00"`

**Invalid:**

- `"01:1 - 14:32"` → invalid_format, minutes must be exactly two digits."
- `"01:123 - 14:32"` → invalid_format, minutes must be exactly two digits."

#### Time value must not include trailing characters

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01:12 - 14:32 PM"` → invalid_format, AM/PM is not allowed in military time."
- `"01:12 - 14:32abc"` → invalid_format, trailing characters are not allowed."

#### Hour part must exist

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `":12 - 14:32"` → invalid_format, missing hour in start time."
- `"01:12 - :32"` → invalid_format, missing hour in end time."

#### Minutes part must exist

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01 - 14:32"` → invalid_format, missing minutes in start time."
- `"01:12 - 14"` → invalid_format, missing minutes in end time."
- `"01: - 14:32"` → invalid_format, minutes must exist."
- `"01:12 - 14:"` → invalid_format, minutes must exist."

---

## 2. Validate hour / minutes in a single time ("00:00 - 23:59")

#### Hours must be between 00–23

**Valid:**

- `"00:00 - 23:59"`
- `"12:45 - 10:00"`
- `"23:59 - 00:00"` (wrap-around is still valid)

**Invalid:**

- `"18:17 - 24:00"` → "invalid_time", hour '24' is out of range (must be 00–23).
- `"25:00 - 12:23"` → "invalid_time", hour '25' is out of range (must be 00–23).
- `"99:12 - 10:00"` → "invalid_time", hour '99' is out of range (must be 00–23).

#### Minutes must be between 00–59

**Valid:**

- `"25:00 - 12:23"`
- `"12:45 - 10:00"`
- `"00:00 - 23:59" (edge case)`
- `"23:59 - 00:00" (edge case)`

**Invalid:**

- `"12:00 - 10:60"` → "invalid_time", minute '60' is out of range (must be 00–59).
- `"08:99 - 09:00"` → "invalid_time", minute '99' is out of range (must be 00–59).
