import React, { useContext } from 'react';
import { Container, Row, Image } from 'react-bootstrap';
import { AuthContext } from '../../auth/authContext';

export const DashboardPatient = () => {

    const { user } = useContext(AuthContext);

    return (
        <Container>
            <Row>
                <Image style= { { maxWidth: '7.5rem', margin: '1rem' } } src="assets/dashboard.png" />
                <h3 className="mb-4">Gestión del paciente</h3>
                <p>Bienvenido al sistema de gestión de pacientes {user.name}.</p>
                <p>A continuación podrás actualizar tu perfil, asignar un médico y/o generar tus consultas.</p>
            </Row>
        </Container>
    )
}
