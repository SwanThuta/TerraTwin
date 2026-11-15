import {useCallback,useState,type SetStateAction} from 'react'
import {flushSync} from 'react-dom'

type Transition = {skipTransition:()=>void;finished:Promise<void>}
let active:Transition|undefined
/** Capture React's next state for a short cross-fade without delaying the action. */
export function animateChange(change:()=>void){
  const documentWithTransitions=document as Document & {startViewTransition?:(update:()=>void)=>Transition}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!documentWithTransitions.startViewTransition){change();return}
  active?.skipTransition()
  active=documentWithTransitions.startViewTransition(()=>flushSync(change))
  active.finished.catch(()=>{})
}
export function useMotionState<T>(initial:T|(()=>T)){
  const [value,setValue]=useState(initial)
  const set=useCallback((next:SetStateAction<T>)=>animateChange(()=>setValue(next)),[])
  return [value,set] as const
}
