import{Gift}from'lucide-react';
import type{Prize}from'../model';
import{rewardMedia}from'./rewardMedia';
export function RewardArtwork({prize,detail=false}:{prize:Prize;detail?:boolean}){
 const media=rewardMedia(prize.photo);
 return <div role="img" aria-label={media?`Foto ilustrativa de ${prize.title}`:`Imagen no disponible de ${prize.title}`} data-reward-id={prize.id} data-artwork={media?.key||'unavailable'} className={detail?'reward-detail-photo':'reward-photo'} style={media?{backgroundImage:`url("${media.image}")`,backgroundPosition:media.position,backgroundSize:media.size}: {backgroundImage:'none',display:'grid',placeItems:'center'}}>{!media&&<Gift size={36}/>}</div>;
}
