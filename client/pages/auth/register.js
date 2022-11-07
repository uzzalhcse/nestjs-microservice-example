import React, { useState } from 'react'
import Header from '../../components/Header'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import Cookies from "js-cookie";
import { useRouter } from "next/router";

function Register() {
    const Router = useRouter();

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState([])


    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/auth/register", data)
            .then(res => {
                window.location.href = `/auth/login`;
            })
            .catch(err => {
                console.log(err);
                setErrors(err?.response?.data?.message)
            })
    }
    return (
        <>
            <Header />
            <Container>
                <Form onSubmit={(e) => handleSubmit(e)} className='mx-auto border p-4 mt-2' style={{ maxWidth: "500px" }}>
                    <h2 className='text-center'>
                        Register Form
                    </h2>
                    {
                        errors?.length > 0 &&
                        errors?.map((error, i) => (
                            <Alert variant='danger' key={i}>{error}</Alert>
                        ))
                    }

                    <Form.Group className="mb-3" controlId="formBasicName">

                        <Form.Label>Name</Form.Label>
                        <Form.Control value={data.name} onChange={e => setData(value => ({ ...value, name: e.target.value }))} type="name" placeholder="Enter name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">

                        <Form.Label>Email address</Form.Label>
                        <Form.Control value={data.email} onChange={e => setData(value => ({ ...value, email: e.target.value }))} type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control value={data.password} onChange={e => setData(value => ({ ...value, password: e.target.value }))} type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </>
    )
}

export default Register