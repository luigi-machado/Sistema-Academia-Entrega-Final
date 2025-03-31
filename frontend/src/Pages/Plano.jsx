import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TableComponent from "../Components/TableContent";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";


export default function Planos({AddPath, urlView , urlEdit , deleteUrl}){
    const navigate = useNavigate();
    const titulo = "Tabela de Planos";
    const headers = ["Nome", "Valor" , "Descricao"];
    const [planos,setPlanos] = useState('')
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin,setIsAdmin] = useState('')
    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
      };
    
    //const planos =  [{ nome: "Plano A", valor: "220,00", descricao: "asdfasdfgadefgsd" }]
    
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
        axios.get('http://localhost:5000/ListarPlano', { withCredentials: true })
            .then(response => {
                if (response.data.planos) {
                    setPlanos(response.data.planos)
                    console.log(response.data.planos)
                } else {
                    setPlanos([])
                }
            })
            .catch(() => {
                setPlanos([])
            });
    }, []);  // Lista de dependências vazia, a requisição será feita apenas uma vez
    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <TableComponent titulo={titulo} dados={planos} headers={headers} AddPath={AddPath} urlEdit={"/planos/edit"}  keyUnique={"id"} deleteUrl={"http://localhost:5000/ExcluirPlano"} />
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    );
}