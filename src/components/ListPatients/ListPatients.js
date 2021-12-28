import React, { useContext } from 'react';
import { useEffect } from 'react';
import { DataTable } from '../DataTable/DataTable';
import { ScreenSpinner } from '../ScreenSpinner/ScreenSpinner';
import { Container, Row } from 'react-bootstrap';
import { getPatientsFetch } from '../../services/GlobalServices';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';

export const ListPatients = () => {

    const navigate = useNavigate();
    const [ showSpinner, setShowSpinner ] = React.useState(false);
    const dataTableHeaders = ['#', 'Nombre', 'Apellidos', 'Email'];
    const [ dataTableRows, setDataTableRows ] = React.useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getPatients();
    }, []);

    const getPatients = () => {
        setShowSpinner(true);
        getPatientsFetch(0, 0).then(resp => {
            if (resp.ok) {
                const listPatientsAssigned = resp.patients.filter((patient) => patient.medicAssigned === user.uid);
                setDataTableRows(listPatientsAssigned);
                setShowSpinner(false);
            } else {
                setShowSpinner(false);
            }
        });
    }

    const getRowId = (id) =>{
        navigate(`/pacientes/${id}`);
    }

    return(
        <>
        <Container>
            <h3>Lista de pacientes</h3>
                <Row>
                    <DataTable headers = { dataTableHeaders } rows = { dataTableRows } parentCallback = { getRowId } ></DataTable>
                </Row>
        </Container>

        <ScreenSpinner show = {showSpinner}></ScreenSpinner>
        </>
    )
}