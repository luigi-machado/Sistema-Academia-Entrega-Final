import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Assets/TopBar.css";
import Exit from "../Assets/sair.png";

export default function TopBar({ Titulo , Username ,IsAdmin}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (error) {
      alert('Falha no logoff');
    }
  };

  return (
    <div className="top-bar">
      <h3>Menu</h3>
      <div className="title">{Titulo}</div>
      <div className="user-info">
        <h3>{Username} - {IsAdmin ? "Administrador" : "Instrutor"}</h3>
        <img src={Exit} alt="Logoff" onClick={handleLogout} />
      </div>
    </div>
  );
}