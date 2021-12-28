import React from 'react';
import { Link } from 'react-router-dom';
import { getPatientsFetch } from '../../services/GlobalServices';
import { useEffect } from 'react';
import { ScreenSpinner } from '../ScreenSpinner/ScreenSpinner';
import { Container, ListGroup } from 'react-bootstrap';

export const Patient = () => {

    const [ showSpinner, setShowSpinner ] = React.useState(false);
    const [ dataPatient, setDataPatient ] = React.useState({});
    let idParam;

    useEffect(() => {
        idParam = window.location.pathname.split('/')[2];
        getMedics();
    }, []);

    const getMedics = () => {
        setShowSpinner(true);
        getPatientsFetch(0, 0).then(resp => {
            if (resp.ok) {
                const patients = resp.patients;
                setDataPatient(patients.find((patient => patient.uid === idParam)));
                setShowSpinner(false);
            } else {
                setShowSpinner(false);
            }
        });
    }

    return (
        <>
            <Link to={ '/pacientes' }> {`<-- Volver`}</Link>
            
            <Container fluid className="col-md-6 mt-5">
                <h3 className="mb-4">Ficha de paciente</h3>
                <ListGroup>
                    <ListGroup.Item>Nombre: { dataPatient.name }</ListGroup.Item>
                    <ListGroup.Item>Apellidos: { dataPatient.surname ? dataPatient.surname : 'N/A'}</ListGroup.Item>
                    <ListGroup.Item>Email: { dataPatient.email }</ListGroup.Item>
                    <ListGroup.Item>Género: { dataPatient.gender ? dataPatient.gender : 'N/A'}</ListGroup.Item>
                    <ListGroup.Item>Dirección: { dataPatient.address ? dataPatient.address : 'N/A' }</ListGroup.Item>
                    <ListGroup.Item>Provincia: { dataPatient.province ? dataPatient.province: 'N/A' }</ListGroup.Item>
                </ListGroup>
            </Container>

            <ScreenSpinner show = {showSpinner}></ScreenSpinner>
        </>
    )
}