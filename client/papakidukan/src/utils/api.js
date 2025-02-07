// makes api call to backend 
import axios from 'axios';

const API = axios.create({baseURL: "http://localhost:5005/api"});

//register user
export const registerUser = (userData) => API.post("auth/register", userData);

// login user with Mobile & Password
export const loginUser = (credential) => API.post("auth/login", credential);

export default API;