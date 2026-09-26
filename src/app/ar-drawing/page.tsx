'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ar.module.css';

type Pt={x:number;y:number};

export default function ARDrawingPage(){
  const videoRef=useRef<HTMLVideoElement>(null);
  const imgRef=useRef<HTMLImageElement>(null);
  const inputRef=useRef<HTMLInputElement>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const pointers=useRef(new Map<number,Pt>());
  const gesture=useRef<any>(null);
  const [cameraReady,setCameraReady]=useState(false);
  const [imageUrl,setImageUrl]=useState('');
  const [locked,setLocked]=useState(false);
  const [opacity,setOpacity]=useState(55);
  const [panel,setPanel]=useState(false);
  const [help,setHelp]=useState(false);
  const [toast,setToast]=useState('');
  const [state,setState]=useState({x:0,y:0,scale:1,rotation:0,flipX:1});

  useEffect(()=>()=>{streamRef.current?.getTracks().forEach(t=>t.stop())},[]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),1600);return()=>clearTimeout(t)},[toast]);

  async function startCamera(){
    if(streamRef.current){setCameraReady(true);return true;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});
      streamRef.current=stream;
      if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();}
      setCameraReady(true);setToast('Camera ready');return true;
    }catch{setToast('Camera permission is required');return false;}
  }

  async function chooseImage(){await startCamera();inputRef.current?.click();}
  function reset(){if(locked){setToast('Unlock first');return;}setState({x:0,y:0,scale:1,rotation:0,flipX:1});setOpacity(55)}
  const transform=`translate(calc(-50% + ${state.x}px), calc(-50% + ${state.y}px)) rotate(${state.rotation}deg) scale(${state.scale*state.flipX},${state.scale})`;
  const dist=(a:Pt,b:Pt)=>Math.hypot(b.x-a.x,b.y-a.y);
  const angle=(a:Pt,b:Pt)=>Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
  const mid=(a:Pt,b:Pt)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});

  function pointerDown(e:React.PointerEvent<HTMLDivElement>){
    if(locked||!imageUrl)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const pts=[...pointers.current.values()];
    if(pts.length===1)gesture.current={type:'move',start:pts[0],x:state.x,y:state.y};
    if(pts.length===2)gesture.current={type:'pinch',startDist:dist(pts[0],pts[1]),startAngle:angle(pts[0],pts[1]),startMid:mid(pts[0],pts[1]),...state};
  }
  function pointerMove(e:React.PointerEvent<HTMLDivElement>){
    if(locked||!pointers.current.has(e.pointerId)||!gesture.current)return;
    pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const pts=[...pointers.current.values()];
    const g=gesture.current;
    if(pts.length===1&&g.type==='move')setState(s=>({...s,x:g.x+(pts[0].x-g.start.x),y:g.y+(pts[0].y-g.start.y)}));
    else if(pts.length===2){
      if(g.type!=='pinch'){gesture.current={type:'pinch',startDist:dist(pts[0],pts[1]),startAngle:angle(pts[0],pts[1]),startMid:mid(pts[0],pts[1]),...state};return;}
      const m=mid(pts[0],pts[1]);
      setState(s=>({...s,scale:Math.min(8,Math.max(.15,g.scale*(dist(pts[0],pts[1])/Math.max(g.startDist,1)))),rotation:g.rotation+(angle(pts[0],pts[1])-g.startAngle),x:g.x+(m.x-g.startMid.x),y:g.y+(m.y-g.startMid.y)}));
    }
  }
  function pointerEnd(e:React.PointerEvent<HTMLDivElement>){
    pointers.current.delete(e.pointerId);
    const pts=[...pointers.current.values()];
    gesture.current=pts.length===1?{type:'move',start:pts[0],x:state.x,y:state.y}:null;
  }

  return <main className={styles.page}>
    <video ref={videoRef} className={styles.video} autoPlay playsInline muted />
    <div className={styles.shade}/>
    <div className={styles.stage} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}>
      {imageUrl&&<img ref={imgRef} src={imageUrl} alt="Tracing overlay" className={styles.overlay} style={{opacity:opacity/100,transform,width:'72vw',maxWidth:'760px'}} draggable={false}/>} 
    </div>

    <header className={`${styles.topbar} ${styles.glass}`}>
      <div className={styles.brand}><span className={styles.dot}/>SBC AR DRAW</div>
      <button className={styles.help} onClick={()=>setHelp(true)}>?</button>
    </header>

    {!cameraReady&&<section className={`${styles.hero} ${styles.glass}`}>
      <div className={styles.eyebrow}>TRACE ANYTHING</div>
      <h1 className={styles.title}>Choose a picture and draw it on paper.</h1>
      <p className={styles.desc}>Keep the phone above your page, adjust the picture, then lock it before tracing.</p>
      <button className={styles.primary} onClick={startCamera}>Start camera</button>
      <button className={styles.secondary} onClick={chooseImage}>Choose picture</button>
    </section>}

    {panel&&<aside className={`${styles.panel} ${styles.glass}`}>
      <div className={styles.panelRow}><span>Opacity</span><strong>{opacity}%</strong></div>
      <input className={styles.slider} type="range" min="5" max="100" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/>
    </aside>}

    <nav className={`${styles.toolbar} ${styles.glass}`}>
      <button className={styles.tool} onClick={chooseImage}><span className={styles.toolIcon}>▣</span><span>Gallery</span></button>
      <button className={`${styles.tool} ${panel?styles.active:''}`} onClick={()=>setPanel(v=>!v)}><span className={styles.toolIcon}>◐</span><span>Opacity</span></button>
      <button className={`${styles.tool} ${styles.emphasis}`} onClick={()=>{if(!imageUrl){setToast('Choose a picture first');return;}setLocked(v=>!v);setPanel(false)}}><span className={styles.toolIcon}>{locked?'🔒':'🔓'}</span><span>{locked?'Unlock':'Lock'}</span></button>
      <button className={styles.tool} onClick={()=>{if(locked){setToast('Unlock first');return;}setState(s=>({...s,flipX:s.flipX*-1}))}}><span className={styles.toolIcon}>⇆</span><span>Flip</span></button>
      <button className={styles.tool} onClick={reset}><span className={styles.toolIcon}>↺</span><span>Reset</span></button>
    </nav>

    <input ref={inputRef} type="file" accept="image/*" hidden onChange={e=>{const f=e.target.files?.[0];if(!f)return;const u=URL.createObjectURL(f);setImageUrl(u);setState({x:0,y:0,scale:1,rotation:0,flipX:1});setOpacity(55);setToast('Move, pinch, rotate — then lock')}}/>
    <div className={`${styles.toast} ${toast?styles.toastShow:''}`}>{toast}</div>

    {help&&<div className={styles.helpCard} onClick={()=>setHelp(false)}><div className={styles.helpInner} onClick={e=>e.stopPropagation()}>
      <h2>How to use</h2><ol><li>Start the camera.</li><li>Choose a picture.</li><li>Drag with one finger.</li><li>Pinch to zoom and rotate.</li><li>Set opacity and press Lock.</li><li>Trace it on paper.</li></ol>
      <button className={styles.primary} onClick={()=>setHelp(false)}>Got it</button>
    </div></div>}
  </main>
}
