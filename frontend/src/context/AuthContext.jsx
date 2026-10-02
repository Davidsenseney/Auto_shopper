import { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // On load, check if the browser has tokens saved from a previous visit
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );

    const [user, setUser] = useState(() => authTokens ? { loggedIn: true } : null);

    const loginUser = async (username, password) => {
        const response = await fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser({ username: username });
            localStorage.setItem('authTokens', JSON.stringify(data));
            return { success: true };
        } else {
            return { success: false, message: data.detail || 'Login failed. Check your credentials.' };
        }
    };
    const registerUser = async (username, email, password) => {
        const response = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.status === 201) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: "Registration failed. Username or email might be taken." };
        }
    };
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };
    const contextData = {
        user,
        authTokens,
        loginUser,
        registerUser,
        logoutUser
    };
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthContext;
