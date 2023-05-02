import axios from 'axios';

export const API_URL = `${
  process.env.NEXT_PUBLIC_BC_ENV !== 'production' ? 'http://' : 'https://'
}${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

export const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});
