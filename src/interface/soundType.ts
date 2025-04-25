export interface SoundState{
  selected:boolean;
  volume:number
}

export interface postSoundScape{
  id:string,
  volume:number
}

export interface savedMix{
  _id:string, name:string,
  sounds:postSoundScape[]
}