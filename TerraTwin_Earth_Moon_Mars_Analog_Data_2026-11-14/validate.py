from pathlib import Path
import csv, sys
from scoring import overall_rating, supported_dimensions, rank_pairs, lon180, historical_traffic_zone, experimental_metric_similarity
root=Path(__file__).resolve().parent

def read(name):
    with (root/name).open(encoding="utf-8-sig",newline="") as f: return list(csv.DictReader(f))
locations=read("locations.csv");pairs=read("analog_pairs.csv");src=read("sources.csv");workflow=read("location_workflows.csv")
lids={r['feature_id'] for r in locations};ids={r['source_id'] for r in src}
assert len(locations)==18 and len(lids)==18, 'Must have 18 unique locations'
assert len(pairs)==8 and len({p['pair_id'] for p in pairs})==8
assert len(workflow)==48
for p in pairs:
    assert p['earth_feature_id'] in lids and p['planetary_feature_id'] in lids
    assert overall_rating(p['terrain_rating'],p['geology_rating'],p['review_status'])==p['overall_rating']
    assert supported_dimensions(p['terrain_rating'],p['geology_rating'])==int(p['supported_dimensions_count'])
    for key in ('terrain_evidence','geology_evidence'):
        assert set(p[key].split(';'))<=ids, (p['pair_id'],key)
for loc in locations:
    assert set(loc['feature_source_ids'].split(';'))<=ids, loc['feature_id']
    assert set(loc['coordinate_source_id'].split(';'))<=ids, loc['feature_id']
    if loc['feature_coordinates_status']=='not_source_verified':
        assert loc['feature_lat_deg']=='' and loc['feature_lon_deg']==''
    if loc['feature_lat_deg']:
        lat=float(loc['feature_lat_deg']);lon=float(loc['feature_lon_deg'])
        assert -90<=lat<=90
        assert (-180<=lon<=180 if loc['body']=='Earth' else 0<=lon<360)
for step in workflow:
    assert set(step['source_ids'].split(';'))<=ids
assert [p['pair_id'] for p in rank_pairs(pairs)] == ['P01']
assert abs(lon180(303.2299)+56.7701) < 1e-9
assert historical_traffic_zone(10,0,0,0,'Firm')==2
assert historical_traffic_zone(10,None,0,0,'Firm') is None
assert experimental_metric_similarity([],authorized=False) is None
print('PASS: 18 locations, 8 pairs, 48 workflow steps, sources and qualitative ratings cross-validated')
