import { type CSSProperties } from 'react';
import { type BackgroundMode } from '../content/backgrounds';
import CityBackdrop from './CityBackdrop';

export default function WorkspaceBackdrop({ mode, moving }: { mode: BackgroundMode; moving: boolean }) {
  if (mode === 'city') return <CityBackdrop moving={moving}/>;
  return <div className={`wallpaper workspace-backdrop quiet-wallpaper backdrop-${mode}`} data-mode={mode} data-motion={moving ? 'playing' : 'paused'} aria-hidden="true">
    {mode === 'aurora' && <><div className="aurora-art backdrop-animated"><picture><source media="(max-width:767px)" srcSet="/assets/wallpapers/aurora-defined-mobile.webp"/><img src="/assets/wallpapers/aurora-defined.webp" alt="" width={1536} height={1024} decoding="async" draggable={false}/></picture></div><div className="aurora-veil backdrop-animated"/><div className="aurora-warmth backdrop-animated"/></>}
    {mode === 'ambient' && <><div className="ambient-pool pool-wine backdrop-animated"/><div className="ambient-pool pool-beige backdrop-animated"/><div className="ambient-rim backdrop-animated"/><div className="ambient-sheen backdrop-animated"/></>}

    {mode === 'binary' && <div className="binary-rain">{Array.from({length:28},(_,column)=><span key={column} className={`binary-column binary-depth-${column%3} backdrop-animated`} style={{left:`${(column+.5)*100/28}%`,animationDuration:`${13+column%9*1.6}s`,animationDelay:`-${column*2.37}s`} as CSSProperties}>{Array.from({length:30},(_,row)=><span key={row} className={row===29?'binary-head':row>25?'binary-bright':''}>{((row*17+column*13+row*column)%11)<5?'0':'1'}</span>)}</span>)}</div>}
    {mode === 'circuit' && <svg className="circuit-field" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">{[
      'M1600 140H1230L1160 210H1040V320L960 400H880',
      'M1600 176H1245L1190 231H1072V338L990 420H880',
      'M1600 310H1420L1360 370H1250V470L1180 540H1110',
      'M1600 346H1436L1380 402H1282V490L1210 562H1110',
      'M1480 900V760L1390 670V560H1290',
      'M1510 900V745L1420 655V528H1290',
      'M1180 900V810L1100 730H970L900 660H710',
      'M1148 900V828L1082 762H952L882 692H710',
      'M0 820H240L300 760H450L510 700H620'
    ].map((path,i)=><g key={path}><path d={path} className="circuit-trace"/><path d={path} pathLength={1000} className="circuit-pulse backdrop-animated" style={{animationDelay:`-${i*1.83}s`,animationDuration:`${12+i%4*2}s`}}/></g>)}<g className="circuit-ports">{[[880,400],[880,420],[1110,540],[1110,562],[1290,560],[1290,528],[710,660],[710,692],[620,700]].map(([cx,cy])=><g key={`${cx}-${cy}`}><circle cx={cx} cy={cy} r="5"/><circle className="circuit-node-core" cx={cx} cy={cy} r="1.5"/></g>)}</g></svg>}
  </div>;
}
