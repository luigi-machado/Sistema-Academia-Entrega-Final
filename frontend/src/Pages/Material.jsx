import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TableComponent from "../Components/TableContent";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";


export default function Material({AddPath, urlView , urlEdit, deleteUrl}){
    const navigate = useNavigate();
    const titulo = "Tabela de Materiais";
    const headers = ["Nome", "numero_serie", "Disponibilidade"];
    const [Aparelhos,setAparelhos] = useState('')
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [IsAdmin, setIsAdmin] = useState('');
    const [username, setUsername] = useState('');
    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
      };

      const dados = [
        { nome: "Halteres 5kg", serial: 10, disponibilidade: "Disponível" },
        { nome: "Bicicleta Ergométrica", quantidade: 4, disponibilidade: "Indisponível" },
        { nome: "Corda de Pular", quantidade: 15, disponibilidade: "Disponível" },
        { nome: "Kettlebell 8kg", quantidade: 6, disponibilidade: "Disponível" },
        { nome: "Colchonete", quantidade: 12, disponibilidade: "Disponível" }
      ];
    
    
    
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
        axios.get('http://localhost:5000/ListarAparelhos', { withCredentials: true })
            .then(response => {
                if (response.data.Aparelhos) {
                    setAparelhos(response.data.Aparelhos);
                } else {

                }
            })
            .catch();
    }, [navigate]);
    
    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <TableComponent dados={Aparelhos} headers={headers} titulo={"Tabela de Materiais"} AddPath={AddPath} keyUnique={"id_aparelho"} urlEdit={"/material/edit"} deleteUrl={"http://localhost:5000/ExcluirAparelho"}/>
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    );
}