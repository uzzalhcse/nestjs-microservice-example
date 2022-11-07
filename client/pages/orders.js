import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import Table from 'react-bootstrap/Table';
import moment from 'moment'

function orders() {
    const [orders, setOrders] = useState([])

    const fetchOrders = () => {
        axios.get('/order/my-orders')
            .then(res => {
                setOrders(res.data.orders)
            })
            .catch(err => {
                if (Array.isArray(err?.response?.data?.message)) {
                    err?.response?.data?.message?.map(error => {
                      toast.error(error)
                    })
                  }else{
                    toast.error(err?.response?.data?.message||"Something went wrong")
                  }
            })
    }
    useEffect(() => {
        fetchOrders()

    }, [])
    return (
        <>
            <ToastContainer />
            <Header />
            <Container>
                <Table className='mt-3' striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Product Name</th>
                            <th>Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders?.map((order, i) => (
                                <tr key={i}>
                                    <td>{order?.id}</td>
                                    <td>{order?.price}</td>
                                    <td>{order?.quantity}</td>
                                    <td>{order?.product?.name||"N/A"}</td>
                                    <td>{moment(order?.createdAt).format("MM/DD/YYYY")}</td>

                                </tr>
                            ))
                        }

                        
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default orders