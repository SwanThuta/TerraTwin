import {useEffect,useMemo,useState} from 'react'
import {Globe} from './Globe'
import {AtlasLoader} from './Astronaut'
import {BackIcon,ChevronIcon} from './Icons'
import {useMotionState} from './motion'
import {groupCriteria} from './criteria'
import {SlidingTabs} from './SlidingTabs'
import {CriterionVisual} from './CriterionVisual'
import {ReviewRule} from './Equation'
import {bodies,textureSources,type Body} from './bodies'
import type {Site} from './globeTypes'
import type {Atlas, Comparison as Pair, Site as RecordSite, Dimension as Rating, Visual} from './types'
import {loadAtlas, matches, assetUrl, safeUrl} from './atlas'

export function ReviewedAtlas({body}:{body?:Body}){
  const [atlas,setAtlas]=useState<Atlas>()
  const [failed,setFailed]=useState(false)
  const [retry,setRetry]=useState(0)
  useEffect(()=>{
    const controller=new AbortController()
    loadAtlas(controller.signal).then(setAtlas).catch(()=>{if(!controller.signal.aborted)setFailed(true)})
    return ()=>controller.abort()
  },[retry])
  return <main className="shell review-shell">
    {atlas?(body?<World key={body.id} body={body} atlas={atlas}/>:<Method atlas={atlas}/>):
      failed?<p role="alert">Evidence could not load. <button onClick={()=>{setFailed(false);setRetry(n=>n+1)}}>Retry</button></p>:<AtlasLoader label={body?`Preparing ${body.name} field notes…`:'Gathering methods and sources…'}/>}
  </main>
}

function marker(site:RecordSite):Site{
  return {id:site.id,body:site.body,name:site.name,region:site.region,image:site.thumbnail&&safeUrl(site.thumbnail)?assetUrl(site.thumbnail):undefined,
    coordinates:site.mapPoint??undefined,status:'curated',material:'',geology:site.description||site.mapPointKind,scale:site.coordinateNote,sources:[]}
}

function World({body,atlas}:{body:Body;atlas:Atlas}){
  const [selected,setSelected]=useMotionState<string|undefined>(undefined)
  const [activePair,setPair]=useMotionState<string|undefined>(undefined)
  const [rotating,setRotating]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches)
  const sites=atlas.sites.filter(site=>site.body===body.id)
  const site=sites.find(item=>item.id===selected)
  const pairs=selected?matches(atlas,selected):[]
  const pair=pairs.find(item=>item.id===activePair)
  const points=useMemo(()=>atlas.sites.filter(item=>item.body===body.id&&item.mapPoint).map(marker),[atlas,body.id])
  const select=(id:string)=>{setSelected(id);setRotating(false)}
  const counterpart=(item:Pair)=>atlas.sites.find(s=>s.id===(item.earthId===selected?item.targetId:item.earthId))
  if(pair&&site)return <Comparison atlas={atlas} pair={pair} first={site} choices={pairs.filter(item=>counterpart(item)?.body===counterpart(pair)?.body)} onPair={setPair} close={()=>setPair(undefined)}/>
  return <>
    <div className="review-page-heading"><a className="back icon-back" href="#/" aria-label="Back to all worlds" title="All worlds"><BackIcon/></a>
      <div><span className="page-kicker">Explore the atlas</span><h1 className="review-title">{body.name}</h1></div>
      <span className="page-count">{sites.length} published {sites.length===1?'region':'regions'}</span>
    </div>
    <div className="review-world">
      <section className="review-globe">
        <div className="review-sphere"><Globe fillOnZoom body={body} spinning={rotating} sites={points}
          activeSite={points.find(point=>point.id===selected)} initialSite={points[0]} onSite={point=>select(point.id)}/></div>
        <div className="review-controls"><button onClick={()=>setRotating(v=>!v)}>{rotating?'Pause rotation':'Auto-rotate'}</button>
          {points.length>0&&<small>Regional locators</small>}</div>
      </section>
      <aside key={site?.id||'overview'} className="review-card review-site content-enter" aria-label={site?'Site details':'World overview'}>
        {site?<><button className="review-back" onClick={()=>setSelected(undefined)}><BackIcon/>{body.name} sites</button>
          <h2>{site.name}</h2><p>{site.region}</p>{site.description&&<p>{site.description}</p>}
          <VisualBlock atlas={atlas} visual={pairs[0]?.visuals[site.body==='earth'?'earth':'target']}/>
          <details><summary>Location and source</summary><p>{site.locator}</p><p>{site.mapPointKind}</p><p>{site.coordinateConvention}</p><Refs atlas={atlas} ids={[site.mapPointSourceId,...(site.sourceIds||[])]}/></details>
          <div className="review-actions">{bodies.filter(world=>pairs.some(item=>counterpart(item)?.body===world.id)).map(world=>
            <button className="review-cta" key={world.id} onClick={()=>setPair(pairs.find(item=>counterpart(item)?.body===world.id)!.id)}>Compare with {world.name} ↗</button>
          )}{!pairs.length&&<p>No reviewed comparisons for this site yet.</p>}</div>
        </>:<><h2>{body.name} overview</h2><p>{body.description}</p>
          <div className="world-atlas-stats"><div><strong>{sites.length}</strong><span>Published regions</span></div><div><strong>{atlas.comparisons.filter(pair=>sites.some(site=>site.id===pair.earthId||site.id===pair.targetId)).length}</strong><span>Reviewed comparisons</span></div></div>
          <dl className="review-facts"><div><dt>Diameter</dt><dd>{body.diameter}</dd></div><div><dt>Gravity</dt><dd>{body.gravity}</dd></div></dl>
          {sites.length?<div className="review-sites">{sites.map(item=>{
            const related=matches(atlas,item.id)
            const ranked=related.filter(pair=>pair.rankEligible).length
            return <button key={item.id} onClick={()=>select(item.id)}><strong>{item.name}</strong><small>{item.region} · {ranked} ranked / {related.length} comparisons ›</small></button>
          })}</div>:<p>No reviewed sites in this dataset.</p>}</>}
      </aside>
    </div>
  </>
}

function Refs({atlas,ids}:{atlas:Atlas;ids:string[]}){
  return <div className="review-refs">{[...new Set(ids)].map(id=>{
    const source=atlas.sources.find(item=>item.id===id)
    return source?.url?<a key={id} href={source.url} target="_blank" rel="noreferrer" title={source.title}>{id} ↗</a>:id?<span key={id}>{id} · Source unavailable</span>:null
  })}</div>
}

function VisualBlock({atlas,visual}:{atlas:Atlas;visual?:Visual}){
  const [broken,setBroken]=useState(false)
  useEffect(()=>setBroken(false),[visual?.localPath])
  return <div className="review-visual">{visual?.localPath&&!broken?<img src={assetUrl(visual.localPath)} alt="Site evidence" onError={()=>setBroken(true)}/>:<strong>Site imagery unavailable</strong>}
    {visual?.localPath&&<small>{visual.scope ? `${visual.scope} · ` : ''}{visual.credit}</small>}
    {visual&&<details><summary>Image source and scale</summary>{visual.caption&&<p>{visual.caption}</p>}<p>{visual.scale}</p>{visual.acquired&&<p>Acquired: {visual.acquired}</p>}{visual.usage&&<p>{visual.usage}</p>}{visual.missingReason&&<p>{visual.missingReason}</p>}<Refs atlas={atlas} ids={[visual.sourceId]}/></details>}
  </div>
}

/** A pair-scoped card: the caller keys it by both comparison and site ID. */
function RegionCard({atlas,site,visual}:{atlas:Atlas;site:RecordSite;visual:Visual}){
  const [imageFailed,setImageFailed]=useState(false)
  const imageSource=atlas.sources.find(source=>source.id===visual.sourceId&&source.url)
  const world=bodies.find(body=>body.id===site.body)!
  const description=site.description||(site.feature!==site.name?site.feature:'')
  return <article className="review-card review-region-card" aria-label={`${site.name} region card`}>
    <div className="review-region-image">
      {visual.localPath&&!imageFailed?
        <>
          <img className="review-region-image-backdrop" src={assetUrl(visual.localPath)} alt="" aria-hidden="true"/>
          <img className="review-region-image-main" src={assetUrl(visual.localPath)} alt={`${site.name} — ${visual.scope || 'source imagery'}: ${visual.caption || ''}`} onError={()=>setImageFailed(true)}/>
        </>:
        <div className="review-region-placeholder"><strong>Site imagery unavailable</strong>
          {imageSource&&<a href={imageSource.url} target="_blank" rel="noreferrer" aria-label={`Open imagery source for ${site.name}`}>View cited imagery source ↗</a>}
        </div>}
    </div>
    <div className="review-region-details" role="region" aria-label={`${site.name} details`} tabIndex={0}>
      <small>{world.name}{visual.scope&&` · ${visual.scope}`}</small><h3>{site.name}</h3>
      {visual.caption&&<p>{visual.caption}</p>}
      {site.region&&<p>{site.region}</p>}{description&&<p>{description}</p>}
      <details><summary>Location and imagery sources</summary>
        {site.locator&&description!==site.locator&&<p>{site.locator}</p>}
        {site.coordinateNote&&<p>{site.coordinateNote}</p>}
        {site.coordinateConvention&&<p>{site.coordinateConvention}</p>}
        {site.mapPointKind&&<p>{site.mapPointKind}</p>}
        {visual.credit&&<p><strong>Image credit:</strong> {visual.credit}</p>}
        {visual.scale&&<p><strong>Scale:</strong> {visual.scale}</p>}
        {visual.acquired&&<p><strong>Acquired:</strong> {visual.acquired}</p>}
        {visual.usage&&<p><strong>Use:</strong> {visual.usage}</p>}
        {imageFailed?<p>The supplied image could not be loaded.</p>:visual.missingReason&&<p>{visual.missingReason}</p>}
        <Refs atlas={atlas} ids={[visual.sourceId,site.mapPointSourceId,...(site.sourceIds||[])]}/>
      </details>
    </div>
  </article>
}

const tabs=['Overview','Evidence','Field practice','Sources'] as const
function Comparison({atlas,pair,first,choices,onPair,close}:{atlas:Atlas;pair:Pair;first:RecordSite;choices:Pair[];onPair:(id:string)=>void;close:()=>void}){
  const [tab,setTab]=useState<(typeof tabs)[number]>('Overview')
  const earth=atlas.sites.find(s=>s.id===pair.earthId)
  const target=atlas.sites.find(s=>s.id===pair.targetId)
  if(!earth||!target)return <p role="alert">Comparison sites unavailable.</p>
  const ordered=first.id===earth.id?[earth,target]:[target,earth]
  const position=choices.findIndex(item=>item.id===pair.id)
  const counterpart=(item:Pair)=>atlas.sites.find(site=>site.id===(item.earthId===first.id?item.targetId:item.earthId))
  const counterpartSites=choices.map(counterpart).filter((site):site is RecordSite=>!!site).filter((site,index,list)=>list.findIndex(item=>item.id===site.id)===index)
  return <>
    <div className="review-top"><button className="review-back" onClick={close}><BackIcon/>Back to site</button><button aria-label="Close comparison" onClick={close}>×</button></div>
    <div className="review-pair-globes">{ordered.map(site=>{
      const body=bodies.find(item=>item.id===site.body)!
      const points=(site.id===first.id?[site]:counterpartSites).filter(item=>item.mapPoint).map(marker)
      const active=points.find(point=>point.id===site.id)
      return <section key={site.id}><h2>{body.name}</h2><div className="review-sphere">
        <Globe fillOnZoom body={body} sites={points} activeSite={active} onSite={point=>{const selected=choices.find(item=>counterpart(item)?.id===point.id);if(selected)onPair(selected.id)}}/>
      </div><small>{points.length?'Regional context pin':'Scene coordinates in Evidence'}</small></section>
    })}</div>
    {choices.length>1&&<div className="review-controls review-match-controls" role="group" aria-label="Matching comparisons" onKeyDown={event=>{
      if((event.target as HTMLElement).tagName==='SELECT')return
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();onPair(choices[(position+(event.key==='ArrowRight'?1:choices.length-1))%choices.length].id)}
    }}>
      <button aria-label="Previous match" onClick={()=>onPair(choices[(position+choices.length-1)%choices.length].id)}><ChevronIcon direction="left"/></button>
      <label>Match {position+1} of {choices.length} <select aria-label="Select matching site" value={pair.id} onChange={event=>onPair(event.target.value)}>{choices.map(item=><option key={item.id} value={item.id}>{counterpart(item)?.name} · {item.id} · {item.rankEligible?'ranked':'evidence incomplete'}</option>)}</select></label>
      <button aria-label="Next match" onClick={()=>onPair(choices[(position+1)%choices.length].id)}><ChevronIcon/></button>

    </div>}
    <section className="review-card review-comparison">
      <div className="review-top"><small>{pair.id} · {pair.reviewer?.includes('AI')||pair.reviewer?.startsWith('Copilot')?'AI source desk screening':'Source desk screening'} · {pair.rankEligible?'ranked':'unranked: evidence incomplete'}</small>{pair.reportPath&&safeUrl(pair.reportPath)&&<a className="review-report" href={assetUrl(pair.reportPath)} download>Download evidence PDF ↓</a>}</div>
      <h1>{ordered[0].name} <span>VS</span> {ordered[1].name}</h1>
      <div className="review-ratings">{[['Terrain',pair.terrain.rating],['Geology',pair.geology.rating],['Overall',pair.overall]].map(([label,value])=>
        <div key={label}><small>{label}</small><strong data-rating={value??undefined}>{value??'Insufficient evidence'}</strong></div>)}
        <div><small>Evidence coverage</small><strong>{pair.coverage} of {atlas.criteria.filter(item=>item.role==='primary_qualitative').length||2} reviewed</strong></div></div>
      <SlidingTabs className="review-tabs" label="Comparison details" selectedKey={tab}>
        {tabs.map((name,index)=><button key={name} id={'tab-'+index} role="tab" aria-selected={tab===name}
          aria-controls="review-tabpanel" tabIndex={tab===name?0:-1} onClick={()=>setTab(name)}
          onKeyDown={event=>{
            if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return
            event.preventDefault()
            const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length
            setTab(tabs[next]);document.getElementById('tab-'+next)?.focus()
          }}>{name}</button>)}
      </SlidingTabs>
      <div key={`${pair.id}-${tab}`} id="review-tabpanel" className="review-tabpanel" role="tabpanel" aria-labelledby={'tab-'+tabs.indexOf(tab)} tabIndex={0}>
        {tab==='Overview'&&<>
          <div className="review-grid review-region-cards" aria-label="Compared regions">{ordered.map(site=>
            <RegionCard key={`${pair.id}:${site.id}`} atlas={atlas} site={site} visual={site.id===pair.earthId?pair.visuals.earth:pair.visuals.target}/>
          )}</div>
          <h2>Documented similarity</h2><p>{pair.similaritySummary}</p><Refs atlas={atlas} ids={pair.relationshipSourceIds}/><h3>Key limitation</h3><p>{pair.geology.difference}</p>
          <div className="review-uses">{pair.practice.map(item=><button key={item.id} onClick={()=>setTab('Field practice')}>{item.label} ›</button>)}</div></>}
        {tab==='Evidence'&&<>
          <div className="review-grid">{[['Terrain',pair.terrain],['Geology',pair.geology]].map(([name,value])=>{
            const rating=value as Rating
            return <section key={String(name)} className="review-card"><h2>{String(name)}</h2><p>{rating.evidence}</p><h3>Difference</h3><p>{rating.difference}</p>{rating.missingReason&&<p>{rating.missingReason}</p>}<Refs atlas={atlas} ids={rating.sourceIds}/></section>
          })}</div>
          {pair.similarities.map(item=><details key={item.id}><summary>{item.dimension==='terrain'?'Terrain':'Geology'} observations and scale</summary><p>{item.sharedObservation}</p><p>{item.limitation}</p><p>{item.earthLocator}</p><p>{item.planetaryLocator}</p><p>{item.scaleNote}</p><Refs atlas={atlas} ids={item.sourceIds}/></details>)}
        </>}
        {tab==='Field practice'&&<><h2>Possible field practice</h2>
          {!pair.practice.length&&<p>No documented field practice supplied.</p>}{pair.practice.map(item=><details key={item.id}><summary>{item.label}</summary><p>{item.reason}</p><p>{item.limitations}</p><Refs atlas={atlas} ids={item.sourceIds}/></details>)}
          <details><summary>Analogy limits</summary><ul>{pair.limits.map(limit=><li key={limit}>{limit}</li>)}</ul><Refs atlas={atlas} ids={pair.limitSourceIds}/></details></>}
        {tab==='Sources'&&<><SourceList atlas={atlas} ids={[earth.mapPointSourceId,target.mapPointSourceId,...(earth.sourceIds||[]),...(target.sourceIds||[]),...pair.relationshipSourceIds,...pair.terrain.sourceIds,...pair.geology.sourceIds,...pair.practice.flatMap(x=>x.sourceIds),...pair.limitSourceIds,...pair.similarities.flatMap(x=>x.sourceIds),...pair.explanationSourceIds,pair.visuals.earth.sourceId,pair.visuals.target.sourceId]}/>
          <details><summary>Review notes and locators</summary><p>{pair.relationship}</p><p>{pair.reviewDate} · {pair.reviewer}</p><p>{pair.reviewNotes}</p>{ordered.map(site=><p key={site.id}>{site.name}: {site.coordinateNote} {site.coordinateConvention} {site.locator}</p>)}</details>
          <small>{atlas.datasetVersion} · {atlas.reviewProfile}</small></>}
      </div>
    </section>
  </>
}

function SourceList({atlas,ids}:{atlas:Atlas;ids?:string[]}){
  const missing=[...new Set(ids||[])].filter(id=>id&&!atlas.sources.some(source=>source.id===id))
  return <div className="review-source-list">{atlas.sources.filter(item=>!ids||ids.includes(item.id)).map(item=><a key={item.id} href={item.url||undefined} aria-disabled={!item.url||undefined} target="_blank" rel="noreferrer">
    <span>{item.id}</span><div><strong>{item.title} {item.url?'↗':'· Link unavailable'}</strong><small>{item.provider} · {item.locator}</small></div>
  </a>)}{missing.map(id=><p key={id}>{id} · Source unavailable</p>)}</div>
}

function CriteriaCoverage({atlas}:{atlas:Atlas}){
  const groups=useMemo(()=>groupCriteria(atlas.criteria),[atlas.criteria])
  const [category,setCategory]=useState<string>(groups[0]?.id||'terrain')
  const [positions,setPositions]=useState<Record<string,number>>({})
  const group=groups.find(item=>item.id===category)||groups[0]
  if(!group)return <section className="review-card criteria-coverage"><h2>Criteria and data coverage</h2><p>No review criteria supplied in this dataset.</p></section>
  const position=(positions[group.id]||0)%group.items.length
  const item=group.items[position]
  const move=(step:number)=>setPositions(previous=>({...previous,[group.id]:(position+step+group.items.length)%group.items.length}))
  return <section className="review-card criteria-coverage" aria-labelledby="criteria-heading">
    <div className="method-section-heading"><div><span className="page-kicker">The review framework</span><h2 id="criteria-heading">Criteria and data coverage</h2></div><span className="method-count">{atlas.criteria.length} criteria</span></div>
    <SlidingTabs className="criteria-category-tabs" label="Criteria categories" selectedKey={group.id}>{groups.map((entry,index)=><button key={entry.id} id={`criteria-tab-${entry.id}`} role="tab" aria-selected={entry.id===group.id} tabIndex={entry.id===group.id?0:-1} aria-controls="criteria-panel" onClick={()=>setCategory(entry.id)} onKeyDown={event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return
      event.preventDefault()
      const next=event.key==='Home'?0:event.key==='End'?groups.length-1:(index+(event.key==='ArrowRight'?1:groups.length-1))%groups.length
      setCategory(groups[next].id);document.getElementById(`criteria-tab-${groups[next].id}`)?.focus()
    }}>{entry.label}<small>{entry.items.length}</small></button>)}</SlidingTabs>
    <div id="criteria-panel" role="tabpanel" aria-labelledby={`criteria-tab-${group.id}`} tabIndex={0} className="criteria-stage">
      <div key={item.id} className="criterion-slide content-enter">
        <div className="criterion-copy"><div className="criterion-topline"><span>{item.id} / {group.label}</span><span className="criterion-status">{item.role.replaceAll('_',' ')}</span></div>
        <h3>{item.title}</h3><p className="criterion-question">{item.question}</p>
        <div className="criterion-guidance"><span>Review rule</span><ReviewRule rule={item.rule}/></div>
        <div className="criterion-metadata">{item.unitOrRating&&<span>{item.unitOrRating}</span>}{item.readiness&&<span>{item.readiness.replaceAll('_',' ')}</span>}</div></div>
        <CriterionVisual criterionKey={item.key}/>
      </div>
    </div>
    <div className="criteria-pagination">{group.items.length>1&&<div className="criterion-pager" role="group" aria-label={`${group.label} criteria`}>
      <button onClick={()=>move(-1)} aria-label="Previous criterion"><ChevronIcon direction="left"/></button>
      <span className="criterion-position">{position+1} / {group.items.length}</span>
      <div className="criterion-dots">{group.items.map((entry,index)=><button key={entry.id} aria-label={`Show criterion ${entry.id}`} aria-pressed={index===position} onClick={()=>setPositions(previous=>({...previous,[group.id]:index}))}/>)}</div>
      <button onClick={()=>move(1)} aria-label="Next criterion"><ChevronIcon/></button>
    </div>}<p>{group.note}</p></div>
  </section>
}

function Method({atlas}:{atlas:Atlas}){
  return <div className="method-page">
    <div className="review-page-heading"><a className="back icon-back" href="#/" aria-label="Back to all worlds" title="All worlds"><BackIcon/></a><div><span className="page-kicker">Evidence before similarity</span><h1 className="review-title">Method &amp; sources</h1></div></div>
    <div className="method-intro"><p>Follow the observations behind each comparison. Understand the review rules, the data we have, and where the analogy ends.</p><div className="method-release"><span>Dataset <strong>{atlas.datasetVersion}</strong></span><span><strong>{atlas.comparisons.length}</strong> published {atlas.comparisons.length===1?'comparison':'comparisons'}</span><span><strong>{atlas.sources.length}</strong> source records</span></div></div>
    <CriteriaCoverage atlas={atlas}/>
    <div className="method-support-grid">
      <section className="review-card review-method rating-guide"><div className="method-section-heading"><div><span className="page-kicker">Reading the labels</span><h2>Qualitative ratings</h2></div><span className="method-count">Ordinal, not percentages</span></div><dl className="review-rule">
        <div data-rating="Strong"><dt><i/>Strong</dt><dd>Both dimensions are Strong.</dd></div><div data-rating="Moderate"><dt><i/>Moderate</dt><dd>Both dimensions are at least Moderate.</dd></div>
        <div data-rating="Weak"><dt><i/>Weak</dt><dd>At least one reviewed dimension is Weak.</dd></div><div data-rating="missing"><dt><i/>Insufficient evidence</dt><dd>A dimension is unavailable.</dd></div>
      </dl><p className="method-footnote">Evidence coverage counts reviewed dimensions, not confidence. Quantitative comparisons require validated measurements at comparable scales.</p><small>Review profile · {atlas.reviewProfile}</small></section>
      <section className="review-card review-method imagery-guide"><span className="page-kicker">A map is a starting point</span><h2>Imagery &amp; attribution</h2><p>The globes help you find your bearings. Pair-specific imagery carries its own source, credit and scale in each comparison.</p><div className="imagery-credit-links">{textureSources.map(([name,url])=><a key={url} href={url} target="_blank" rel="noreferrer"><span>{name}</span><ChevronIcon/></a>)}</div><small>Global textures do not establish site-scale evidence.</small></section>
    </div>
    <section className="review-card review-method method-source-register"><div className="method-section-heading"><div><span className="page-kicker">Trace the research</span><h2>Source register</h2></div><span className="method-count">{atlas.sources.length} linked records</span></div><p>Original publications, image locators and data products referenced by this release.</p><SourceList atlas={atlas}/></section>
  </div>
}
