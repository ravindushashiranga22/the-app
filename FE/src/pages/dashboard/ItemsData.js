import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './wall.jpg'; // Import your background image
import './ItemsData.css'; // Import your CSS file

const ItemsData = ({ items }) => {
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();
  let ws;

  useEffect(() => {
    ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const message = event.data;
      console.log('Received message from server:', message);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setStatusMessage('');
  };

  const handleOrder = async () => {
    const userId = window.localStorage.getItem('user');
    const userRole = window.localStorage.getItem('role');

    const orderedItem = {
      name: items.name,
      quantity: quantity,
      image: items.image,
      userId: userId,
      userRole: userRole,
    };

    try {
      const response = await fetch('http://localhost:5000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderedItem),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setStatusMessage(`You have ordered ${quantity} ${items.name}(s).`);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('There was a problem with the operation:', error);
    }
  };

  return (
    <div
      style={{
        // backgroundImage: `url(${backgroundImage})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      <div className="glass-effect"> {/* Apply glass effect */}
        <div onClick={handleShow}>
          <h1 className="text-center">{items.name}</h1>
          <div className="d-flex justify-content-center">
            <img
              src={items.image}
              className="img-fluid"
              style={{ height: '150px', width: '150px', maxWidth: '100%' }}
              alt={items.name}
            />
          </div>
        </div>

        <div className="flex-container">
          <div className="m-1 w-100">
            <p>Quantity</p>
            <select
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              {[...Array(items.qtyMax).keys()].map(i => {
                const qty = i + 1;
                return (
                  <option key={qty} value={qty}>
                    {qty}
                  </option>
                );
              })}
            </select>
            <div className="m-1 w-100 text-center">
              <button className="btn btn-success" onClick={handleOrder}>Order Now</button>
            </div>
            {statusMessage && <p className="status-message">{statusMessage}</p>} {/* Use the status-message class */}
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{items.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center">
              <img src={items.image} className="img-fluid" style={{ height: '250px', maxWidth: '100%' }} alt={items.name} />
            </div>
            <p className="text-center">You have selected {quantity} {items.name}(s).</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn" onClick={handleClose}>CLOSE</button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

ItemsData.propTypes = {
  items: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    qtyMax: PropTypes.number,
  }).isRequired,
};

export default ItemsData;
