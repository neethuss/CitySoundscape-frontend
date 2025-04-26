import axios from "axios";
import { postSoundScape } from "../interface/soundType";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL: BACKEND_URL, withCredentials: true
})

export const addMix = async (name: string, sounds: postSoundScape[]) => {
  const token = localStorage.getItem('token')
  try {
    console.log(sounds)
    const response = await api.post(`${BACKEND_URL}/soundscape`, {
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
    const response = await api.get(`${BACKEND_URL}/soundscape`, { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch (error) {
    console.log(error)
  }
}

export const getMixById = async (id: string) => {
  const token = localStorage.getItem('token')
  try {
    const response = await api.get(`${BACKEND_URL}/soundscape/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch (error) {
    console.log(error)
  }
}

export const editMix = async (id: string, name: string, sounds: postSoundScape[]) => {
  const token = localStorage.getItem('token')
  try {
    console.log(sounds)
    const response = await api.patch(`${BACKEND_URL}/soundscape/${id}`, {
      name, sounds
    }, { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch (error) {
    console.log(error)
  }
}

export const deleteMix = async (id: string) => {
  const token = localStorage.getItem('token')
  try {
    const response = await api.delete(`${BACKEND_URL}/soundscape/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch (error) {
    console.log(error)
  }
}