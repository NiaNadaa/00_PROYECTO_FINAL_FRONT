import React from 'react';
import { Spinner  } from 'react-bootstrap';
import { useEffect } from 'react';
import './ScreenSpinner.css';


//props.show, valdrá true o false. 
//el spinner ejecuta primero useEffect. si esta false (q es por defecto): class="disable-scroll", pasa al else. en el disable scroll en css, hay overflow:hidden, quita el scroll a la página cuando está "cargando"
//esto es una clase dinámica, es un tema de usabilidad, de estética el spinner es un componente de react bootsatrp.
export const ScreenSpinner = (props) => {

    useEffect(() => {
        if (props.show) {
            document.body.classList.add('disable-scrolling');
        } else {
            document.body.classList.remove('disable-scrolling');
        }
     }, [ props.show ]);

    return (
        props.show ? <div className="wrapper-spinner">
            <div className="container-spinner">
                <Spinner variant="primary" 
                        className="spinner" 
                        animation="border" 
                        role="status">
                </Spinner>
                <span className="text mt-2">Cargando...</span>
            </div>
        </div>
        : ''
    )
}