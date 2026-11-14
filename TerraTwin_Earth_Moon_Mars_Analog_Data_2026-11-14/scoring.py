"""TerraTwin: source-rubric qualitative rating and OPTIONAL experimental metrics.

NO NASA-certified numeric similarity percentage is produced by this module.
Blank CSV dimensions remain None/insufficient; no data is fabricated.
"""
import math
from typing import Any, Iterable, Mapping
VALID = {"Weak": 1, "Moderate": 2, "Strong": 3}


def supported_dimensions(terrain_rating: str | None, geology_rating: str | None) -> int:
    return int(terrain_rating in VALID) + int(geology_rating in VALID)


def overall_rating(terrain_rating: str | None, geology_rating: str | None, review_status: str) -> str:
    if not review_status.startswith("reviewed") or supported_dimensions(terrain_rating, geology_rating) != 2:
        return "Insufficient evidence"
    if terrain_rating == "Weak" or geology_rating == "Weak":
        return "Weak"
    if terrain_rating == geology_rating == "Strong":
        return "Strong"
    return "Moderate"


def rank_pairs(pairs: Iterable[Mapping[str, Any]]) -> list[Mapping[str, Any]]:
    rated = [p for p in pairs if p.get("review_status", "").startswith("reviewed")
             and supported_dimensions(p.get("terrain_rating"), p.get("geology_rating")) == 2]
    return sorted(rated, key=lambda p: (-VALID[p["terrain_rating"]], -VALID[p["geology_rating"]], p["pair_id"]))


def lon180(lon_deg: float) -> float:
    """Display conversion only. Moon/Mars are NOT WGS84 Earth positions."""
    return ((lon_deg + 180.0) % 360.0) - 180.0


def slope_deg(dzdx: float, dzdy: float) -> float:
    """Input gradients computed from DEM x/y in projected meters."""
    return math.degrees(math.atan(math.hypot(dzdx, dzdy)))


def relief_m(valid_z: Iterable[float]) -> float | None:
    zs = [float(v) for v in valid_z if math.isfinite(float(v))]
    return max(zs)-min(zs) if zs else None


def roughness_std_m(valid_z: Iterable[float]) -> float | None:
    zs = [float(v) for v in valid_z if math.isfinite(float(v))]
    if not zs: return None
    mu=sum(zs)/len(zs)
    return math.sqrt(sum((x-mu)**2 for x in zs)/len(zs))


def valid_fraction(valid_count: int, total_count: int) -> float | None:
    return valid_count/total_count if total_count > 0 and 0 <= valid_count <= total_count else None


def channel_density(channel_length_km: float, area_km2: float) -> float | None:
    return channel_length_km/area_km2 if area_km2 > 0 and channel_length_km >= 0 else None


def fan_area_ratio():
    """Context ONLY: Peace 80 / Copper approx 5.2 = 15.38; NOT similarity score."""
    return 80.0 / 5.2


def historical_traffic_zone(slope_deg_value: float | None,
                             medium_rock_pct: float | None, large_rock_pct: float | None,
                             very_large_rock_pct: float | None, soil: str | None) -> int | None:
    """NASA 2011 report Table 6: historical test zoning; NOT vehicle safety clearance.
    All inputs required to avoid misclassifying missing data as safe.
    """
    vals=(slope_deg_value,medium_rock_pct,large_rock_pct,very_large_rock_pct)
    if soil is None or soil not in {"Firm", "Soft", "Very soft"} or any(x is None or x < 0 for x in vals):
        return None
    a,m,l,v=vals
    if a > 20 or m > 40 or l > 20 or v > 15 or soil == "Very soft": return 4
    if a > 15 or m > 10 or l > 5 or v > 5 or soil == "Soft": return 3
    if a > 5 or m >= 1 or l >= 1 or v >= 1: return 2
    return 1


def experimental_metric_similarity(matched_metrics: Iterable[dict], *, authorized: bool = False) -> float | None:
    """Non-NASA research helper, disabled by default. All metrics must be comparable:
    dict keys: earth_value, target_value, tolerance, weight, same_units, same_physical_support, quality_pass
    Returns None when disabled, missing, mismatched or invalid. Never present as NASA rating.
    """
    if not authorized: return None
    metrics=list(matched_metrics)
    if not metrics: return None
    weighted, total=0.0, 0.0
    for m in metrics:
        if not (m.get("same_units") is True and m.get("same_physical_support") is True and m.get("quality_pass") is True):
            return None
        try:
            x=float(m["earth_value"]); y=float(m["target_value"])
            tau=float(m["tolerance"]); w=float(m["weight"])
        except (ValueError,TypeError,KeyError): return None
        if not (all(math.isfinite(v) for v in (x,y,tau,w)) and tau>0 and w>0): return None
        weighted += w * math.exp(-abs(x-y)/tau)
        total += w
    return weighted/total if total > 0 else None
