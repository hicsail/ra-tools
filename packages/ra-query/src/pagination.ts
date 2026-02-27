/** The parsed `range` query parameter, preserving FakeRest's [start, end] format. */
export interface Range {
  start: number;
  end: number;
}

/**
 * Parses the `range` query parameter from ra-data-simple-rest / FakeRest.
 * Expected format: JSON-encoded `[start, end]` array, e.g. `[0,24]`
 */
export const parseRange = (value: string): Range => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`Invalid range parameter: expected JSON array, got "${value}"`);
  }

  if (!Array.isArray(parsed) || parsed.length !== 2) {
    throw new Error(`Invalid range parameter: expected [start, end] array`);
  }

  const [start, end] = parsed;

  if (typeof start !== 'number' || typeof end !== 'number') {
    throw new Error(`Invalid range parameter: start and end must be numbers`);
  }

  if (start < 0) {
    throw new Error(`Invalid range parameter: start must be >= 0`);
  }

  if (end < start) {
    throw new Error(`Invalid range parameter: end must be >= start`);
  }

  return { start, end };
};
