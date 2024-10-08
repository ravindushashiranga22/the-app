import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Orders.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ isCompleted }) => ({
  backgroundColor: isCompleted ? 'transparent' : '#ffcccc',
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState('');
  const userRole = window.localStorage.getItem('role');
  const userId = window.localStorage.getItem('userId');
  const playButtonRef = useRef(null);
  const pageRef = useRef(null);

  const audioPath='https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3';

  const [ws, setWs] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/order', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const orders = await response.json();
      const filteredOrders = userRole === 'Shop' ? orders.filter(order => order.orderedBy !== userId) : orders;

      // Sort orders: move completed orders to the bottom
      const sortedOrders = filteredOrders.sort((a, b) => {
        if (a.isCompleted === b.isCompleted) return 0; // Both are either completed or not
        return a.isCompleted ? 1 : -1; // Completed orders (a) go to the bottom
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {

    // playAlertSound();

    const socket = new WebSocket('ws://localhost:5000');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        switch (message?.type) {
          case 'order-update':
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order._id === message.order._id ? { ...order, ...message.order } : order
              )
            );
            break;
          case 'order-cancel':
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order._id === message.orderId ? { ...order, isAccepted: false } : order
              )
            );
            break;
          case 'order-accept':
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order._id === message.orderId ? { ...order, isAccepted: true } : order
              )
            );
            break;
          case 'new-order':
            setOrders((prevOrders) => [...prevOrders, message.order]);
            break;
          case 'new-order-reload':
            clikcPlayBtn();
            fetchOrders();
            break;
          default:
            console.error('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message as JSON:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [refresh, userRole, userId]);

  const handleOrderAction = async (orderId, action) => {
    try {
      let method;
      let body = {};

      if (action === 'cancel') {
        method = 'DELETE';
      } else if (action === 'done') {
        method = 'PUT';
        body = { isCompleted: true };
      } else if (action === 'accept') {
        method = 'PUT';
        body = { isAccepted: true };
      }

      const response = await fetch(`http://localhost:5000/order/${orderId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      if (action === 'cancel') {
        setCancelSuccessMessage('Order canceled successfully!');
      }

      setRefresh(!refresh);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

   // Function to play sound like an alert
   function playAlertSound() {
    
    const audio = new Audio(audioPath); // Path to your MP3 file
    audio.play(); // Play the sound



}

function clikcPlayBtn(){
  if (playButtonRef.current) {
    playButtonRef.current.click(); // Programmatically click the button
  }
}

const handleClick = () => {

  // console.log('handle--------------------------------')
  
  // if (playButtonRef.current) {
  //   console.log('handle--------------------------------pageRef.current---')
  //   // Programmatically triggers the click event
  //   playButtonRef.current.click(); 
  // }
};


useEffect(() => {
  handleClick(); // Call handleClick on component mount
}, []);



  return (
    <div ref={pageRef}>
      <h1 className="orders-title">Orders</h1>


      {/* <audio controls>
  <source src="path/to/audiofile.mp3" type="audio/mpeg">
  <source src="path/to/audiofile.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio> */}

<audio controls  className='d-none'>
        <source src="https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3" type="audio/mpeg" />
        {/* <source src="https://www.w3schools.com/html/horse.mp3" type="audio/ogg" /> */}
        Your browser does not support the audio element.
      </audio>

      
      <button
        ref={playButtonRef} 
                          className="cancel-btn d-none"
                          onClick={() => playAlertSound()}
                        >
                          play 
                        </button>

      {cancelSuccessMessage && <div className="alert alert-success">{cancelSuccessMessage}</div>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order Name</StyledTableCell>
              <StyledTableCell align="right">Quantity</StyledTableCell>
              <StyledTableCell align="right">Ordered On</StyledTableCell>
              {userRole !== 'Shop' && <StyledTableCell align="right">Actions</StyledTableCell>}
              {userRole === 'Shop' && (
                <>
                  <StyledTableCell align="right">Ordered By</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <StyledTableRow key={order._id} isCompleted={order.isCompleted}>
                  <StyledTableCell component="th" scope="row">
                    {order.name || 'Unknown Order'}
                  </StyledTableCell>
                  <StyledTableCell align="right">{order.quantity}</StyledTableCell>
                  <StyledTableCell align="right">
                    {new Date(order.createdAt).toLocaleString()}
                  </StyledTableCell>
                  {userRole !== 'Shop' ? (
                    <StyledTableCell align="right">
                      {!order.isCompleted && !order.isAccepted && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleOrderAction(order._id, 'cancel')}
                        >
                          Cancel
                        </button>
                      )}
                      {order.isAccepted && !order.isCompleted && (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>Order Accepted</span>
                      )}
                      {order.isCompleted && (
                        <span style={{ color: 'blue', fontWeight: 'bold' }}>Order Completed</span>
                      )}
                    </StyledTableCell>
                  ) : (
                    <>
                      <StyledTableCell align="right">
                       {order?.userId?.firstName} {order?.userId?.lastName} - {order?.userRole || 'Unknown'}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.isAccepted ? (
                          <button
                            disabled={order.isCompleted}
                            onClick={() => handleOrderAction(order._id, 'done')}
                            className="done-button"
                          >
                            {order.isCompleted ? 'Completed' : 'Done'}
                          </button>
                        ) : (
                          <button
                            className="accept-btn"
                            onClick={() => handleOrderAction(order._id, 'accept')}
                          >
                            Accept
                          </button>
                        )}
                      </StyledTableCell>
                    </>
                  )}
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">
                  No orders yet.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Orders;
