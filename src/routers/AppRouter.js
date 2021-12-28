import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../components/LoginPage/LoginPage';
import { DashboardRouter } from './DashboardRouter';
import { RegisterPage } from '../components/RegisterPage/RegisterPage';
import { PublicRoute } from './PublicRouter';
import { PrivateRoute } from './PrivateRouter';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={ 
                    <PublicRoute>
                        <LoginPage /> 
                    </PublicRoute>
                } 
                />

                <Route path="/registro" element={ 
                    <PublicRoute>
                        <RegisterPage /> 
                    </PublicRoute>
                } 
                />

                <Route path="/*" element={ 
                    <PrivateRoute>
                        <DashboardRouter />
                    </PrivateRoute>
                 } 
                 />
            </Routes>
        </BrowserRouter>
    )
}
