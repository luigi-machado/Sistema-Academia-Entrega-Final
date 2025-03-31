import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FeedbackPopup from '../Components/FeedbackPopup';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const closeFeedback = () => {
    setFeedback({ message: '', type: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        'username': username,
        'password': password
      }, { withCredentials: true });
        if (response.status === 200) {
          navigate('/main');
          }
        } catch (error) {
          setFeedback({ message: 'Falha no login', type: 'error' });
            //alert('Falha no login');
        }
    };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
      <label>Usuário:</label>
        <div style={styles.formGroup}>
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
         <label>Senha:</label>
        <div style={styles.formGroup}>
         
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
      <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    margin: '10px 0',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '200px',
    borderRadius: '7px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
  },
};

export default Login;
