import {useEffect,useRef,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {bodies} from './bodies'
import {Globe} from './Globe'
import {Space} from './Space'
import {ReviewedAtlas} from './ReviewedAtlas'
import {animateChange} from './motion'
import {SlidingTabs} from './SlidingTabs'
import './style.css'

function Arrow(){return <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 12 12 4m-6 0h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Logo(){return <a className="logo" href="#/" aria-label="TerraTwin home"><img src="/favicon.svg" alt=""/><span>Terra<span>Twin</span></span></a>}
function Route(){
  const [route,setRoute]=useState(location.hash||'#/')
  const main=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    function change(){animateChange(()=>{setRoute(location.hash||'#/');window.scrollTo(0,0)})}
    window.addEventListener('hashchange',change)
    return ()=>window.removeEventListener('hashchange',change)
  },[])
  useEffect(()=>{main.current?.focus({preventScroll:true})},[route])
  const body=bodies.find(b=>route===`#/world/${b.id}`||route===`#/atlas/${b.id}`)??(route==='#/atlas'?bodies[0]:undefined)
  const atlas=route.startsWith('#/atlas')
  const method=route==='#/method'
  return <div className="app" data-home={!body&&!atlas&&!method}>
    <Space/>
    <header className="masthead"><div className="shell nav"><Logo/>
      <span className="home-brand-label">Planetary Field Atlas</span>
    <SlidingTabs as="nav" label="Main navigation" selectedKey={route}><a href="#/" aria-current={!body&&!method?'page':undefined}>Home</a><a href="#/atlas" aria-current={body?'page':undefined}>Explore</a><a href="#/method" aria-current={method?'page':undefined}>Method &amp; sources</a></SlidingTabs></div></header>
    <div key={body||atlas||method?route:"worlds"} ref={main} tabIndex={-1} className="route">
      {method?<ReviewedAtlas/>:body?<ReviewedAtlas body={body}/>:<Planetarium/>}
    </div>
    <footer className="shell footer"><Logo/><span>Planetary field atlas</span><a href="#/method">Imagery credits <Arrow/></a></footer>
  </div>
}

function Planetarium(){
  const [spinning,setSpinning]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [{turn,direction},setOrbit]=useState({turn:0,direction:0})
  function cycle(step:number){
    const animate=!matchMedia('(prefers-reduced-motion: reduce)').matches
    setOrbit(state=>state.direction?state:{turn:state.turn+step,direction:animate?step:0})
  }
  const offset=((turn%3)+3)%3
  const order=bodies.map((_,index)=>bodies[(index+3-offset)%3])

  return <main className="planetarium shell">
    <div className="home-copy">
      <h1>Planetary <br/>field atlas</h1>
      <p>Compare field analogs <br className="home-line"/>across Earth, the Moon, <br className="home-line"/>and Mars.</p>
      <a className="home-cta" href="#/atlas">Explore the atlas <span aria-hidden="true">→</span></a>
    </div>
    <section className="observatory" data-moving={direction!==0} aria-label="Interactive planetary view">
      <div className="observatory-stage" tabIndex={0} aria-label="World carousel. Use left and right arrow keys to change the centered world."
        onKeyDown={e=>{
          if(e.target!==e.currentTarget)return
          if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
            e.preventDefault()
            cycle(e.key==='ArrowRight'?1:-1)
          }
        }}>
        {order.map((world,index)=>{
          const previousSlot=(index-direction+3)%3
          const wrap=direction<0&&index===2?'right':direction>0&&index===0?'left':undefined
          return <article className={`observatory-world ${world.id}`} data-slot={index} data-from={direction?previousSlot:undefined}
            key={world.id} data-wrap={wrap} onAnimationEnd={event=>{
              if(wrap&&event.target===event.currentTarget&&event.animationName==='home-orbit'){
                setOrbit(state=>({...state,direction:0}))
              }
            }}>
            <div className="observatory-globe">
              <Globe body={world} spinning={spinning} open={()=>{location.hash=`/world/${world.id}`}}/>
            </div>
          </article>
        })}
      </div>
      <button type="button" className="orbit-arrow orbit-left" aria-label="Rotate globe order left" onClick={()=>cycle(-1)}>‹</button>
      <button type="button" className="orbit-arrow orbit-right" aria-label="Rotate globe order right" onClick={()=>cycle(1)}>›</button>
      <button className="home-motion" type="button" aria-label={spinning?'Pause rotation':'Play rotation'} title={spinning?'Pause rotation':'Play rotation'} onClick={()=>setSpinning(!spinning)}>{spinning?'Ⅱ':'▶'}</button>
    </section>
  </main>
}

createRoot(document.getElementById('root')!).render(<Route/>)
