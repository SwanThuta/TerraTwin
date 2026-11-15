"""Publication scales without promoting unreviewed research leads."""
from copy import deepcopy
from pipeline import csv_loader
from pipeline.models import publishable


def test_new_reviewed_pair_is_published_without_frontend_changes(monkeypatch):
    original = csv_loader.rows
    tables = {name: original(name) for name in (
        'analog_pairs.csv', 'locations.csv', 'location_workflows.csv',
        'comparison_evidence.csv', 'practice_objectives.csv', 'sources.csv',
        'comparison_criteria.csv')}
    pair = deepcopy(tables['analog_pairs.csv'][0])
    pair['pair_id'] = 'TEST-P02'
    pair['earth_feature_id'] = 'TEST-E02'
    earth = deepcopy(next(s for s in tables['locations.csv'] if s['feature_id'] == pair['earth_feature_id'].replace('TEST-E02', 'E01')))
    earth['feature_id'] = 'TEST-E02'
    tables['locations.csv'].append(earth)
    tables['analog_pairs.csv'].append(pair)
    for name in ('location_workflows.csv', 'comparison_evidence.csv', 'practice_objectives.csv'):
        for row in list(tables[name]):
            if row['pair_id'] == 'P01':
                copy = deepcopy(row)
                copy['pair_id'] = 'TEST-P02'
                tables[name].append(copy)
    monkeypatch.setattr(csv_loader, 'rows', lambda name: tables[name])
    output = publishable(csv_loader.load_reviewed())
    assert {p['id'] for p in output['comparisons']} == {'P01', 'TEST-P02'}
    assert len(output['sites']) == 3
    assert sorted(p['rankOrder'] for p in output['comparisons']) == [1, 2]
    assert len({s['id'] for s in output['sources']}) == len(output['sources'])


def test_no_reviewed_pairs_publishes_empty_atlas(monkeypatch):
    monkeypatch.setattr(csv_loader, 'rows', lambda name: [])
    output = publishable(csv_loader.load_reviewed())
    assert output['sites'] == []
    assert output['comparisons'] == []
