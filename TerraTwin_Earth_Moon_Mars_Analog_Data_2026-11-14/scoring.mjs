/** TerraTwin source-based qualitative scorer. ES module for web apps.
 * Input rows from analog_pairs.csv (CSV values may be strings).
 * Missing dimensions and unreviewed records are never ranked.
 * No NASA-certified numeric similarity percentage is calculated.
 */
export const ORDINAL = Object.freeze({ Weak: 1, Moderate: 2, Strong: 3 });
export const supportedDimensions = (terrain, geology) =>
  Number(Object.hasOwn(ORDINAL, terrain)) + Number(Object.hasOwn(ORDINAL, geology));

export function overallRating(terrain, geology, reviewStatus) {
  if (!String(reviewStatus ?? '').startsWith('reviewed') || supportedDimensions(terrain, geology) !== 2)
    return 'Insufficient evidence';
  if (terrain === 'Weak' || geology === 'Weak') return 'Weak';
  if (terrain === 'Strong' && geology === 'Strong') return 'Strong';
  return 'Moderate';
}

export function rankPairs(pairRows) {
  return [...pairRows]
    .filter((p) => String(p.review_status ?? '').startsWith('reviewed') &&
      supportedDimensions(p.terrain_rating, p.geology_rating) === 2)
    .sort((a, b) => ORDINAL[b.terrain_rating] - ORDINAL[a.terrain_rating] ||
      ORDINAL[b.geology_rating] - ORDINAL[a.geology_rating] ||
      String(a.pair_id).localeCompare(String(b.pair_id)));
}

export function longitudeSigned(lonEast360) {
  const x = Number(lonEast360);
  if (!Number.isFinite(x)) return null;
  return ((x + 180) % 360 + 360) % 360 - 180;
}

/** Do not silently substitute context coordinates for true feature positions. */
export function getFeaturePin(locationRow, { allowContext = false } = {}) {
  const fLat = locationRow.feature_lat_deg, fLon = locationRow.feature_lon_deg;
  if (fLat !== '' && fLon !== '' && fLat != null && fLon != null) {
    const approximate = String(locationRow.feature_coordinates_status ?? '').startsWith('approximate_');
    return {
      latitude: Number(fLat), longitude: Number(fLon),
      type: approximate ? 'approximate_reference_NOT_surveyed' : 'source_feature',
      warning: locationRow.coordinate_note,
    };
  }
  if (allowContext && locationRow.map_anchor_lat_deg !== '' && locationRow.map_anchor_lon_deg !== '' &&
      locationRow.map_anchor_lat_deg != null && locationRow.map_anchor_lon_deg != null)
    return { latitude: Number(locationRow.map_anchor_lat_deg), longitude: Number(locationRow.map_anchor_lon_deg),
      type: 'context_reference_NOT_feature', warning: locationRow.coordinate_note };
  return null;
}

export function slopeDegrees(dzdx, dzdy) {
  return Math.atan(Math.hypot(dzdx, dzdy)) * 180 / Math.PI;
}

export function reliefMeters(validZ) {
  const z = validZ.filter((v) => Number.isFinite(v));
  return z.length ? Math.max(...z) - Math.min(...z) : null;
}

export function roughnessStdMeters(validZ) {
  const z = validZ.filter((v) => Number.isFinite(v));
  if (!z.length) return null;
  const mu = z.reduce((a, b) => a + b, 0) / z.length;
  return Math.sqrt(z.reduce((s, x) => s + (x - mu) ** 2, 0) / z.length);
}

/** Deliberately disabled by default: new proposed method, NOT NASA rating.
 * Each element requires earthValue, targetValue, tolerance, weight,
 * sameUnits=true, samePhysicalSupport=true, qualityPass=true.
 */
export function experimentalMetricSimilarity(metrics, { authorized = false } = {}) {
  if (!authorized || !Array.isArray(metrics) || !metrics.length) return null;
  let ws = 0, sw = 0;
  for (const x of metrics) {
    if (!(x.sameUnits === true && x.samePhysicalSupport === true && x.qualityPass === true)) return null;
    const {earthValue: e, targetValue: t, tolerance: tau, weight: w} = x;
    if (![e,t,tau,w].every((n) => typeof n === 'number' && Number.isFinite(n)) || tau <= 0 || w <= 0)
      return null;
    ws += w * Math.exp(-Math.abs(e - t) / tau); sw += w;
  }
  return ws / sw;
}
