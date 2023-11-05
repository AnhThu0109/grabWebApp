import React from 'react';
import { Navigate } from 'react-router-dom';

const isLogin = () => {
    if(localStorage.getItem("token")){
        return true;
    }
    else return false;
}

{/* if login successful ==> link to chosen component || link to login page */}
const UserRoutes = ({Component}) => {
    const result = isLogin();
    return result == false? <Navigate to="/login"/> : <Component />;
};

export {isLogin, UserRoutes};