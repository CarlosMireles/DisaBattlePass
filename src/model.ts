export const CONFIG={id:'disa-mcd-2026-10',partner:"McDonald’s",season:'DISA × McDonald’s · Momentos para compartir',start:'2026-10-01T00:00:00Z',end:'2026-12-01T00:00:00Z',durationMonths:2,price:500,max:900,step:100};
export type Prize={id:string;level:number;premium:boolean;title:string;kind:number;brand:'DISA'|'McDonald’s';photo:number;where:string;conditions:string};
const disa=[
{title:'Un café para tu pausa',kind:0,photo:3,where:'Cafeterías DISA participantes de ejemplo',conditions:'Un café de tamaño pequeño, sujeto a disponibilidad.'},
{title:'15% en tu snack favorito',kind:1,photo:4,where:'Tiendas DISA participantes de ejemplo',conditions:'Solo snacks seleccionados. Una unidad por cupón.'},
{title:'20% en un lavado',kind:2,photo:5,where:'Servicios de lavado DISA participantes de ejemplo',conditions:'Un lavado básico. Sujeto a disponibilidad.'},
{title:'2 € en tu recarga eléctrica',kind:3,photo:6,where:'Puntos de recarga DISA participantes de ejemplo',conditions:'Recarga mínima de 10 €.'},
{title:'5% en un repostaje',kind:4,photo:7,where:'Estaciones DISA participantes de ejemplo',conditions:'Descuento máximo de 3 €.'},
];
const partner=[
{title:'Una hamburguesa para disfrutar',kind:1,photo:0,where:'Restaurantes McDonald’s participantes de ejemplo',conditions:'Una hamburguesa seleccionada. Sujeto a disponibilidad.'},
{title:'Patatas para tu pausa',kind:1,photo:1,where:'Restaurantes McDonald’s participantes de ejemplo',conditions:'Una ración pequeña de patatas. Sujeto a disponibilidad.'},
{title:'Un helado y una sonrisa',kind:1,photo:2,where:'Restaurantes McDonald’s participantes de ejemplo',conditions:'Un helado de vainilla en vaso, sin extras.'},
{title:'Tu momento de menú',kind:1,photo:8,where:'Restaurantes McDonald’s participantes de ejemplo',conditions:'Un menú de ejemplo seleccionado, sin suplementos.'},
];
// Cada bloque de cinco contiene 2 premios del colaborador y 3 DISA: 8 / 12 en total.
export const prizes:Prize[]=Array.from({length:20},(_,index)=>{const isPartner=index%5<2;const pool=isPartner?partner:disa;const number=isPartner?Math.floor(index/5)*2+index%5:Math.floor(index/5)*3+index%5-2;return {...pool[number%pool.length],id:`${Math.floor(index/2)+1}-${index%2?'p':'f'}`,level:Math.floor(index/2)+1,premium:!!(index%2),brand:isPartner?'McDonald’s':'DISA'};});
export const goals=[{id:'first',title:'Tu primera compra, con la app',detail:'Identifícate con la app en una compra de tienda o vending.',target:1,xp:60},{id:'shop',title:'Dos días, dos pequeños momentos',detail:'Compra en tienda en dos días diferentes.',target:2,xp:100},{id:'vending',title:'Una pausa a tu manera',detail:'Haz una compra en una máquina participante.',target:1,xp:100},{id:'wash',title:'Un cuidado para tu coche',detail:'Utiliza un servicio de lavado cuando lo necesites.',target:1,xp:100},{id:'charge',title:'Energía para seguir',detail:'Realiza una recarga eléctrica.',target:1,xp:100}];
export type State={balance:number;xp:number;premium:boolean;claims:Record<string,{status:'available'|'used'|'expired';date:string}>;counts:Record<string,number>;awarded:string[];shopDays:string[];day:string;seen:boolean};
export const initial=():State=>({balance:750,xp:240,premium:false,claims:{},counts:{first:1,shop:1},awarded:['first'],shopDays:[new Date().toISOString().slice(0,10)],day:new Date().toISOString().slice(0,10),seen:false});
export const seasonActive=(s:State)=>new Date(s.day)>=new Date(CONFIG.start)&&new Date(s.day)<new Date(CONFIG.end);
export const level=(s:State)=>Math.min(10,Math.floor(s.xp/100)+1);
export function event(s:State,type:string):State{const n=structuredClone(s); if(type==='shop'||type==='vending')n.counts.first=1;if(type==='shop'){n.shopDays=[...new Set([...n.shopDays,n.day])];n.counts.shop=Math.min(2,n.shopDays.length);}else n.counts[type]=1;return n;}
export function award(s:State,id:string):State{const g=goals.find(g=>g.id===id);if(!seasonActive(s)||!g||s.awarded.includes(id)||(s.counts[id]||0)<g.target)return s;return {...s,xp:Math.min(CONFIG.max,s.xp+g.xp),awarded:[...s.awarded,id]};}
export function activate(s:State):State{return !seasonActive(s)||s.premium||s.balance<CONFIG.price?s:{...s,balance:s.balance-CONFIG.price,premium:true};}
export function claim(s:State,p:Prize):State{if(!seasonActive(s)||s.claims[p.id]||p.level>level(s)||(p.premium&&!s.premium))return s;return {...s,claims:{...s.claims,[p.id]:{status:'available',date:CONFIG.end}}};}
export function redeem(s:State,id:string):State{if(s.claims[id]?.status!=='available'||new Date(s.claims[id].date)<=new Date(s.day))return s;return {...s,claims:{...s.claims,[id]:{...s.claims[id],status:'used'}}};}
export function status(s:State,id:string){const c=s.claims[id];return c?.status==='available'&&new Date(c.date)<=new Date(s.day)?'expired':c?.status;}
