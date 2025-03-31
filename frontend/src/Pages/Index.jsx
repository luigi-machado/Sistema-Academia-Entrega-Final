import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css'
import imgAlter from '../Assets/alter.svg'
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";

export default function Index(){
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [IsAdmin,setIsAdmin] = useState('')
    
    useEffect(() => {
        axios.get('http://localhost:5000/session', { withCredentials: true })
            .then(response => {
                if (response.data.permission === 'OK') {
                    setUsername(response.data.user);
                    setIsAdmin(response.data.isAdm);
                } else {
                    navigate('/');
                }
            })
            .catch(() => navigate('/'));
    }, [navigate]);

    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <div class="svg-container">
                <img src={imgAlter}  class="svg-icon" />
            </div>
        </div>
        </>
    );
}