import { createContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    // check if user loged in already!!
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            localStorage.setItem('userId', userData._id);
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
    const login = async ({ mobile, password }) => {
        try {
            const response = await axios.post('http://localhost:5005/api/auth/login', { mobile, password });
            if (response.data.user) {
                setUser(response.data.user);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('userId', response.data.user._id);
                return response.data;
            } else {
                return { error: "User data missing in response" };
            }
        } catch (error) {
            return { error: error.response?.data?.error || 'Login failed' };
        }
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthContext;


