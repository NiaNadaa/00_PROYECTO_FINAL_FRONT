import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import { Breadcrumb } from 'react-bootstrap';
import { HouseDoor, PersonCircle, XOctagonFill } from 'react-bootstrap-icons';
import './Navbar.css';


//el location coge lo q hay en la url, para el breadcrumb, es el pathname que se actualiza en base a a url y se pinta.
export const Navbar = () => {

    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const [ pathName, setPathName] = React.useState('Dashboard');
    const location = useLocation();

    useEffect(() => {
        const pathName = window.location.pathname;
        setPathName(pathName);
    }, [location]);
//te hace un dispatch para hacer un logout, actualiza el user context en logged:false, también lo cambia en el sessionStorage.clear()borra todo.
    const handleLogout = () => {
        dispatch({ type: types.logout });
        sessionStorage.clear();
        navigate('/login', {
            replace: true
        });
    }

    return (
        <nav className="navbar navbar-expand" style = {{ width: '100%', maxHeight: '4rem',  }}>
            <div className="w-100 d-flex justify-content-end">
                <div className="breadcrumbs">
                <Breadcrumb>
                    <HouseDoor />
                    <Breadcrumb.Item> { pathName }</Breadcrumb.Item>
                </Breadcrumb>
                </div>
                <ul className="navbar-nav ml-auto">
                    <span className="nav-item nav-link text-info">
                        <div className="user">
                        <Link to={'perfil'}><PersonCircle />{user.email}</Link>
                        </div>
                    </span>
                    <button className="nav-item nav-link btn" onClick = { handleLogout }>
                        <div className="logout">
                            <XOctagonFill /> Salir
                        </div>
                    </button>
                </ul>
            </div>
        </nav>
    )
}