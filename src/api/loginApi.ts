import axios, { AxiosError } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const postLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/user/login`, {
      username, password
    });
    console.log(response, 'what happend')
    return { data: response.data, status: response.status };
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
};