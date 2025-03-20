// makes api call to backend 
import axios from 'axios';

// const API = axios.create({baseURL: "http://localhost:5005/api"});
const API = axios.create({ baseURL: "https://bite2go-website-back1.onrender.com/api"}); 

//register user
export const registerUser = (userData) => API.post("auth/register", userData);

// login user with Mobile & Password
export const loginUser = (credential) => API.post("auth/login", credential);

export default API;


// import axios from 'axios';

// const API = axios.create({ baseURL: "https://bite2go-website-back1.onrender.com/api" });

// // Register user
// export const registerUser = (userData) => API.post("/auth/register", userData);

// // Login user with Mobile & Password
// export const loginUser = (credential) => API.post("/auth/login", credential);

// export default API;
