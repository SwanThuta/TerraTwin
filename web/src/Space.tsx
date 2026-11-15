import type {CSSProperties} from 'react'

const stars=Array.from({length:110},(_,index)=>{
  const scatter=(salt:number)=>{
    const value=Math.sin((index+1)*salt)*43758.5453
    return value-Math.floor(value)
  }
  return {
    left:scatter(12.9898)*100+'%',
    top:scatter(78.233)*100+'%',
    '--star-size':(1+scatter(37.719)*1.75)+'px',
    '--star-period':(2.8+scatter(91.23)*4.2)+'s',
    '--star-delay':(-scatter(51.13)*7)+'s',
  } as CSSProperties
})

export function Space(){
  return <div className="space" aria-hidden="true">
    <div className="nebula-drift"/>
    {stars.map((style,index)=><i key={index} style={style}/>)}
    <b className="meteor meteor-first"/><b className="meteor meteor-second"/>
  </div>
}
