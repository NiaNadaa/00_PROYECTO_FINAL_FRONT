import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardMedic } from '../components/DashboardMedic/DashboardMedic';
import { DashboardPatient } from '../components/DashboardPatient/DashboardPatient';
import { Profile } from '../components/Profile/Profile';
import { Navbar } from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ListPatients } from '../components/ListPatients/ListPatients';
import { Patient } from '../components/Patient/Patient';
import { AssignMedic } from '../components/AssignMedic/AssignMedic';
import { PatientAppointment } from '../components/PatientAppointment/PatientAppointment';
import { ConsultListAppointment } from '../components/ConsultListAppointment/ConsultListAppointment';
import { Container } from 'react-bootstrap';
import { AuthContext } from '../auth/authContext';

//esto no es un componente que se pinta, es un subfichero de rutas, porque en el perfil logado hay diferentes rutas. está en otro archivo por ser ordenado. entramos en dashboard y ya se pinta toda la esrcutura de datos.
export const DashboardRouter = () => {

    const { user } = useContext(AuthContext);

    return (
        <Container fluid style={ { height: '100%', backgroundColor: '#e9e8e4', display: 'flex', padding: '0', minHeight: '100vh' } }>
            <Sidebar />
            <div className="wrapper" style={ { padding: '10px', width: '100%' } }>
                <Navbar />
                <h3 className="mb-5">Sesión iniciada: {user.name}</h3>
                {
                    user.role === 'ADMIN' ? 
                    <Routes>
                        <Route exact path="/dashboard" element={ <DashboardMedic /> } />
                        <Route exact path="/perfil" element={ <Profile /> } />
                        <Route exact path="/pacientes" element={ <ListPatients /> } />
                        <Route exact path="/pacientes/:id" element={ <Patient /> } />
                        <Route exact path="/consultar-citas" element={ <ConsultListAppointment /> } />
                        <Route exact path="/*" element={ <DashboardMedic /> } />
                    </Routes>
                    :
                    <Routes>
                        <Route exact path="/dashboard" element={ <DashboardPatient /> } />
                        <Route exact path="/asignar-medico" element={ <AssignMedic /> } />
                        <Route exact path="/perfil" element={ <Profile /> } />
                        <Route exact path="/solicitar-cita" element={ <PatientAppointment /> } />
                        <Route exact path="/*" element={ <DashboardPatient /> } />
                    </Routes>
                }
            </div>
        </Container>
    )
}
