import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import './DataTable.css';

export const DataTable = (props) => {

    const eventClick = (e) => {
        const rowId = e.target.parentNode.id;
        props.parentCallback(rowId);
    }

    return(
        <Row>
            <Col>
                <Table className="table" striped bordered hover>     
                    <thead>
                        <tr>
                        {
                            props.headers.map( (head, index) => {
                                return <th key = { index } >{head}</th>
                            })
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.rows.length ? props.rows.map( (row, index) => {
                                return <tr id={row.uid} onClick={eventClick} key = { index }>
                                    <td>{ index + 1 }</td>
                                    <td>{ row.name }</td>
                                    <td>{ row.surname ? row.surname : 'N/A' }</td>
                                    <td>{ row.email }</td>
                                </tr>
                            })
                            : 
                            <tr>
                                <td>LISTA VACÍA</td>
                            </tr>
                        }
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}