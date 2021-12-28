import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
// cogemos la variable user del context y extrae la información. Al principio lo q hace es crearte el context, te crea el ámbito. User por defect es un objeto que tiene una propiedad llamada false.
export const PublicRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    return user.logged ? <Navigate to="/dashboard" /> : children
}
//si user es logged, te lleva a dashboard, sino te lleva a los hijos, en este caso login o register.