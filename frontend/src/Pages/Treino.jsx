import { use, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TableComponent from "../Components/TableContent";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";


export default function Treinos({AddPath, urlView , urlEdit , deleteUrl}){
    const navigate = useNavigate();
    const titulo = "Tabela de Treinos";
    const headers = ["Objetivo", "Dificuldade"];
    const [treino, setTreinos] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin,setIsAdmin] = useState('')
    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
      };
      
    
    
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

    
    useEffect(() => {
        axios.get('http://localhost:5000/ListarTreinos', { withCredentials: true })
            .then(response => {
                if (response.data.dados) {
                    setTreinos(response.data.dados)

                } else {

                }
            })
            .catch(() => {

            });
    }, []); 
    
    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <TableComponent titulo={titulo} dados={treino} headers={headers} AddPath={AddPath} urlEdit={"/treino/edit"} urlView={"/treino/view"} keyUnique={"id"} deleteUrl={"http://localhost:5000/ExcluirTreino"} />
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    );
}