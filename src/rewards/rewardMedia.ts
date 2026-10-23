import sheet from '../assets/rewards/rewards.png';
import plush from '../assets/rewards/plush-green.png';
export function rewardMedia(photo:number){
 if(photo===9)return {image:plush,position:'center',size:'cover',key:'plush-green'};
 if(!Number.isInteger(photo)||photo<0||photo>8)return undefined;
 return {image:sheet,position:`${photo%3*50}% ${Math.floor(photo/3)*50}%`,size:'300% 300%',key:`reward-${photo}`};
}
