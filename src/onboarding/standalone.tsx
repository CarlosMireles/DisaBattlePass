import {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {initial,restore,type State} from '../model';
import {MissionZero} from './MissionZero';
import {STORAGE_KEY,saveDraft,completeMission0} from './mission0';
import '../style.css';
function StandaloneMission(){
 const[state,setState]=useState<State>(()=>{try{const raw=localStorage.getItem(STORAGE_KEY);return raw?restore(JSON.parse(raw)):initial()}catch{return initial()}});
 useEffect(()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(state)),[state]);
 const back=()=>{location.href='./index.html#pase'};
 return <div style={{minHeight:'100dvh',background:'#f6f8fb',padding:'16px'}}><MissionZero state={state} onDraft={(a,step)=>setState(s=>saveDraft(s,a,step))} onComplete={a=>setState(s=>completeMission0(s,a))} onContinue={back} onSkip={back}/></div>;
}
createRoot(document.getElementById('mission-zero-root')!).render(<StandaloneMission/>);
