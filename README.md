# Military Time Range Validator

A stateless validator class used to determine whether a given string represents a valid military (24-hour format) time range.

## Project Overview

This project provides a simple utility that validates military time ranges (e.g., `"01:12 - 14:32"`).
The validator checks that:

* Each time is in valid 24-hour notation (`HH:MM`)
* Both times fall within allowed ranges (`00:00` to `23:59`)
* The full string matches the expected `"HH:MM - HH:MM"` format

This utility is ideal for practicing string parsing, regex validation, and clean class design.

## What is Military Time Validation?

Military time is a timekeeping format where:

* Hours range from **00** to **23**
* Minutes range from **00** to **59**
* No AM/PM suffix is used
  Example: `"18:45"` represents 6:45 PM.

A **military time range** simply consists of two valid times separated by `" - "`.

Examples:

| Time Range        | Valid? |
| ----------------- | ------ |
| `"01:12 - 14:32"` | ✔ Yes  |
| `"25:00 - 12:23"` | ✘ No   |
| `"22:00 - 23:12"` | ✔ Yes  |

## Features

The validator supports:

* Validation of individual military times
* Validation of complete time ranges
* Strict format checking (`HH:MM - HH:MM`)
* Stateless implementation using a simple class with static methods
* Full TypeScript type safety

## Tech Stack

* TypeScript
* Node.js
* Jest (optional if you add tests)

## Project Structure

```
military-time-validator/
├── src/
│   └── militaryTimeValidator.ts
│   └── militaryTimeValidator.spec.ts   (optional test file)
├── package.json
└── README.md
```

## Approach

This project validates military time by:

1. Ensuring the input matches a strict pattern
2. Extracting hours and minutes
3. Checking numeric ranges for:

   * Hours: 0–23
   * Minutes: 0–59
4. Returning a boolean result

## Getting Started

### Installation

```
git clone https://github.com/Mohamed-kamel91/tdd-military-time-validator.git
cd military-time-validator
npm install
```

### Running Tests (if included)

```
npm test
npm run test:dev
```

## API

### `isValidRange(range: string): boolean`

**Parameters:**

* `range (string)` – The time range to validate in `"HH:MM - HH:MM"` format

**Returns:**

* `true` if the time range is valid
* `false` otherwise

## Usage

### Basic Usage

```ts
import { MilitaryTimeValidator } from "./src/militaryTimeValidator";

console.log(MilitaryTimeValidator.isValidRange("01:12 - 14:32")); // true
console.log(MilitaryTimeValidator.isValidRange("25:00 - 12:23")); // false
console.log(MilitaryTimeValidator.isValidRange("22:00 - 23:12")); // true
```

## Learning Goals

* Practice validating formatted input strings
* Learn regex-based validation techniques
* Implement stateless utility classes in TypeScript
* Improve code readability and maintainability
* Build simple reusable utilities useful for real-world projects