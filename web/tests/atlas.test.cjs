const {test} = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const {stripTypeScriptTypes} = require('node:module')

const source = stripTypeScriptTypes(fs.readFileSync('src/atlas.ts', 'utf8'))
const modulePromise = import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))
const actual = JSON.parse(fs.readFileSync('public/data/atlas.json', 'utf8'))

function onePairFixture() {
  const raw = structuredClone(actual)
  const pair = raw.comparisons.find(item => item.id === 'P01')
  raw.comparisons = [pair]
  raw.sites = raw.sites.filter(site => [pair.earthId, pair.targetId].includes(site.id))
  return {raw, pair}
}

test('all eight reviewed desk screens resolve in both directions with incomplete pairs unranked', async () => {
  const {normalizeAtlas, matches} = await modulePromise
  const atlas = normalizeAtlas(actual)
  assert.deepEqual(atlas.comparisons.map(pair => pair.id), Array.from({length:8}, (_, index) => `P${String(index + 1).padStart(2, '0')}`))
  assert.equal(atlas.sites.length, 14)
  assert.deepEqual(atlas.comparisons.filter(pair => pair.rankEligible).map(pair => pair.id), ['P01', 'P05', 'P06', 'P07'])
  assert.deepEqual(matches(atlas, 'L02').map(pair => pair.id), ['P02', 'P03', 'P04'])
  assert.deepEqual(matches(atlas, 'E05', 'mars').map(pair => pair.id), ['P05'])
  assert.deepEqual(matches(atlas, 'E01', 'moon').map(pair => pair.id), ['P01'])
  assert.equal(matches(atlas, 'E01', 'mars').length, 0)
  assert.equal(atlas.sites.find(site => site.id === 'E01').mapPointKind.startsWith('Context reference:'), true)
})

test('additional sites, both planets, multiple matches and missing options normalize safely', async () => {
  const {normalizeAtlas, matches} = await modulePromise
  const {raw, pair} = onePairFixture()
  const earth = raw.sites.find(site => site.id === pair.earthId)
  const target = raw.sites.find(site => site.id === pair.targetId)
  raw.sites.push({...earth, id:'test-earth-2', mapPoint:null}, {...target, id:'test-mars', body:'mars', mapPoint:null})
  raw.comparisons.push(
    {...pair, id:'test-p2', earthId:'test-earth-2', rankOrder:2, visuals:null, practice:null, similarities:null, terrain:null, reportPath:null},
    {...pair, id:'test-p3', targetId:'test-mars'},
    {...pair, id:'broken', targetId:'missing'},
  )
  const atlas = normalizeAtlas(raw)
  assert.equal(atlas.comparisons.length, 3)
  assert.equal(matches(atlas, pair.targetId).length, 2)
  assert.equal(matches(atlas, pair.earthId, 'moon').length, 1)
  assert.equal(matches(atlas, pair.earthId, 'mars').length, 1)
  const missing = atlas.comparisons.find(item => item.id === 'test-p2')
  assert.equal(missing.terrain.rating, null)
  assert.equal(missing.visuals.earth.localPath, null)
  assert.deepEqual(missing.practice, [])
  assert.equal(atlas.sites.find(site => site.id === 'test-earth-2').mapPoint, null)
})

test('zero records, unmappable points and stable fallback ordering', async () => {
  const {normalizeAtlas, matches} = await modulePromise
  assert.deepEqual(normalizeAtlas({sites:[], comparisons:[]}).comparisons, [])
  const {raw, pair} = onePairFixture()
  raw.orderingProfile = ''
  raw.sites[0].mapPoint = [500, 100]
  raw.comparisons.push({...pair, id:'test-second', rankOrder:null})
  raw.comparisons[0].rankOrder = null
  const atlas = normalizeAtlas(raw)
  assert.equal(atlas.sites[0].mapPoint, null)
  assert.deepEqual(matches(atlas, pair.earthId).map(item => item.id), [pair.id, 'test-second'])
})

test('backend target ranks win while reverse search keeps dataset order', async () => {
  const {normalizeAtlas, matches} = await modulePromise
  const {raw, pair} = onePairFixture()
  raw.comparisons = [
    {...pair, id:'test-second', rankOrder:2},
    {...pair, id:'test-first', rankOrder:1},
    {...pair, id:'test-unranked', rankOrder:null, rankEligible:false},
  ]
  const atlas = normalizeAtlas(raw)
  assert.deepEqual(matches(atlas, pair.targetId).map(item => item.id), ['test-first', 'test-second', 'test-unranked'])
  assert.deepEqual(matches(atlas, pair.earthId).map(item => item.id), ['test-second', 'test-first', 'test-unranked'])
})

test('nullable visuals, unsafe links and unreviewed candidates degrade locally', async () => {
  const {normalizeAtlas, safeUrl} = await modulePromise
  const {raw, pair} = onePairFixture()
  raw.comparisons.push(
    {...pair, id:'test-incomplete', visuals:{earth:null, target:null}, terrain:null, practice:null, reportPath:'javascript:alert(1)'},
    {...pair, id:'test-unreviewed', status:'sourced-candidate'},
  )
  raw.criteria.push({id:'test-criterion'})
  raw.sources.push({id:'test-source', url:'javascript:alert(1)'})
  const atlas = normalizeAtlas(raw)
  assert.equal(atlas.comparisons.length, 2)
  assert.equal(atlas.comparisons[1].visuals.earth.localPath, null)
  assert.equal(atlas.comparisons[1].reportPath, '')
  assert.equal(atlas.criteria.at(-1).readiness, '')
  assert.equal(atlas.sources.at(-1).url, '')
  assert.equal(safeUrl('reports/reviewed.pdf'), true)
  assert.equal(safeUrl('//untrusted.example/report.pdf'), false)
})
