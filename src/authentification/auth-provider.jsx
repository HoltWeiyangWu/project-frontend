import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import { useRouter } from 'src/routes/hooks';


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('jwt');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = useCallback((token) => {
        Cookies.set('jwt', token, { expires: 1 }); // Expires in one day
        setIsAuthenticated(true);
        router.push('/');
    }, [router]);

    const logout = useCallback(() => {
        Cookies.remove('jwt');
        setIsAuthenticated(false);
        router.push('/login');
    }, [router]);

    const authValue = useMemo(() => ({
        isAuthenticated, login, logout
    }), [isAuthenticated, login, logout]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export const useAuth = () => useContext(AuthContext);