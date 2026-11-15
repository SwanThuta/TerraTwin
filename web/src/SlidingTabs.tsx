import {useLayoutEffect,useRef,type ReactNode} from 'react'

/** One continuous pill follows pointer/focus, then returns to the selected tab. */
export function SlidingTabs({children,className='',label,selectedKey,as:Element='div'}:{children:ReactNode;className?:string;label:string;selectedKey:string;as?:'div'|'nav'}){
  const root=useRef<HTMLDivElement & HTMLElement>(null)
  const pill=useRef<HTMLSpanElement>(null)
  function target(element:EventTarget|null){
    return element instanceof ElementNode?element.closest<HTMLElement>('button:not(:disabled),a[href]'):null
  }
  function move(element:HTMLElement|null){
    const container=root.current,indicator=pill.current
    if(!container||!indicator||!element||!container.contains(element))return
    // Layout offsets ignore the button's temporary pressed-scale animation.
    indicator.style.transform=`translate(${element.offsetLeft}px,${element.offsetTop}px)`
    indicator.style.width=`${element.offsetWidth}px`;indicator.style.height=`${element.offsetHeight}px`
    container.querySelectorAll('.is-highlighted').forEach(item=>item.classList.remove('is-highlighted'))
    element.classList.add('is-highlighted')
  }
  function selected(){return root.current?.querySelector<HTMLElement>('[aria-selected="true"],[aria-current="page"]')||null}
  useLayoutEffect(()=>{
    const container=root.current
    if(!container)return
    move(selected())
    const observer=new ResizeObserver(()=>move(selected()))
    observer.observe(container)
    container.querySelectorAll('button,a').forEach(item=>observer.observe(item))
    const frame=requestAnimationFrame(()=>{container.dataset.ready='true'})
    return ()=>{observer.disconnect();cancelAnimationFrame(frame)}
  },[selectedKey,children])
  return <Element ref={root} className={`sliding-tabs ${className}`} role={Element==='nav'?undefined:'tablist'} aria-label={label}
    onPointerOver={event=>{if(event.pointerType!=='touch')move(target(event.target))}}
    onPointerLeave={()=>move(selected())}
    onFocusCapture={event=>move(target(event.target))}
    onBlurCapture={event=>{if(!root.current?.contains(event.relatedTarget as Node|null))move(selected())}}
    onClickCapture={event=>move(target(event.target))}>
    <span ref={pill} className="sliding-highlight" aria-hidden="true"/>{children}
  </Element>
}
// Keep the DOM Element constructor distinct from the chosen JSX container.
const ElementNode=globalThis.Element
