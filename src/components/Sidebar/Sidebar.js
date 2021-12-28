import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import './Sidebar.css';

export const Sidebar = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="sidebar">
            <h1>Menu</h1>
            <div className="separator"></div>
            { 
                user.menu.map((elem, key) => {
                    return <Link key={ key } to={elem.url}>{ elem.title }</Link>
                })
            }
        </div>
    )
}