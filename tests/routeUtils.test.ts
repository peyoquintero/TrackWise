import { describe, expect, it } from 'vitest';
import { loadConfig } from '../server/config';
import { loadDatasets } from '../server/data';
import { DEPOTS, findSurroundingTract, formatTimeStr, getHaversineMiles } from '../src/lib/routeUtils';

const { tracts } = loadDatasets(loadConfig({ NODE_ENV: 'test' }).dataDir);

describe('getHaversineMiles', () => {
  it('is zero for identical points', () => {
    expect(getHaversineMiles(28.5, -81.4, 28.5, -81.4)).toBe(0);
  });

  it('is symmetric', () => {
    const ab = getHaversineMiles(28.5583, -81.4282, 28.8029, -81.2695);
    const ba = getHaversineMiles(28.8029, -81.2695, 28.5583, -81.4282);
    expect(ab).toBeCloseTo(ba, 9);
  });

  it('matches a known distance (one degree of latitude is about 69 miles)', () => {
    expect(getHaversineMiles(28, -81, 29, -81)).toBeCloseTo(69.1, 0);
  });
});

describe('formatTimeStr', () => {
  it.each([
    [0, '12:00 AM'],
    [9 * 60 + 5, '9:05 AM'],
    [12 * 60, '12:00 PM'],
    [13 * 60 + 30, '1:30 PM'],
    [24 * 60, '12:00 AM'],
  ])('formats %i minutes as %s', (minutes, expected) => {
    expect(formatTimeStr(minutes)).toBe(expected);
  });
});

describe('findSurroundingTract', () => {
  it('returns null when there are no tracts', () => {
    expect(findSurroundingTract(28.5, -81.4, [])).toBeNull();
  });

  it('returns the tract whose centroid is closest to the point', () => {
    const target = tracts[0];
    if (!target) throw new Error('dataset is empty');
    expect(findSurroundingTract(target.latitude, target.longitude, tracts)?.GEOID).toBe(target.GEOID);
  });
});

describe('DEPOTS', () => {
  it('have unique ids and coordinates inside Central Florida', () => {
    expect(new Set(DEPOTS.map((d) => d.id)).size).toBe(DEPOTS.length);
    for (const d of DEPOTS) {
      expect(d.latitude).toBeGreaterThan(27.5);
      expect(d.latitude).toBeLessThan(29.5);
      expect(d.longitude).toBeGreaterThan(-82.5);
      expect(d.longitude).toBeLessThan(-80.5);
    }
  });
});
