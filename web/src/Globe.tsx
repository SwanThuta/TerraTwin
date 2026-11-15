import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import * as THREE from 'three'
import type { Site } from './globeTypes'
import type { Body } from './bodies'
import {softwareGlobe} from './softwareGlobe'
import {AtlasLoader} from './Astronaut'

export function Globe({body, open, spinning=false, reset=0,sites=[],activeSite,initialSite,onSite,highlight=[],fillOnZoom=false}: {body:Body; open?:()=>void; spinning?:boolean; reset?:number; sites?:Site[]; activeSite?:Site; initialSite?:Site; onSite?:(site:Site)=>void; highlight?:string[]; fillOnZoom?:boolean;}) {
  const viewport=useRef<HTMLDivElement>(null)
  const zoom=useRef(1)
  const maxZoom=12
  const cameraOffset=useRef({x:0,y:0})
  const [magnification,setMagnification]=useState(1)
  const pointers=useRef(new Map<number,{x:number;y:number}>())
  const pinch=useRef<{distance:number;zoom:number}|null>(null)
  const host = useRef<HTMLDivElement>(null)
  const angles = useRef<{x:number;y:number}>({x:.13,y:body.angle})
  const pins=useRef(new Map<string,HTMLButtonElement>())
  const sitesRef=useRef(sites)
  sitesRef.current=sites
  function positionPins(project:(coordinates:[number,number])=>[number,number]|null){
    for(const site of sitesRef.current){
      const pin=pins.current.get(site.id)
      if(!pin||!site.coordinates)continue
      const point=project(site.coordinates)
      pin.hidden=!point||point[0]<5||point[0]>viewport.current!.clientWidth-5||point[1]<5||point[1]>viewport.current!.clientHeight-5
      if(point){
        pin.style.setProperty('--pin-x',point[0]+'px')
        pin.style.transform=`translate(${point[0]}px,${point[1]}px) translate(-50%,-50%)`
      }
    }
  }
  const motion = useRef(spinning)
  const draw = useRef<()=>void>(()=>{})
  const gesture = useRef<{id:number;x:number;y:number;moved:boolean;lastX:number;lastY:number}|null>(null)
  const [fallback,setFallback] = useState(false)
  const [textureState,setTextureState]=useState<'loading'|'ready'|'failed'>('loading')
  const rate = body.id==='earth' ? .00026 : body.id==='mars' ? .00022 : .00018
  const cpu = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{motion.current=spinning},[spinning])
  function renderedZoom(){
    const element=viewport.current
    if(!fillOnZoom||zoom.current<=1||!element?.clientWidth||!element.clientHeight)return zoom.current
    const {clientWidth:width,clientHeight:height}=element
    const {x,y}=cameraOffset.current
    // Cover the farthest corner even when a zoom gesture shifts the camera.
    const corner=Math.hypot(width*(.5+Math.abs(x)),height*(.5+Math.abs(y)))
    const cover=corner/(.42*Math.min(width,height))
    return Math.max(zoom.current,cover+Math.max(0,zoom.current-1.25))
  }
  function changeZoom(value:number,anchor={x:0,y:0}){
    const next=THREE.MathUtils.clamp(value,1,maxZoom)
    const ratio=next/zoom.current
    const limit=(next-1)*.36
    cameraOffset.current={
      x:THREE.MathUtils.clamp(cameraOffset.current.x*ratio+anchor.x*(ratio-1),-limit,limit),
      y:THREE.MathUtils.clamp(cameraOffset.current.y*ratio+anchor.y*(ratio-1),-limit,limit),
    }
    zoom.current=next
    setMagnification(zoom.current)
    draw.current()
  }
  useEffect(()=>{
    if(open)return
    const element=viewport.current!
    function wheel(event:WheelEvent){
      event.preventDefault()
      const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?300:1)
      const bounds=element.getBoundingClientRect()
      changeZoom(zoom.current*Math.exp(-delta*.002),{
        x:(event.clientX-bounds.left)/bounds.width-.5,y:(event.clientY-bounds.top)/bounds.height-.5,
      })
    }
    element.addEventListener('wheel',wheel,{passive:false})
    return ()=>element.removeEventListener('wheel',wheel)
  },[!!open])
  useEffect(()=>{
    cameraOffset.current={x:0,y:0}
    const point=(activeSite??initialSite)?.coordinates
    angles.current=point?{x:THREE.MathUtils.degToRad(point[1]),y:-Math.PI/2-THREE.MathUtils.degToRad(point[0])}:open&&body.id==='earth'?{x:.55,y:-.05}:{x:.13,y:body.angle}
    draw.current()
  },[body,reset,activeSite,initialSite,!!open])
  useEffect(()=>{draw.current()},[sites])

  useEffect(()=>{
    const container=host.current!
    let disposed=false
    setTextureState('loading')
    let renderer:THREE.WebGLRenderer
    try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'})}
    catch {setFallback(true);return}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75))
    renderer.setClearColor(0x000000,0)
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.16
    container.appendChild(renderer.domElement)

    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(32,1,.1,100)
    camera.position.z=4.05
    const geometry=new THREE.SphereGeometry(1,64,48)
    const texture=new THREE.TextureLoader().load('/textures/'+body.texture+'.jpg',()=>{if(!disposed){setTextureState('ready');draw.current()}},undefined,()=>{if(!disposed)setTextureState('failed')})
    texture.colorSpace=THREE.SRGBColorSpace
    texture.anisotropy=renderer.capabilities.getMaxAnisotropy()
    const material=new THREE.MeshStandardMaterial({map:texture,roughness:.96,bumpMap:body.id==='earth'?null:texture,bumpScale:body.id==='moon'?.026:.013})
    const sphere=new THREE.Mesh(geometry,material)
    scene.add(sphere,new THREE.AmbientLight(0xbccde5,.68))
    const sun=new THREE.DirectionalLight(body.id==='mars'?0xffe2c6:0xfff5ec,2.6)
    sun.position.set(-1.65,4.3,2.05)
    scene.add(sun)
    let atmosphere:THREE.ShaderMaterial|undefined
    if(body.id==='earth'){
      atmosphere=new THREE.ShaderMaterial({
        transparent:true,depthWrite:false,side:THREE.FrontSide,
        vertexShader:`varying vec3 n; varying vec3 v;
          void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);v=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
        fragmentShader:`varying vec3 n; varying vec3 v;
          void main(){vec3 normal=normalize(n);float rim=pow(1.0-max(0.0,dot(normal,normalize(v))),4.5);
          float light=0.24+0.76*max(0.0,dot(normal,normalize(vec3(-1.65,4.3,2.05))));
          gl_FragColor=vec4(0.29,0.55,1.0,rim*light*0.66);}`
      })
      const air=new THREE.Mesh(geometry,atmosphere)
      air.scale.setScalar(1.015)
      scene.add(air)
    }

    let detail:THREE.Texture|undefined
    let requestedDetail=false
    const drawWebGL=()=>{
      if(zoom.current>=1.5&&!requestedDetail&&renderer.capabilities.maxTextureSize>=(body.id==='moon'?4096:8192)){
        requestedDetail=true
        new THREE.TextureLoader().load('/textures/'+body.texture+'-detail.webp',loaded=>{
          if(disposed){loaded.dispose();return}
          loaded.colorSpace=THREE.SRGBColorSpace
          loaded.anisotropy=texture.anisotropy
          detail=loaded
          draw.current()
        },undefined,()=>{})
      }
      const surface=zoom.current>=1.5&&detail?detail:texture
      if(material.map!==surface)material.map=surface
      const width=container.clientWidth,height=container.clientHeight
      if(!width||!height)return
      const x=cameraOffset.current.x*width,y=cameraOffset.current.y*height
      const scale=renderedZoom()
      if(camera.zoom!==scale||camera.view?.offsetX!==x||camera.view?.offsetY!==y||camera.view?.width!==width||camera.view?.height!==height){
        camera.zoom=scale
        camera.setViewOffset(width,height,x,y,width,height)
      }
      sphere.rotation.set(angles.current.x,angles.current.y,0,'XYZ')
      sphere.updateMatrixWorld()
      positionPins(([lon,lat])=>{
        const u=THREE.MathUtils.degToRad(lon),v=THREE.MathUtils.degToRad(lat)
        const point=new THREE.Vector3(Math.cos(v)*Math.cos(u),Math.sin(v),-Math.cos(v)*Math.sin(u)).applyMatrix4(sphere.matrixWorld)
        if(point.z*camera.position.z<=1.03)return null
        point.project(camera)
        return [(point.x+1)*container.clientWidth/2,(1-point.y)*container.clientHeight/2]
      })
      renderer.render(scene,camera)
    }
    draw.current=drawWebGL
    const resize=new ResizeObserver(()=>{
      const {clientWidth:w,clientHeight:h}=container
      if(!w||!h)return
      camera.aspect=w/h
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2)
      const fit = 0.87 * Math.min(1, camera.aspect) * Math.tan(halfFov)
      camera.position.z = 1.015 * Math.sqrt(1 + 1 / (fit * fit))
      camera.updateProjectionMatrix()
      renderer.setSize(w,h)
      draw.current()
    })
    resize.observe(container)
    let previous=performance.now()
    renderer.setAnimationLoop((now)=>{
      const elapsed=Math.min(now-previous,50)
      previous=now
      if(canSpin()){
        angles.current.y+=elapsed*rate
        draw.current()
      }
    })
    const lost=(event:Event)=>{event.preventDefault();setFallback(true)}
    const restored=()=>{setFallback(false);draw.current=drawWebGL;draw.current()}
    renderer.domElement.addEventListener('webglcontextlost',lost)
    renderer.domElement.addEventListener('webglcontextrestored',restored)
    return ()=>{
      disposed=true
      detail?.dispose()
      resize.disconnect()
      renderer.setAnimationLoop(null)
      draw.current=()=>{}
      geometry.dispose();material.dispose();atmosphere?.dispose();texture.dispose();renderer.dispose()
      renderer.domElement.remove()
    }
  },[body,rate,fillOnZoom])

  useEffect(()=>{
    if(!fallback||!cpu.current)return
    const renderer=softwareGlobe(cpu.current,'/textures/'+body.texture+'.jpg',()=>({
      x:angles.current.x,y:angles.current.y+Math.PI/2
    }), (ctx,project)=>positionPins(coords=>{
      const point=project(coords)
      const canvas=ctx.canvas
      return point?[point[0]*canvas.clientWidth/canvas.width,point[1]*canvas.clientHeight/canvas.height]:null
    }),body.id,renderedZoom,()=>cameraOffset.current,'/textures/'+body.texture+'-detail.webp',loaded=>setTextureState(loaded?'ready':'failed'))
    draw.current=renderer.draw
    let previous=performance.now(),id=0
    function loop(now:number){
      const elapsed=Math.min(now-previous,50)
      if(canSpin()&&elapsed>=32){
        angles.current.y+=elapsed*rate
        renderer.draw()
        previous=now
      } else if(!canSpin())previous=now
      id=requestAnimationFrame(loop)
    }
    id=requestAnimationFrame(loop)
    return ()=>{cancelAnimationFrame(id);renderer.dispose()}
  },[fallback,body,rate,fillOnZoom])

  function canSpin(){
    return motion.current&&!gesture.current&&!pinch.current&&!document.hidden&&
      !viewport.current?.querySelector('.site-pin:hover,.site-pin:focus-visible')
  }
  function distanceBetweenTouches(){
    const [first,second]=pointers.current.values()
    return first&&second?Math.hypot(first.x-second.x,first.y-second.y):0
  }
  function down(e:PointerEvent<HTMLDivElement>){
    if((e.target as HTMLElement).closest('.site-pin')||e.button!==0)return
    if(e.pointerType==='touch'){
      pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY})
      if(pointers.current.size===2){
        e.currentTarget.setPointerCapture(e.pointerId)
        pinch.current={distance:Math.max(1,distanceBetweenTouches()),zoom:zoom.current}
        gesture.current=null
        return
      }
    }
    if(!e.isPrimary)return
    e.currentTarget.setPointerCapture(e.pointerId)
    gesture.current={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false}
  }
  function move(e:PointerEvent<HTMLDivElement>){
    if(pointers.current.has(e.pointerId))pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY})
    if(pinch.current){
      const distance=distanceBetweenTouches()
      if(distance&&!open){
        const [first,second]=pointers.current.values()
        const bounds=e.currentTarget.getBoundingClientRect()
        changeZoom(pinch.current.zoom*distance/pinch.current.distance,{
          x:((first.x+second.x)/2-bounds.left)/bounds.width-.5,
          y:((first.y+second.y)/2-bounds.top)/bounds.height-.5,
        })
      }
      return
    }
    const start=gesture.current
    if(!start||start.id!==e.pointerId)return
    if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>5)start.moved=true
    if(!start.moved)return
    const sensitivity=.009/Math.sqrt(zoom.current)
    angles.current.y+=(e.clientX-start.lastX)*sensitivity
    angles.current.x=Math.max(-1.5,Math.min(1.5,angles.current.x+(e.clientY-start.lastY)*sensitivity))
    start.lastX=e.clientX;start.lastY=e.clientY
    draw.current()
  }
  function cancel(e:PointerEvent<HTMLDivElement>){
    pointers.current.delete(e.pointerId)
    if(pointers.current.size<2)pinch.current=null
    if(gesture.current?.id===e.pointerId)gesture.current=null
  }
  function up(e:PointerEvent<HTMLDivElement>){
    const start=gesture.current
    cancel(e)
    if(start?.id===e.pointerId&&!start.moved&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<=5)open?.()
  }
  function key(e:KeyboardEvent<HTMLDivElement>){
    if(e.target!==e.currentTarget)return
    const shifts:Record<string,[number,number]>={ArrowLeft:[-.16,0],ArrowRight:[.16,0],ArrowUp:[0,-.16],ArrowDown:[0,.16]}
    const shift=shifts[e.key]
    if(shift){e.preventDefault();angles.current.y+=shift[0];angles.current.x=Math.max(-1.5,Math.min(1.5,angles.current.x+shift[1]));draw.current()}
    if(!open&&['+','=','-','0'].includes(e.key)){
      e.preventDefault()
      changeZoom(e.key==='0'?1:zoom.current*(e.key==='-'?1/1.25:1.25))
    }
    if(open&&(e.key==='Enter'||e.key===' ')){e.preventDefault();open()}
  }
  return <div className="globe-frame" data-zoomed={magnification>1} data-loading={textureState==='loading'}>
    {textureState==='loading'&&<div className="globe-loading"><AtlasLoader compact label={`Loading ${body.name}…`}/></div>}
    {textureState==='failed'&&<span className="globe-load-error">Globe imagery unavailable</span>}
    <div ref={viewport} className="globe" role={open?'button':'group'} tabIndex={0}
    aria-label={open?`Open ${body.name} details. Arrow keys rotate the globe.`:`Rotate ${body.name} with the arrow keys`}
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onLostPointerCapture={cancel} onKeyDown={key}>
    <div ref={host} className="globe-canvas" style={fallback?{visibility:'hidden'}:undefined} aria-hidden="true"/>
    {fallback&&<canvas ref={cpu} className="software-sphere" aria-hidden="true"/>}
    {sites.map(site=><button key={site.id} ref={element=>{if(element)pins.current.set(site.id,element);else pins.current.delete(site.id)}} type="button"
      className="site-pin" data-active={activeSite?.id===site.id} data-match={highlight.includes(site.id)} data-candidate={site.status==='candidate'}
      aria-label={site.name} aria-pressed={activeSite?.id===site.id} hidden onClick={()=>onSite?.(site)}>
      {activeSite?.id!==site.id&&<span className="pin-preview" aria-hidden="true">
        {site.image&&<img src={site.image} alt="" loading="lazy"/>}
        <span><b>{site.name}</b><small>{site.geology}</small></span>
      </span>}
    </button>)}
    </div>
    {!open&&<div className="globe-zoom" role="group" aria-label={body.name+' zoom'}>
      <button type="button" aria-label={'Zoom in on '+body.name} onClick={()=>changeZoom(zoom.current*1.25)} disabled={magnification>=maxZoom}>+</button>
      <button type="button" aria-label={'Zoom out on '+body.name} onClick={()=>changeZoom(zoom.current/1.25)} disabled={magnification<=1}>−</button>
      <button type="button" aria-label={'Reset '+body.name+' zoom'} onClick={()=>changeZoom(1)} disabled={magnification===1}>⌂</button>
    </div>}
  </div>
}
