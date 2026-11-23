'use client';
import { useEffect, useState } from 'react';
import { Code2, Database, GitBranch, Cpu, Layers, Terminal, RotateCcw } from 'lucide-react';
const icons=[Code2,Database,GitBranch,Cpu,Layers,Terminal];
const names=['code','database','git','processor','layers','terminal'];
function shuffle(){const deck=[0,0,1,1,2,2,3,3,4,4,5,5];for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;}
export default function MemoryGame(){
 const [cards,setCards]=useState<number[]>(shuffle);const [flipped,setFlipped]=useState<number[]>([]);const [matched,setMatched]=useState<number[]>([]);const [moves,setMoves]=useState(0);
 const mismatch=flipped.length===2;
 useEffect(()=>{if(!mismatch)return;const timer=setTimeout(()=>setFlipped([]),850);return()=>clearTimeout(timer);},[flipped,mismatch]);
 function flip(i:number){if(flipped.includes(i)||matched.includes(i))return;const next=mismatch?[i]:[...flipped,i];setFlipped(next);if(next.length===2){setMoves(m=>m+1);if(cards[next[0]]===cards[next[1]]){setMatched(m=>[...m,...next]);setFlipped([]);}}}
 return <div className="game"><div className="eyebrow">A SMALL MENTAL RESET</div><h2>Match the stack.</h2><p>Find six pairs. Missed pairs turn back automatically — or pick the next card to keep going.</p><div className="game-meta"><span>{moves} moves · {matched.length/2}/6 pairs</span><button className="text-button" onClick={()=>{setCards(shuffle());setFlipped([]);setMatched([]);setMoves(0);}}><RotateCcw size={15}/>New game</button></div><div className="memory-grid">{cards.map((value,i)=>{const Icon=icons[value];const visible=flipped.includes(i)||matched.includes(i);return <button key={i} className={`${visible?'revealed':''} ${matched.includes(i)?'matched':''}`} aria-label={visible?`Card ${i+1}: ${names[value]}${matched.includes(i)?', matched':''}`:`Reveal card ${i+1}`} aria-pressed={visible} disabled={matched.includes(i)} onClick={()=>flip(i)}>{visible?<span className="memory-face"><Icon size={28}/><small>{names[value]}</small></span>:<span>✦</span>}</button>;})}</div><p className="memory-status" role="status">{matched.length===12?'Stack complete! Start a new game whenever you like.':mismatch?'Not a match. Keep going — no extra button needed.':matched.length?'Nice match. Find the next pair.':'Pick any two cards. No timer, no pressure.'}</p></div>
}
