import { useEffect, useMemo, useState } from 'react'
import MapPanel from './MapPanel'
import type { Atlas, Comparison, Dimension, Source, Visual } from './types'

const dataUrl = `${import.meta.env.BASE_URL}data/atlas.json`
const fileUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

function SourceLinks({ ids, sources }: { ids: string[]; sources: Source[] }) {
  const unique = [...new Set(ids)]
  return <span className="source-links">{unique.map(id => {
    const source = sources.find(item => item.id === id)
    return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer" title={`${source.title} · ${source.locator}`}>{id} ↗</a> : null
  })}</span>
}

function VisualCard({ title, visual, sources }: { title: string; visual: Visual; sources: Source[] }) {
  return <div className="visual-card">
    {visual.localPath ? <img src={fileUrl(visual.localPath)} alt={`${title} terrain evidence`} /> : <div className="visual-empty"><span className="visual-icon" aria-hidden="true">◇</span><strong>Image pending</strong><span>{visual.missingReason}</span></div>}
    <div className="visual-caption"><strong>{title}</strong><span>{visual.scale}</span><small>{visual.credit} · <SourceLinks ids={[visual.sourceId]} sources={sources} /></small></div>
  </div>
}

function DimensionCard({ title, dimension, sources }: { title: string; dimension: Dimension; sources: Source[] }) {
  return <section className="dimension-card">
    <div className="dimension-head"><h4>{title}</h4><span className={`rating ${dimension.rating?.toLowerCase() || 'missing'}`}>{dimension.rating || 'Not rated'}</span></div>
    <p>{dimension.evidence}</p>
    <p className="difference"><strong>Difference</strong> {dimension.difference}</p>
    {dimension.missingReason && <p className="missing-reason">Review gap: {dimension.missingReason}</p>}
    <div className="evidence-ref">Evidence <SourceLinks ids={dimension.sourceIds} sources={sources} /></div>
  </section>
}

function ComparisonView({ item, atlas }: { item: Comparison; atlas: Atlas }) {
  const earth = atlas.sites.find(site => site.id === item.earthId)!
  const target = atlas.sites.find(site => site.id === item.targetId)!
  return <article className="comparison-view">
    <div className="comparison-header">
      <div><span className="eyebrow">{item.id} · {item.status === 'reviewed' ? 'Reviewed comparison' : 'Sourced candidate'}</span><h3>{earth.name} <span>↔</span> {target.name}</h3></div>
      <div className="comparison-actions"><span className={`overall ${item.rankEligible ? 'reviewed' : 'pending'}`}>{item.overall}</span><a className="report-button" href={fileUrl(item.reportPath)} download>Download evidence PDF ↓</a></div>
    </div>
    <p className="lead">{item.relationship} <SourceLinks ids={item.relationshipSourceIds} sources={atlas.sources} /></p>
    <div className="scope-grid">
      <div><span>Earth feature</span><strong>{earth.feature}</strong><small>{earth.locator}</small></div>
      <div><span>{target.body} feature</span><strong>{target.feature}</strong><small>{target.locator}</small></div>
    </div>
    <div className="dimension-grid"><DimensionCard title="Terrain / landform" dimension={item.terrain} sources={atlas.sources} /><DimensionCard title="Geology / materials" dimension={item.geology} sources={atlas.sources} /></div>
    <div className="review-line"><strong>{item.coverage}/2 dimensions supported</strong><span>Evidence completeness, not scientific confidence</span>{!item.rankEligible && <em>Outside ranked results</em>}</div>
    <section className="story-block"><span className="eyebrow">Evidence-based explanation · template v1</span><h4>Why this comparison matters</h4><p>{item.explanation}</p><SourceLinks ids={item.explanationSourceIds} sources={atlas.sources} /></section>
    <section className="visual-section"><div className="section-title"><div><span className="eyebrow">Terrain evidence</span><h4>Source images</h4></div><span className="scale-warning">Images pending · scales differ</span></div><div className="visual-grid"><VisualCard title={earth.name} visual={item.visuals.earth} sources={atlas.sources} /><VisualCard title={target.name} visual={item.visuals.target} sources={atlas.sources} /></div></section>
    <div className="bottom-grid">
      <section className="support-card"><span className="eyebrow">Possible field practice</span><h4>Evidence-backed activities</h4>{item.practice.length ? item.practice.map(tag => <div key={tag.id} className="practice-item"><strong>{tag.label}</strong><p>{tag.reason}</p><SourceLinks ids={tag.sourceIds} sources={atlas.sources} /></div>) : <p>No activity tag is assigned until the P07 review is completed.</p>}</section>
      <section className="support-card"><span className="eyebrow">Analogy limits</span><h4>Where it differs</h4><ul>{item.limits.map(limit => <li key={limit}>{limit}</li>)}</ul><SourceLinks ids={item.limitSourceIds} sources={atlas.sources} /></section>
    </div>
    <details className="method-details"><summary>How this comparison was made <span>+</span></summary><div className="method-content"><p><strong>Method:</strong> {atlas.reviewProfile}; {atlas.orderingProfile}. Terrain is the first ordering dimension. An overall Weak follows from any Weak dimension when both are rated; a missing dimension yields Insufficient evidence.</p><p><strong>Review:</strong> {item.reviewer || 'Pending'} · {item.reviewDate || 'Not yet reviewed'}. {item.reviewNotes}</p><p><strong>Map locator:</strong> {earth.mapPointKind}. It is a regional point, not the reviewed feature footprint. <SourceLinks ids={[earth.mapPointSourceId]} sources={atlas.sources} /></p><p><strong>Source access:</strong> links above identify the original publication, figure or map locator. The downloadable report uses this same validated record.</p></div></details>
  </article>
}

function MethodPage({ atlas }: { atlas: Atlas | null }) {
  return <main className="page method-page"><a className="back-link" href="#/atlas">← Back to atlas</a><span className="eyebrow">Method & sources</span><h1>Read the evidence before the label.</h1><p className="page-intro">TerraTwin screens named Earth and planetary features for possible field-practice relevance. Labels are qualitative judgments, not measured similarity percentages or safety approvals.</p><div className="method-cards"><section><span>01 / Terrain first</span><h2>Landform</h2><p>Compare cited shapes and visible subfeatures at a meaningful field scale. A shared “crater” or “fan” name alone is not a Strong match.</p></section><section><span>02 / Geology second</span><h2>Materials</h2><p>Compare supported deposit or material classes. Missing evidence is recorded as missing, not treated as a poor match.</p></section><section><span>03 / Fixed rule</span><h2>Ordinal rating</h2><p>Strong requires two Strong dimensions. Moderate requires both at least Moderate. Any Weak dimension makes the overall Weak. A null dimension makes it Insufficient evidence.</p></section></div><div className="method-register"><h2>Current data boundary</h2><p>P01 is a reviewed desk screening. P07 has useful source leads but no completed pair rating, so it remains outside ranked results. Image imports and automated candidate discovery are pending.</p><p>Profile: <code>{atlas?.reviewProfile || 'terrain-geology-qual-v1'}</code> · Data: <code>{atlas?.datasetVersion || 'loading'}</code></p><h2>Source register</h2>{atlas?.sources.map(source => <p key={source.id}><strong>{source.id}</strong> <a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><span>{source.provider} · {source.locator} · accessed {source.accessDate}</span></p>)}</div></main>
}

export default function App() {
  const [atlas, setAtlas] = useState<Atlas | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)
  const [route, setRoute] = useState(window.location.hash || '#/')
  const [direction, setDirection] = useState<'target' | 'earth'>('target')
  const [body, setBody] = useState<'moon' | 'mars'>('moon')
  const [targetId, setTargetId] = useState('moon-shackleton')
  const [earthId, setEarthId] = useState('earth-haughton')
  const [selectedId, setSelectedId] = useState('')
  const [secondId, setSecondId] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [projection, setProjection] = useState<'flat' | 'globe'>('globe')

  useEffect(() => {
    const onHash = () => { setRoute(window.location.hash || '#/'); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    if (route === '#/world/mars') { setBody('mars'); setTargetId('mars-peace'); setDirection('target') }
    if (route === '#/world/moon') { setBody('moon'); setTargetId('moon-shackleton'); setDirection('target') }
    if (route === '#/world/earth') setDirection('earth')
  }, [route])
  useEffect(() => {
    const controller = new AbortController()
    fetch(dataUrl, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error(`Atlas request returned ${response.status}`)
      return response.json() as Promise<Atlas>
    }).then(data => { setAtlas(data); setLoadError(null) }).catch(error => {
      if (!controller.signal.aborted) setLoadError(String(error))
    })
    return () => controller.abort()
  }, [retry])

  const targets = useMemo(() => atlas?.sites.filter(site => site.body === body) || [], [atlas, body])
  const earthSites = useMemo(() => atlas?.sites.filter(site => site.body === 'earth') || [], [atlas])
  const tags = useMemo(() => [...new Map(atlas?.comparisons.flatMap(item => item.practice.map(tag => [tag.id, tag.label] as const)) || []).entries()], [atlas])
  const results = useMemo(() => (atlas?.comparisons || [])
    .filter(item => direction === 'target' ? item.targetId === targetId : item.earthId === earthId)
    .filter(item => !tagFilter || item.practice.some(tag => tag.id === tagFilter))
    .sort((a, b) => Number(b.rankEligible) - Number(a.rankEligible) || (a.rankOrder ?? 999) - (b.rankOrder ?? 999) || a.id.localeCompare(b.id)), [atlas, direction, targetId, earthId, tagFilter])
  const selected = results.find(item => item.id === selectedId) || results[0]
  const second = results.find(item => item.id === secondId && item.id !== selected?.id)
  const mapSites = useMemo(() => earthSites.filter(site => results.some(item => item.earthId === site.id)), [earthSites, results])
  const selectMapSite = (siteId: string) => {
    if (direction === 'earth') setEarthId(siteId)
    const match = results.find(item => item.earthId === siteId)
    if (match) setSelectedId(match.id)
  }
  const chooseBody = (next: 'moon' | 'mars') => { setBody(next); setTargetId(next === 'moon' ? 'moon-shackleton' : 'mars-peace'); setSelectedId(''); setSecondId(''); setTagFilter('') }
  const chooseDirection = (next: 'target' | 'earth') => { setDirection(next); setSelectedId(''); setSecondId(''); setTagFilter('') }
  const enter = (nextBody: 'moon' | 'mars') => { chooseDirection('target'); chooseBody(nextBody); window.location.hash = '#/atlas' }

  return <div className="site-shell">
    <header className="masthead"><a className="brand" href="#/" aria-label="TerraTwin home"><span className="brand-mark">✦</span> Terra<span>Twin</span></a><nav aria-label="Main navigation"><a className={route === '#/method' ? '' : 'active'} href="#/atlas">Explore</a><a className={route === '#/method' ? 'active' : ''} href="#/method">Method & sources</a></nav><span className="header-meta">Planetary field atlas / beta</span></header>
    {loadError && <div className="load-banner" role="alert">Atlas data could not load: {loadError} <button onClick={() => setRetry(value => value + 1)}>Retry</button></div>}
    {route === '#/method' ? <MethodPage atlas={atlas} /> : route === '#/' ? <main className="page home-page"><div className="home-copy"><span className="eyebrow">Earth × Moon × Mars</span><h1>Find the Earth in another world.</h1><p>Explore source-backed terrain analogs for planetary field practice. Follow the evidence, see where the analogy breaks, and keep uncertainty in view.</p><div className="home-actions"><button className="primary-action" onClick={() => enter('moon')}>Explore the Moon <span>↗</span></button><button className="secondary-action" onClick={() => enter('mars')}>Explore Mars <span>↗</span></button></div></div><div className="orbit-scene" aria-hidden="true"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="planet earth-planet"/><div className="planet moon-planet"/><div className="planet mars-planet"/><span className="orbit-label earth-label">EARTH</span><span className="orbit-label moon-label">MOON</span><span className="orbit-label mars-label">MARS</span></div><div className="home-footnote"><span>01 / Haughton ↔ Shackleton</span><span>07 / Copper Canyon ↔ Peace Vallis</span><span>Qualitative evidence · no similarity percentages</span></div></main> : <main className="page atlas-page"><div className="atlas-heading"><div><span className="eyebrow">Explore / field analogs</span><h1>Compare the terrain.<br/><em>Read the evidence.</em></h1><p>Two source-led pairs to start. One reviewed comparison, one candidate awaiting review.</p></div><div className="dataset-stamp"><span>DATASET</span><strong>{atlas?.datasetVersion || 'Loading…'}</strong><small>Images will be added later</small></div></div>
      <section className="workspace" aria-label="Analog explorer"><div className="controls-panel"><div className="control-group"><span className="field-label">Search direction</span><div className="segmented"><button className={direction === 'target' ? 'selected' : ''} onClick={() => chooseDirection('target')}>Planet → Earth</button><button className={direction === 'earth' ? 'selected' : ''} onClick={() => chooseDirection('earth')}>Earth → Planet</button></div></div>{direction === 'target' ? <><div className="control-group"><span className="field-label">Planetary body</span><div className="segmented"><button className={body === 'moon' ? 'selected' : ''} onClick={() => chooseBody('moon')}>Moon</button><button className={body === 'mars' ? 'selected' : ''} onClick={() => chooseBody('mars')}>Mars</button></div></div><label className="control-group"><span className="field-label">Target feature</span><select value={targetId} onChange={event => { setTargetId(event.target.value); setSelectedId(''); setSecondId('') }}>{targets.map(site => <option value={site.id} key={site.id}>{site.name}</option>)}</select></label></> : <label className="control-group"><span className="field-label">Earth site</span><select value={earthId} onChange={event => { setEarthId(event.target.value); setSelectedId(''); setSecondId('') }}>{earthSites.map(site => <option value={site.id} key={site.id}>{site.name}</option>)}</select></label>}<label className="control-group"><span className="field-label">Practice objective</span><select value={tagFilter} onChange={event => { setTagFilter(event.target.value); setSelectedId(''); setSecondId('') }}><option value="">All evidence-backed uses</option>{tags.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label><div className="control-aside">Practice filters narrow results. They never change ratings.</div></div>
      <div className="results-panel"><div className="panel-heading"><span className="eyebrow">Comparisons</span><strong>{results.length} {results.length === 1 ? 'record' : 'records'}</strong></div>{!atlas && !loadError ? <p className="empty-note">Loading validated evidence…</p> : results.length ? results.map(item => { const earth = atlas!.sites.find(site => site.id === item.earthId)!; const target = atlas!.sites.find(site => site.id === item.targetId)!; return <button className={`result-card ${selected?.id === item.id ? 'active' : ''}`} key={item.id} onClick={() => { setSelectedId(item.id); setSecondId('') }}><span className="result-top"><span>{item.id} · {item.status === 'reviewed' ? 'Reviewed' : 'Needs review'}</span><span>↗</span></span><strong>{direction === 'target' ? earth.name : target.name}</strong><small>{direction === 'target' ? earth.region : target.region}</small><span className="result-foot"><b className={item.rankEligible ? 'has-rating' : ''}>{item.overall}</b><span>{item.coverage}/2 evidence</span></span></button> }) : <div className="empty-note"><strong>No comparison meets this filter.</strong><p>Clear the practice filter to see the available source records.</p><button onClick={() => setTagFilter('')}>Clear filter</button></div>}<div className="results-footnote">Reviewed pairs enter terrain-first order. P07 stays outside ranking until reviewed.</div></div>
      <div className="map-panel"><div className="panel-heading"><div><span className="eyebrow">Earth locator</span><strong>Where field evidence begins</strong></div><div className="map-toggle" aria-label="Earth map projection"><button className={projection === 'flat' ? 'active' : ''} onClick={() => setProjection('flat')}>Flat</button><button className={projection === 'globe' ? 'active' : ''} onClick={() => setProjection('globe')}>Globe</button></div></div><MapPanel sites={mapSites} selectedId={selected?.earthId || null} onSelect={selectMapSite} projection={projection} /><div className="map-bottom"><span>○ Earth coordinates use longitude, latitude.</span><span>Planetary coordinates stay in the evidence panel.</span></div></div></section>
      {atlas && selected && <section className="comparison-section"><div className="section-title"><div><span className="eyebrow">Selected evidence</span><h2>Region comparison</h2></div><label className="second-select">Compare a second Earth site <select value={secondId} onChange={event => setSecondId(event.target.value)} disabled={direction !== 'target' || results.length < 2}><option value="">{results.length < 2 ? 'Another site is not yet reviewed' : 'Select a second site'}</option>{results.filter(item => item.id !== selected.id).map(item => <option key={item.id} value={item.id}>{atlas.sites.find(site => site.id === item.earthId)?.name}</option>)}</select></label></div><div className={second ? 'comparison-pair' : ''}><ComparisonView item={selected} atlas={atlas} />{second && <ComparisonView item={second} atlas={atlas} />}</div></section>}
    </main>}
    <footer className="footer"><span className="brand">Terra<span>Twin</span></span><span>Planetary field atlas · Qualitative screening</span><a href="#/method">Method & source credits ↗</a></footer>
  </div>
}
