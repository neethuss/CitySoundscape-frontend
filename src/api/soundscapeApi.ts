import axios from "axios";
import { postSoundScape } from "../interface/soundType";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const addMix = async (name: string, sounds: postSoundScape[]) => {
  const token = localStorage.getItem('token')
  try {
    console.log(sounds)
    const response = await axios.post(`${BACKEND_URL}/soundscape`, {
      name, sounds
    }, { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch (error) {
    console.log(error)
  }
}


export const getAllSavedMix = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BACKEND_URL}/soundscape`, { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch (error) {
    console.log(error)
  }
}

export const getMixById = async(id:string) =>{
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BACKEND_URL}/soundscape/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch (error) {
    console.log(error)
  }
}

export const editMix = async (id:string,name: string, sounds: postSoundScape[]) => {
  const token = localStorage.getItem('token')
  try {
    console.log(sounds)
    const response = await axios.patch(`${BACKEND_URL}/soundscape/${id}`, {
      name, sounds
    }, { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch (error) {
   console.log(error)
}
}