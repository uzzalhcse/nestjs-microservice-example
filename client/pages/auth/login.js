import React, { useState } from 'react'
import Header from '../../components/Header'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import Cookies from "js-cookie";
import { useRouter } from "next/router";

function login() {
    const Router = useRouter();

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState([])


    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/auth/login", data)
            .then(res => {
                Cookies.set("ecom_micro", `Bearer ${res.data.token}`);
                window.location.href = `/`;
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
                        Login Form
                    </h2>
                    {
                        errors?.length > 0 &&
                        errors?.map((error, i) => (
                            <Alert variant='danger' key={i}>{error}</Alert>
                        ))
                    }
                    <Form.Group className="mb-3" controlId="formBasicEmail">

                        <Form.Label>Email address</Form.Label>
                        <Form.Control value={data.email} onChange={e => setData(value => ({ ...value, email: e.target.value }))} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
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

export default login