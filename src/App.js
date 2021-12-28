import { useEffect, useReducer } from 'react';
import { AppRouter } from './routers/AppRouter';
import { authReducer } from './auth/authReducer';
import { AuthContext } from './auth/authContext';

//mira si existe una variable user y sino crea una propiedad llamada logged false
const init = () => {
    return JSON.parse( sessionStorage.getItem('user') ) || { logged: false };
}
//usamos user como variable global para poder acceder desde varios ámbitos a la misma utilizando reducer. Es accesible en cualquier ámbito. Cada vez que user cambie, lo vuelve a guardar en sessionStorage.
export const App = () => {

    const [ user, dispatch ] = useReducer( authReducer, {}, init );

    useEffect(() => {
        if ( !user ) return;
        sessionStorage.setItem('user', JSON.stringify(user) );
    }, [ user ]);

    return (
        <AuthContext.Provider value={{
            user,
            dispatch
        }}>
            <AppRouter />
        </AuthContext.Provider>
    )

}
