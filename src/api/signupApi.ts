"use client"

import axios, { AxiosError } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL : BACKEND_URL, withCredentials:true
})

export const postSignup = async (username :string, password:string) => {
  try {
    console.log( username, password)
    const response = await api.post(`${BACKEND_URL}/user/signup`,{
      username, password
    })
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ Message: string }>;
      return {
        error: true,
        status: axiosError.response?.status,
        message: axiosError.response?.data?.Message || 'An unexpected error occurred'
      };
    }
    throw error;
  }
}