'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import DraggableCompanion from './DraggableCompanion';
import CompanionRestore from './CompanionRestore';
import { readLocal, writeLocal } from '../lib/storage';
export default function CaseCompanion() {
  const restoreFocus=useRef(false);
  const [ready,setReady]=useState(false);const [hidden,setHidden]=useState(false);const [message,setMessage]=useState(false);
  useEffect(()=>{setHidden(readLocal('companion-hidden',false,(value):value is boolean=>typeof value==='boolean'));setReady(true);},[]);
  if(!ready)return null;
  if(hidden)return <CompanionRestore onRestore={()=>{restoreFocus.current=true;setHidden(false);}}/>;
  return <><DraggableCompanion focusOnMount={restoreFocus.current} onOpen={()=>setMessage(value=>!value)} onHide={()=>{setMessage(false);setHidden(true);writeLocal('companion-hidden',true);}}/>{message&&<aside className="toast" aria-label="Companion guide"><span>Hold and drag me anywhere. <Link href="/">Explore my workspace</Link></span><button aria-label="Close companion guide" onClick={()=>setMessage(false)}>Close</button></aside>}</>;
}
