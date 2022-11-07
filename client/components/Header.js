import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from "js-cookie";

import { useRouter } from 'next/router'
import { useContext } from 'react';
import AppContext from '../context/AppContext';

function Header() {
    const Router = useRouter()
    let [user] = useContext(AppContext)


    
  const handleLogout = () => {
    Cookies.remove("ecom_micro");
    window.location.pathname = "/";
  };


    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/"><strong>TS4U Ecom</strong></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                    </Nav>
                    {
                        user ?
                            <>
                               <strong>{ `Hi, ${user?.name}`}</strong>
                                <Button onClick={()=>Router.push('/orders')} className='mx-1' variant="outline-success">My Orders</Button>
                                <Button onClick={()=>handleLogout()} className='mx-1' variant="danger">Logout</Button>
                            </>

                            :
                            <>
                                <Button className='mx-2' onClick={() => Router.push("/auth/login")} variant="outline-success">Login</Button>
                                <Button onClick={() => Router.push("/auth/register")} variant="outline-success">Register</Button>
                            </>
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;