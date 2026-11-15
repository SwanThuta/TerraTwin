type Navigation = {x:number;y:number}
type GeoPoint = [number,number]
const TAU=2*Math.PI

/** Orthographic sphere renderer for browsers without WebGL. */
export function softwareGlobe(canvas:HTMLCanvasElement,textureUrl:string,angles:()=>Navigation,paintMarkers?:(ctx:CanvasRenderingContext2D,project:(point:GeoPoint)=>GeoPoint|null)=>void,cinematic?:'earth'|'moon'|'mars',magnification=()=>1,offset=()=>({x:0,y:0}),detailUrl?:string,onTextureState?:(loaded:boolean)=>void){
  const ctx=canvas.getContext('2d')!
  const image=new Image()
  let map:ImageData|undefined
  let detail:ImageData|undefined
  let detailImage:HTMLImageElement|undefined
  let frame:ImageData|undefined
  let points:Float32Array|undefined
  let width=0,height=0,radius=0,lastZoom=0
  let centerX=0,centerY=0,lastX=0,lastY=0
  function draw(){
    if(!frame)return
    if(lastZoom!==magnification()||lastX!==offset().x||lastY!==offset().y)prepareSurface()
    if(!points)return
    const rotation=angles()
    const cp=Math.cos(rotation.x),sp=Math.sin(rotation.x),cy=Math.cos(rotation.y),sy=Math.sin(rotation.y)
    if(detailUrl&&lastZoom>=1.5&&!detailImage){
      detailImage=new Image()
      detailImage.onload=()=>{detail=readImage(detailImage!);draw()}
      detailImage.src=detailUrl
    }
    const pixels=frame.data
    const surface=lastZoom>=1.5&&detail?detail:map
    const source=surface?.data
    const sw=surface?.width??0,sh=surface?.height??0
    for(let i=0;i<width*height;i++){
      const k=i*4, z=points[k+2]
      if(z<0)continue
      const x=points[k],y=points[k+1]
      const yy=cp*y+sp*z
      const depth=cp*z-sp*y
      const zz=sy*x+cy*depth
      const xx=cy*x-sy*depth
      const longitude=(.5+Math.atan2(xx,zz)/TAU+1)%1
      const latitude=.5-Math.asin(Math.min(1,Math.max(-1,yy)))/Math.PI
      const s=(Math.min(sh-1,Math.floor(latitude*sh))*sw+Math.floor(longitude*sw))*4
      const light=points[k+3]
      pixels[k]=(source?.[s]??80)*light
      pixels[k+1]=(source?.[s+1]??110)*light
      pixels[k+2]=(source?.[s+2]??145)*light
      if(cinematic==='earth'){
        const rim=Math.pow(1-z,4)*(.30+.4*Math.max(0,y))
        pixels[k]+=57*rim
        pixels[k+1]+=124*rim
        pixels[k+2]+=220*rim
      }
      pixels[k+3]=Math.min(255,Math.round(z*z*radius*255+60))
    }
    ctx.putImageData(frame,0,0)
    paintMarkers?.(ctx,([lon,lat])=>{
      const theta=lon*Math.PI/180,phi=lat*Math.PI/180
      const xx=Math.cos(phi)*Math.sin(theta),yy=Math.sin(phi),zz=Math.cos(phi)*Math.cos(theta)
      const z=-sy*xx+cy*zz
      const x=cy*xx+sy*zz
      const y=cp*yy-sp*z
      const facing=sp*yy+cp*z
      return facing>=0?[centerX+radius*x,centerY-radius*y]:null
    })
  }
  const resize=new ResizeObserver(()=>{
    const scale=Math.min(window.devicePixelRatio||1,cinematic?1:1.5,(cinematic?460:620)/Math.max(1,canvas.clientHeight))
    width=Math.round(canvas.clientWidth*scale)
    height=Math.round(canvas.clientHeight*scale)
    if(!width||!height)return
    canvas.width=width;canvas.height=height
    frame=ctx.createImageData(width,height)
    lastZoom=0
    draw()
  })
  function prepareSurface(){
    lastZoom=magnification()
    const {x,y}=offset()
    lastX=x;lastY=y
    centerX=width*(.5-x);centerY=height*(.5-y)
    radius=Math.min(height*.445,width*.487)*lastZoom
    frame!.data.fill(0)
    points=new Float32Array(width*height*4)
    for(let j=0;j<height;j++){
      const y=(centerY-j-.5)/radius
      for(let i=0;i<width;i++){
        const x=(i+.5-centerX)/radius
        const z2=1-x*x-y*y
        const k=(j*width+i)*4
        if(z2<=0){points[k+2]=-1;continue}
        const z=Math.sqrt(z2)
        points[k]=x;points[k+1]=y;points[k+2]=z
        points[k+3]=cinematic ? .43+1.05*Math.pow(Math.max(0,-.29*x+.87*y+.39*z),.85) : .30+.91*Math.max(0,-.55*x+.43*y+.71*z)
      }
    }
  }
  resize.observe(canvas)
  function readImage(asset:HTMLImageElement){
    const buffer=document.createElement('canvas')
    buffer.width=asset.naturalWidth;buffer.height=asset.naturalHeight
    const scratch=buffer.getContext('2d')!
    scratch.drawImage(asset,0,0)
    return scratch.getImageData(0,0,buffer.width,buffer.height)
  }
  image.onload=()=>{try{map=readImage(image);draw();onTextureState?.(true)}catch{onTextureState?.(false)}}
  image.onerror=()=>onTextureState?.(false)
  image.src=textureUrl
  return {draw,dispose:()=>{resize.disconnect();image.onload=null;image.onerror=null;if(detailImage)detailImage.onload=null}}
}
