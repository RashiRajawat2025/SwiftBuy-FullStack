import axios from 'axios';

export const API_URL = "http://localhost:5454";
export const DEPLOYED_URL = "https://swiftbuy-server-akvk.onrender.com"
// change api

export const api = axios.create({
  baseURL:DEPLOYED_URL , 
  headers: {
    'Content-Type': 'application/json',
  },
});