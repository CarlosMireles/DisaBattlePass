import {type State,goals,CONFIG} from '../model';
export const STORAGE_KEY=`disa-pass-${CONFIG.id}`;
export type Profile='Desayunador'|'Ahorrador'|'Social';
export type Answers=Record<string,string>;
export type Mission0={answers:Answers;step:number;completed:boolean;profile?:Profile;completedAt?:string};
export const questions=[
{id:'stop',title:'¿Qué no puede faltar en tu parada en DISA?',hint:'Elige lo que más va contigo.',options:[{id:'breakfast',icon:'☕',title:'Café y desayuno',detail:'Bocadillos, bollería, zumos'},{id:'snacks',icon:'🥤',title:'Snacks y bebidas frías',detail:'Para el camino o la playa'},{id:'care',icon:'🚿',title:'Mimo para el vehículo',detail:'Lavado y aspirado'},{id:'energy',icon:'⛽',title:'Parada exprés de energía',detail:'Solo repostar o gas'}]},
{id:'prize',title:'Cuando subas de nivel, ¿qué premio te hace más ilusión desbloquear?',hint:'Ese pequeño extra que te alegra el día.',options:[{id:'products',icon:'🥐',title:'Productos gratis en tienda',detail:'Una pausa con premio'},{id:'savings',icon:'💶',title:'Ahorro directo en combustible, luz o gas',detail:'Más ventajas en tu día a día'},{id:'surprises',icon:'🎁',title:'Cajas sorpresa y experiencias exclusivas',detail:'Algo diferente para recordar'}]},
{id:'frequency',title:'¿Cada cuánto sueles pasar por una estación DISA?',hint:'No hay una respuesta correcta: este pase va a tu ritmo.',options:[{id:'daily',icon:'🔥',title:'Casi a diario',detail:'3+ veces por semana'},{id:'weekly',icon:'📅',title:'Semanalmente',detail:'1–2 veces por semana'},{id:'occasional',icon:'🏝️',title:'De vez en cuando / En escapadas',detail:'Cuando el plan lo pide'}]},
{id:'moment',title:'¿En qué momento te mueves más?',hint:'Cuéntanos cuándo suelen empezar tus planes.',options:[{id:'morning',icon:'🌅',title:'Mañanas entre semana',detail:'Empezar el día con energía'},{id:'evening',icon:'🌇',title:'Tardes y noches',detail:'Todavía queda día por disfrutar'},{id:'weekend',icon:'🚗',title:'Fines de semana y planes con amigos',detail:'Los mejores momentos, en compañía'}]},
];
export function validAnswers(a:Answers){return questions.every(q=>q.options.some(o=>o.id===a[q.id]));}
export function profileFor(a:Answers):Profile{
 const score:Record<Profile,number>={Desayunador:0,Ahorrador:0,Social:0};
 const first:Record<string,Profile>={breakfast:'Desayunador',snacks:'Social',care:'Ahorrador',energy:'Ahorrador'};
 const reward:Record<string,Profile>={products:'Desayunador',savings:'Ahorrador',surprises:'Social'};
 const frequency:Record<string,Profile>={daily:'Desayunador',weekly:'Ahorrador',occasional:'Social'};
 const moment:Record<string,Profile>={morning:'Desayunador',evening:'Social',weekend:'Social'};
 if(first[a.stop])score[first[a.stop]]+=2;if(reward[a.prize])score[reward[a.prize]]+=3;if(frequency[a.frequency])score[frequency[a.frequency]]+=1;if(moment[a.moment])score[moment[a.moment]]+=2;
 // En empate decide el premio preferido y luego el orden estable.
 const preference=reward[a.prize]||'Desayunador';return (Object.keys(score) as Profile[]).sort((x,y)=>score[y]-score[x]||(x===preference?-1:y===preference?1:0))[0];
}
export function saveDraft(s:State,answers:Answers,step:number):State{if(s.mission0?.completed||s.awarded.includes('mission0'))return s;return {...s,mission0:{answers:{...answers},step:Math.max(0,Math.min(3,step)),completed:false}};}
export function completeMission0(s:State,answers:Answers):State{
 if(!validAnswers(answers)||s.mission0?.completed||s.awarded.includes('mission0'))return s;
 return {...s,seen:true,xp:s.xp+100,awarded:[...s.awarded,'mission0'],mission0:{answers:{...answers},step:3,completed:true,profile:profileFor(answers),completedAt:new Date().toISOString()}};
}
const orders:Record<Profile,string[]>={Desayunador:['first','weekly','wash','over30'],Ahorrador:['weekly','over30','wash','first'],Social:['wash','first','weekly','over30']};
export function suggestedGoals(s:State){const profile=s.mission0?.profile;if(!s.mission0?.completed||!profile)return goals;const order=orders[profile];return [...goals].sort((a,b)=>Number(s.awarded.includes(a.id))-Number(s.awarded.includes(b.id))||order.indexOf(a.id)-order.indexOf(b.id));}
export const profileCopy:Record<Profile,{icon:string;title:string;description:string}>={Desayunador:{icon:'☕',title:'Tu pausa tiene buen sabor',description:'Primero te sugerimos compras en tienda y tus servicios habituales. Una parada para empezar bien el día.'},Ahorrador:{icon:'💶',title:'Cada ventaja cuenta',description:'Destacamos los objetivos de tus repostajes habituales. Sin desplazarte ni consumir más de lo que necesitas.'},Social:{icon:'🎁',title:'Tu siguiente plan tiene premio',description:'Priorizamos las compras en tienda y el cuidado del vehículo antes de tus planes. También puedes explorar todos los demás objetivos.'}};
