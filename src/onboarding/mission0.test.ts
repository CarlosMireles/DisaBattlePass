import {describe,it,expect} from 'vitest';
import {initial,restore,award,level} from '../model';
import {completeMission0,saveDraft,profileFor,suggestedGoals,questions,type Answers} from './mission0';
const breakfast={stop:'breakfast',prize:'products',frequency:'daily',moment:'morning'};
const saver={stop:'energy',prize:'savings',frequency:'weekly',moment:'evening'};
const social={stop:'snacks',prize:'surprises',frequency:'occasional',moment:'weekend'};
describe('Misión 0',()=>{
 it('valida las cuatro respuestas y no recompensa formularios incompletos o manipulados',()=>{const s=initial();expect(completeMission0(s,{})).toBe(s);expect(completeMission0(s,{...breakfast,stop:'inventado'})).toBe(s);for(const q of questions){const a:Answers={...breakfast};delete a[q.id];expect(completeMission0(s,a)).toBe(s)}});
 it('clasifica Desayunador, Ahorrador y Social y resuelve empates de forma determinista',()=>{expect(profileFor(breakfast)).toBe('Desayunador');expect(profileFor(saver)).toBe('Ahorrador');expect(profileFor(social)).toBe('Social');expect(profileFor({stop:'breakfast',prize:'savings',frequency:'weekly',moment:'morning'})).toBe('Ahorrador')});
 it('guarda un borrador sin otorgar XP y lo restaura en el mismo paso',()=>{const s=saveDraft(initial(),{stop:'breakfast'},1);expect(s.xp).toBe(240);expect(s.awarded).not.toContain('mission0');expect(restore(JSON.parse(JSON.stringify(s))).mission0).toEqual(s.mission0)});
 it('suma exactamente 100 XP, sube de nivel y completa la misión una sola vez',()=>{const s=completeMission0(initial(),breakfast);expect(s.xp).toBe(340);expect(level(s)).toBe(4);expect(s.mission0?.completed).toBe(true);expect(s.mission0?.profile).toBe('Desayunador');expect(s.awarded.filter(id=>id==='mission0')).toHaveLength(1);expect(completeMission0(s,social)).toBe(s);expect(saveDraft(s,social,0)).toBe(s)});
 it('conserva misión y recompensa al recargar y no vuelve a cobrarlas',()=>{const s=completeMission0(initial(),saver);const loaded=restore(JSON.parse(JSON.stringify(s)));expect(loaded.awarded).toContain('mission0');expect(completeMission0(loaded,saver)).toBe(loaded);expect(loaded.xp).toBe(340)});
 it('concede 100 XP incluso al nivel máximo sin reducir el saldo ni perder progreso',()=>{const s=completeMission0({...initial(),xp:890},social);expect(s.xp).toBe(990);expect(level(s)).toBe(10);expect(s.balance).toBe(750);expect(award({...s,counts:{wash:1}},'wash').xp).toBe(990)});
 it('prioriza misiones según el perfil sin crear ni modificar objetivos existentes',()=>{const base={...initial(),awarded:[]};const a=suggestedGoals(completeMission0(base,saver));const b=suggestedGoals(completeMission0(base,breakfast));expect(a[0].id).toBe('weekly');expect(b[0].id).toBe('first');expect(new Set(a.map(g=>g.id))).toEqual(new Set(b.map(g=>g.id)))});
});
