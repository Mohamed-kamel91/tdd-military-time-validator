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

- `"12:21 --"` → invalid_format, multiple '-' separator is not allowed."
- `"- 17:23 -"` → invalid_format, multiple '-' separator is not allowed."
- `"- 12:12 - 12:21"` → invalid_format, multiple '-' separator is not allowed."
- `"- 12:12 - 12:21 -"` → invalid_format, multiple '-' separator is not allowed."
- `"01:12 -- 14:32"` → invalid_format, multiple '-' separator is not allowed."
- `"12:23 - 17:23 - 23:11"` → invalid_format, multiple '-' separator is not allowed."

#### Only '-' seperator is allowed (DONE)

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01:12 / 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 — 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 _ 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 | 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 ~ 14:32"` → invalid_format, only '-' is allowed."
- `"01:12 to 14:32"` → invalid_format, only '-' is allowed."

#### Time range must contain exactly two times (start/end) (DONE)

**Valid:**

- `"01:12 - 14:32"`

**Invalid (both times missing):**

- `"-"` → invalid_format, time range must contain exactly two time values.
- `" - "` → invalid_format, time range must contain exactly two time values."

**Invalid (Start time missing):**

- `" - 17:23"` → invalid_format, start time is missing."
- `"-17:23"` → invalid_format, start time is missing."
- `"- 17:23"` → invalid_format, start time is missing."

**Invalid (End time missing):**

- `"17:23-"` → invalid_format, end time is missing."
- `"17:23 -"` → invalid_format, end time is missing."
- `"17:23 - "` → invalid_format, end time is missing."

#### Each time must contain exactly one ':' separator

**Valid:**

- `"01:12 - 14:32"`

**Invalid (missing ':'):**

- `"0112 - 14:32"` → invalid_format, ':' is required in start time."
- `"01 12 - 14:32"` → invalid_format, ':' is required in start time."
- `"01:12 - 1432"` → invalid_format, ':' is required in end time."
- `"01:12 - 14 32"` → invalid_format, ':' is required in end time."
- `"0112 - 14 32"` → invalid_format, ':' is required in both start and times."

**Invalid (too many ':'):**

- `"01::12 - 14:32"` → invalid_format, too many ':' in start time."
- `"01:20 - 14:32:12"` → invalid_format, multiple':' in end time."
- `"01::20 - 14:32:12"` → invalid_format, multiple':' in both start and end times."

#### Only ':' is allowed as the time separator

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01—12 - 14:32"` → invalid_format, only ':' is allowed in time values."
- `"01.12 - 14:32"` → invalid_format, only ':' is allowed."
- `"01:12 - 14/32"` → invalid_format, only ':' is allowed."
- `"01:12 - 14_32"` → invalid_format, only ':' is allowed."
- `"01;12 - 14|32"` → invalid_format, only ':' is allowed."

#### Hours must be exactly two digits

**Valid:**

- `"01:12 - 14:32"`
- `"00:00 - 23:59"`

**Invalid:**

- `"1:12 - 14:32"` → invalid_format, hour must be two digits in start time."
- `"001:12 - 14:32"` → invalid_format, hour must be two digits in start time."
- `"10:12 - 1:32"` → invalid_format, hour must be two digits in end time."
- `"10:12 - 001:32"` → invalid_format, hour must be two digits in end time."
- `"1:12 - 1:32"` → invalid_format, hour must be two digits in both times."

#### Minutes must be exactly two digits

**Valid:**

- `"01:12 - 14:32"`
- `"23:59 - 00:00"`

**Invalid:**

- `"01:1 - 14:32"` → invalid_format, minutes must be two digits in start time."
- `"01:123 - 14:32"` → invalid_format, minutes must be two digits in start time."
- `"10:12 - 14:1"` → invalid_format, minutes must be two digits in end time."
- `"10:12 - 14:123"` → invalid_format, minutes must be two digits in end time."
- `""10:1 - 14:1""` → invalid_format, minutes must be two digits in both times."

#### Hour part must exist

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `":12 - 14:32"` → invalid_format, missing hour in start time."
- `"01:12 - :32"` → invalid_format, missing hour in end time."
- `":12 - :32"` → invalid_format, missing hour in both times."

#### Minutes part must exist

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01 - 14:32"` → invalid_format, missing minutes in start time."
- `"01: - 14:32"` → invalid_format, missing minutes in start time."
- `"01:12 - 14"` → invalid_format, missing minutes in end time."
- `"01:12 - 14:"` → invalid_format, Missing minutes in end time"
- `01 - 14"` → invalid_format, Missing minutes in both times"
- `"01: - 14:"` → invalid_format, Missing minutes in both times"

#### Time value must not include trailing characters

**Valid:**

- `"01:12 - 14:32"`

**Invalid:**

- `"01:12 PM - 14:32"` → invalid_format, AM/PM is not allowed in military time."
- `"10:12 AM - 14:32 PM"` → invalid_format, AM/PM is not allowed in military time."
- `"01:12 - 14:32abc"` → invalid_format, trailing characters are not allowed."
- `"10:12test - 14:32foo"` → invalid_format, trailing characters are not allowed."
 
 
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
