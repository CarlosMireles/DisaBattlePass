import{describe,it,expect}from'vitest';
import{initial,prizes,resolvePrize,claim,activate}from'../model';
import{rewardMedia}from'./rewardMedia';
describe('Identidad e imagen de las recompensas',()=>{
 it('resuelve las veinte recompensas por su ID sin depender del orden del tablero',()=>{const s=initial();for(const p of [...prizes].reverse())expect(resolvePrize(s,p.id)).toEqual(p);expect(resolvePrize(s,'unknown')).toBeUndefined()});
 it('el peluche y su pack usan la imagen verde y nunca la hamburguesa',()=>{for(const id of ['2-p','6-p']){const p=resolvePrize(initial(),id)!;expect(p.title.toLowerCase()).toContain('peluche');const art=rewardMedia(p.photo)!;expect(art.key).toBe('plush-green');expect(art.image).toContain('plush-green');expect(art.image).not.toBe(rewardMedia(0)?.image)}});
 it('usa recortes explícitos para cada imagen del catálogo y no toma la primera para índices desconocidos',()=>{const keys=new Set(prizes.map(p=>rewardMedia(p.photo)?.key));expect(keys).not.toContain(undefined);expect(rewardMedia(0)?.position).toBe('0% 0%');expect(rewardMedia(8)?.position).toBe('100% 100%');expect(rewardMedia(10)).toBeUndefined();expect(rewardMedia(-1)).toBeUndefined();expect(rewardMedia(NaN)).toBeUndefined()});
 it('conserva las condiciones de un cupón con la misma identidad',()=>{const p=prizes.find(p=>p.id==='2-p')!;const s=claim(activate(initial()),p);const copy={...p,title:'Peluche del pájaro DISA · cupón guardado'};s.claims[p.id].prize=copy;expect(resolvePrize(s,p.id)).toBe(copy)});
 it('rechaza datos guardados bajo un ID incorrecto sin mezclar el peluche con un Big Mac',()=>{const s=initial();s.claims['2-p']={status:'available',date:'2026-12-01',prize:prizes.find(p=>p.id==='1-p')!};const p=resolvePrize(s,'2-p')!;expect(p.id).toBe('2-p');expect(p.title).toContain('Peluche');expect(p.photo).toBe(9)});
 it('descarta imágenes corruptas en snapshots y usa el premio correcto del catálogo',()=>{const s=initial();const p=prizes.find(p=>p.id==='6-p')!;s.claims[p.id]={status:'available',date:'2026-12-01',prize:{...p,photo:100}};expect(resolvePrize(s,p.id)).toEqual(p)});
});
