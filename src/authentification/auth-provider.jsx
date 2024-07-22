import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import React, { useMemo, useState, useContext, useCallback, createContext } from 'react';

import { useRouter } from 'src/routes/hooks';


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get('token'));
    const router = useRouter();

    const login = useCallback((token) => {
        setIsAuthenticated(true);
        router.push('/');
    }, [router]);

    const logout = useCallback(() => {
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