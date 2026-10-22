import{describe,it,expect}from'vitest';import{initial,level,event,award,activate,claim,redeem,prizes,status}from'./model';
describe('Recorridos del pase',()=>{
it('completa un objetivo, sube de nivel y reclama una sola vez',()=>{let s=event(initial(),'vending');s=award(s,'vending');expect(s.xp).toBe(340);expect(level(s)).toBe(4);expect(award(event(s,'vending'),'vending')).toEqual(s);const p=prizes.find(p=>p.level===4&&!p.premium)!;s=claim(s,p);expect(s.claims[p.id].status).toBe('available');expect(claim(s,p)).toEqual(s)});
it('activa prémium una sola vez, preserva progreso y desbloquea niveles previos',()=>{const s=activate(initial());expect(s.balance).toBe(250);expect(s.xp).toBe(240);expect(activate(s)).toEqual(s);expect(claim(s,prizes[1]).claims[prizes[1].id]).toBeDefined()});
it('rechaza saldo insuficiente y premios bloqueados',()=>{const s={...initial(),balance:120};expect(activate(s)).toEqual(s);expect(claim(s,prizes[1])).toEqual(s);expect(claim(s,prizes[18])).toEqual(s)});
it('canjea una vez y rechaza caducados',()=>{let s=claim(initial(),prizes[0]);s=redeem(s,prizes[0].id);expect(s.claims[prizes[0].id].status).toBe('used');expect(redeem(s,prizes[0].id)).toEqual(s);s=claim(s,prizes[2]);s.day='2027-04-01';expect(status(s,prizes[2].id)).toBe('expired');expect(redeem(s,prizes[2].id)).toEqual(s)});
it('exige días distintos y limita progreso a 900',()=>{let s=event(initial(),'shop');expect(s.counts.shop).toBe(1);s.day='2026-10-23';s=event(s,'shop');expect(s.counts.shop).toBe(2);expect(award({...s,xp:890},'shop').xp).toBe(900)});
it('serializa el estado completo y reinicia los datos',()=>{const s=claim(activate(initial()),prizes[1]);expect(JSON.parse(JSON.stringify(s))).toEqual(s);expect(initial().claims).toEqual({});expect(initial().balance).toBe(750)});
});
