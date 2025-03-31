import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TableComponent from "../Components/TableContent";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";


export default function Visitante({AddPath , urlView , urlEdit, deleteUrl}){
    const navigate = useNavigate();
    const titulo = "Tabela de Visitantes";
    const headers = ["Nome", "qunt_visitas", "Data_visita", "Telefone"];
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [visitantes, setVisitantes] = useState('');
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
        axios.get('http://localhost:5000/ListarVisitantes', { withCredentials: true })
            .then(response => {
                if (response.data.visitantes) {
                    setVisitantes(response.data.visitantes)
   
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
            <TableComponent dados={visitantes} headers={headers} titulo={"Tabela de Visitantes"} AddPath={AddPath} keyUnique={"id_visitante"} urlEdit={"/visitante/edit"} deleteUrl={"http://localhost:5000/ExcluirVisitante"}/>
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    );
}