import { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../components/Header';
import axios from 'axios'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AppContext from '../context/AppContext';
import Modal from 'react-bootstrap/Modal';

import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
  const [user] = useContext(AppContext)
  const [products, setProducts] = useState([])

  const [show, setShow] = useState(false);

  //create product
  const [name, setName] = useState("")
  const [description, settDescription] = useState("")
  const [price, setPrice] = useState(10)
  const [stock, setStock] = useState(10)

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (!user) {
      return toast.error("Plesae login to add product")
    }
    setShow(true)
  }



  const fetchProduct = () => {
    axios.get('/product/all')
      .then(res => {
        setProducts(res.data.products)
      })
      .catch(err => {
        console.log(err);
      })
  }
  useEffect(() => {
    fetchProduct()

  }, [])


  const handleOrder = (productId) => {
    let quantity = window.prompt("Enter quantity", 1);
    let data = {
      productId,
      quantity: parseInt(quantity)
    }

    axios.post('/order/create', data)
      .then(res => {
        toast.success("Order created successfully")
        fetchProduct()
      }).catch(err => {
        if (Array.isArray(err?.response?.data?.message)) {
          err?.response?.data?.message?.map(error => {
            toast.error(error)
          })
        } else {
          toast.error(err?.response?.data?.message || "Something went wrong")
        }
      })

  }


  const handleAddProduct = () => {
    let data = {
      name,
      description,
      price:parseInt(price),
      stock:parseInt(stock)
    }
    axios.post("/product/create", data)
      .then(res => {
        toast.success("Product added successfully")
        fetchProduct()
        handleClose()
      }).catch(err => {
        if (Array.isArray(err?.response?.data?.message)) {
          err?.response?.data?.message?.map(error => {
            toast.error(error)
          })
        } else {
          toast.error(err?.response?.data?.message || "Something went wrong")
        }
      })
  }

  return (
    <>
      <ToastContainer />
      <Header />
      <Container>
        <Button className='my-2' variant="primary" onClick={handleShow}>
          Add Product
        </Button>




        <Row className='gx-5 gy-5 mt-5'>
          {
            products?.map((product, i) => (
              <Col key={i}>
                <Card style={{ width: '18rem' }}>
                  {/* <Card.Img variant="top" src="https://ts4u.us/placeholder.jpg" /> */}
                  <Card.Body>
                    <Card.Title>{product?.name}</Card.Title>
                    <Card.Text>
                      {product?.description}
                    </Card.Text>

                    <Card.Text>
                      <strong>Stock:</strong>
                      <span className='mx-2'>{product?.stock}</span>
                    </Card.Text>
                    <Button onClick={() => handleOrder(product?.id)} variant="primary">Order</Button>
                  </Card.Body>
                </Card>
              </Col>

            ))
          }
        </Row>



        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Enter name:</label>
            <input value={name} onChange={e => setName(e.target.value)} className='form-control' />

            <label>Enter description:</label>
            <textarea value={description} onChange={e => settDescription(e.target.value)} className='form-control' />

            <label>Product price:</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className='form-control' />

            <label>Product stock:</label>
            <input type="number" value={stock} onChange={e => setStock(e.target.value)} className='form-control' />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleAddProduct()}>
              Save Product
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </>

  )
}
