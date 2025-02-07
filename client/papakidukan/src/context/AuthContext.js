import { createContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    // check if user loged in already!!
    useEffect(() => {
        const token = localStorage.getItem("user");
        if (token) {
            // axios.get('http://localhost:5000/api/auth/verify', {
            //             headers: { Authorization: `Bearer ${storedUser}` }
            //         })
            //         .then(response => {
            //             setUser(response.data.user);
            //         })
            //         .catch(() => {
            //             logout();  // If token is invalid, log the user out
            //         });
            //     }
            // }, []);
            setUser(token);
        }
    }, []);


    //register
    const register = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5005/api/auth/register', formData);
            return response.data;
        } catch (error) {
            console.error('Registration Error:', error.response || error.message);
            return { error: error.response?.data?.error || 'Registration failed' };
        }
    };


    // Login function
    const login = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5005/api/auth/login', formData);
            setUser(response.data.token);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return { error: error.response?.data?.error || 'Login failed' };
        }
    };
    // const login = (userData) => {
    //     setUser(userData);
    //     localStorage.setItem("user", JSON.stringify(userData));
    // };


    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthContext;


