import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Image, Container, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message.js';
import Loader from '../components/Loader.js';
import FormContainer from '../components/FormContainer.js';
import { createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

const ProductCreateScreen = ({ history }) => {

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch();

  const productCreate = useSelector(state => state.productCreate)
  const {
    loading,
    error,
    success
  } = productCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET })

      setName('');
      setPrice(0);
      setImage('');
      setBrand('');
      setCategory('');
      setCountInStock(0);
      setDescription('');

      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000)

    }
  }, [dispatch, history, success])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }

      const { data } = await axios.post('/api/uploads', formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProduct({
      name,
      price,
      image,
      brand,
      category,
      description,
      countInStock
    }))

    window.scrollTo(0, 0)

  }

  return (
    <>
      <Link to="/admin/productList" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {showMessage && <Message variant="success">{"Product added!"}</Message>}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="image" >
            <Form.Label>Image</Form.Label>
            <Container fluid >
              <Row>
                <Col xs={!image ? "12" : "10"} md={!image ? "12" : "10"} className="p-0" >
                  <Form.Control
                    type="text"
                    placeholder="Enter Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  >
                  </Form.Control>
                  <Form.File
                    id="image-file"
                    label="Choose File"
                    custom
                    onChange={uploadFileHandler}>
                  </Form.File>
                </Col>
                <Col xs={!image && !uploading ? "0" : "2"} md={!image && !uploading ? "0" : "2"} className='px-1'>
                  {uploading && <Loader />}
                  {image &&
                    <Image
                      width={85}
                      height={90}
                      src={image}
                      alt={name}
                      className="px-0"
                    />}
                </Col>
              </Row>
            </Container>
          </Form.Group>

          <Form.Group controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter count in stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Add Product
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default ProductCreateScreen;
