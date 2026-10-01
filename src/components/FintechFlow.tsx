import { useEffect, useRef, useState } from 'react';
import { LazyMotion, domMax, m } from 'motion/react';
import type { Locale } from '../i18n';
import './fintech-flow.css';

interface Scenario { title: string; path: string; text: string; stages: number[]; operations: string[] }
interface Props { scenarios: Scenario[]; units: [string,string,string][]; note: string; locale: Locale }
const ease = [.22,1,.36,1] as const;

function Glyph({ index }: { index: number }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {index===0 && <><rect x="12" y="4" width="24" height="40" rx="5"/><path d="M21 9h6M21 39h6M17 17h14M17 23h9M17 29h14"/></>}
    {index===1 && <><path d="M24 5 39 11v12c0 10-15 19-15 19S9 33 9 23V11Z"/><circle cx="24" cy="21" r="5"/><path d="M24 26v7m0-3h5"/></>}
    {index===2 && <><path d="M5 13h38v22H5zM5 19h38M10 16h1m3 0h1m3 0h1M16 24l-5 4 5 4m16-8 5 4-5 4m-6-10-4 12"/></>}
    {index===3 && <><ellipse cx="24" cy="10" rx="16" ry="6"/><path d="M8 10v26c0 8 32 8 32 0V10M8 23c0 8 32 8 32 0M8 35c0 8 32 8 32 0"/></>}
  </svg>;
}

export default function FintechFlow({scenarios,units,note,locale}: Props) {
  const pt=locale==='pt';
  const [reduced,setReduced]=useState(false);
  const [selected,setSelected]=useState(0);
  const [enhanced,setEnhanced]=useState(false);
  const flow=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    // Native radios and CSS work before hydration; preserve any early selection.
    const checked=flow.current?.querySelector<HTMLInputElement>('input:checked');
    setSelected(Number(checked?.value??0));
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion=()=>setReduced(preference.matches);
    syncMotion();
    preference.addEventListener('change',syncMotion);
    setEnhanced(true);
    return ()=>preference.removeEventListener('change',syncMotion);
  },[]);
  const scenario=scenarios[selected]??scenarios[0]!;
  const instant=reduced || !enhanced;
  const transition=instant?{duration:0,delay:0}:{duration:.28,ease};
  return <LazyMotion features={domMax} strict>
    <div ref={flow} className="fintech-flow flow" data-flow data-selected-scenario={selected} data-enhanced={enhanced||undefined}>
      <fieldset data-controls>
        <legend>{pt?'Explore o fluxo':'Explore the flow'}</legend>
        <div className="scenario-controls">
          {scenarios.map((item,index)=><label key={item.title}>
            {selected===index && <m.span key={`${selected}-${reduced}`} className="selection-indicator" data-selection layoutId={instant?undefined:"fintech-selection"} aria-hidden="true" transition={instant?{duration:0}:{type:'spring',visualDuration:.32,bounce:0}}/>}
            <input type="radio" name="scenario" value={index} defaultChecked={index===0} aria-controls={`scenario-${index}`} onChange={()=>setSelected(index)}/>
            <span>{item.title}</span>
          </label>)}
        </div>
      </fieldset>
      <ol className="units" aria-label={pt?'Arquitetura da implementação':'Implementation architecture'}>
        {units.map((unit,index)=>{
          const active=scenario.stages.includes(index);
          const connected=active&&scenario.stages.includes(index+1);
          return <li key={unit[0]} data-unit={index} data-active={active}>
            <div className="unit-body">
              <m.div key={String(reduced)} className="node-glyph" initial={false} animate={{scale:active?1:.96,opacity:active?1:.65}} transition={transition}>
                <Glyph index={index}/><span className="stage-number" aria-hidden="true">{index+1}</span>
              </m.div>
              <h4>{index===1?<>Authentication<wbr/>Session</>:unit[0]}</h4>
              <p>{unit[1]}</p>
              <m.p className="operation" data-operation key={`${scenario.operations[index]}-${reduced}`} initial={instant?false:{opacity:.6,y:4}} animate={{opacity:1,y:0}} transition={transition}>{scenario.operations[index]}</m.p>
              <div className="caption"><strong>{unit[2]}</strong><span data-stage-status>{active?(pt?'No percurso selecionado':'On the selected path'):(pt?'Fora deste percurso':'Outside this path')}</span></div>
            </div>
            {index<3 && <span className="connector" data-connector={index} data-active={connected} aria-hidden="true">
              {[false,true].map(vertical=><svg key={String(vertical)} className={vertical?'vertical-path':'horizontal-path'} viewBox={vertical?'0 0 24 120':'0 0 120 24'} preserveAspectRatio="none"><path className="connector-base" d={vertical?'M12 0V120':'M0 12H120'}/><m.path key={`${selected}-${reduced}`} className="connector-progress" d={vertical?'M12 0V120':'M0 12H120'} initial={instant?false:{pathLength:0}} animate={{pathLength:connected?(instant?1:selected===1?[0,1,.35,1]:1):0}} transition={instant?{duration:0,delay:0}:{duration:selected===1?.48:.28,delay:index*.08,ease}}/></svg>)}
              <span className="connector-arrow">{selected===1&&connected?'↔':'→'}</span>
            </span>}
          </li>;
        })}
      </ol>
      <m.div className="explanations" key={`${selected}-${reduced}`} aria-live="polite" aria-atomic="true" initial={instant?false:{opacity:.6,y:6}} animate={{opacity:1,y:0}} transition={transition}>
        {scenarios.map((item,index)=><section key={item.title} id={`scenario-${index}`} data-scenario aria-labelledby={`scenario-title-${index}`}><h4 id={`scenario-title-${index}`}>{item.title}</h4><p className="path">{item.path}</p><p>{item.text}</p></section>)}
      </m.div>
      <p className="note">{note}</p>
    </div>
  </LazyMotion>;
}
