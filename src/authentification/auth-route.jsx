import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";

import {useAuth} from './index'

const AuthRoute = ({children}) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children;
}

AuthRoute.propTypes = {
    children: PropTypes.node,
}

export default AuthRoute;