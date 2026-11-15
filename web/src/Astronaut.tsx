import {useId} from 'react'

/** Small vector crew members, shared by the decorative sky and loading states. */
export function Astronaut({className='',accent='cyan'}:{className?:string;accent?:'cyan'|'lilac'}){
  const id=useId().replaceAll(':','')
  return <svg className={`chibi-astronaut ${className}`} data-accent={accent} viewBox="0 0 120 140" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-suit`} x1="28" y1="22" x2="92" y2="121" gradientUnits="userSpaceOnUse"><stop stopColor="#f2faff"/><stop offset="1" stopColor="#93b7d2"/></linearGradient>
      <linearGradient id={`${id}-glass`} x1="34" y1="27" x2="86" y2="69" gradientUnits="userSpaceOnUse"><stop stopColor="#294f73"/><stop offset=".6" stopColor="#0e233e"/><stop offset="1" stopColor="#163c55"/></linearGradient>
    </defs>
    <path d="M88 89c40 12 17 45-4 36s12-24 20-10" stroke="#69bed2" strokeWidth="2" strokeLinecap="round" opacity=".55"/>
    <rect x="38" y="68" width="45" height="39" rx="10" fill="#3e6788" stroke="#8cbfd5" strokeWidth="2"/>
    <g className="astronaut-wave"><path d="m41 81-13 9-12-14" stroke={`url(#${id}-suit)`} strokeWidth="13" strokeLinecap="round"/><path d="m16 75-2-8m2 8-7-3" stroke="#e8f7ff" strokeWidth="7" strokeLinecap="round"/></g>
    <path d="m80 81 13 13 10-7" stroke={`url(#${id}-suit)`} strokeWidth="13" strokeLinecap="round"/>
    <path d="m48 102-8 17m32-17 8 17" stroke={`url(#${id}-suit)`} strokeWidth="16" strokeLinecap="round"/>
    <path d="m35 121 12 3m29-1 13-3" stroke="#9ae5ed" strokeWidth="9" strokeLinecap="round"/>
    <rect x="38" y="68" width="45" height="40" rx="16" fill={`url(#${id}-suit)`} stroke="#b4d5e5" strokeWidth="2"/>
    <rect className="astronaut-accent" x="48" y="80" width="25" height="17" rx="5" fill="#55d6e8"/>
    <path d="M53 86h8m-8 5h4" stroke="#214662" strokeWidth="2" strokeLinecap="round"/><circle cx="67" cy="88" r="2" fill="#e9fbff"/>
    <ellipse cx="60" cy="46" rx="37" ry="35" fill={`url(#${id}-suit)`} stroke="#c0e5f1" strokeWidth="2"/>
    <rect x="20" y="39" width="7" height="18" rx="3" fill="#6ca8bf"/><rect x="93" y="39" width="7" height="18" rx="3" fill="#6ca8bf"/>
    <rect x="30" y="25" width="60" height="43" rx="21" fill={`url(#${id}-glass)`} stroke="#73c8dc" strokeWidth="2.5"/>
    <path d="M39 40c1-5 6-8 12-8" stroke="#d0f6ff" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
    <path d="M42 53q4-6 8 0m20 0q4-6 8 0" stroke="#a4f0f7" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M56 58q4 4 8 0" stroke="#a4f0f7" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="44" cy="58" rx="4" ry="2" fill="#9cbaf5" opacity=".55"/><ellipse cx="76" cy="58" rx="4" ry="2" fill="#9cbaf5" opacity=".55"/>
    <path d="m100 22 2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#a4ebf3"/>
  </svg>
}

export function AtlasLoader({label='Loading the atlas…',compact=false}:{label?:string;compact?:boolean}){
  return <div className={`astronaut-loader ${compact?'loader-compact':''}`} role="status" aria-live="polite">
    <div className="loader-orbit" aria-hidden="true"><span/><Astronaut/><i className="loader-spark"/></div>
    <span className="loader-label">{label}</span><span className="loader-dots" aria-hidden="true"><i/><i/><i/></span>
  </div>
}
