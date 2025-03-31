import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TableComponent from "../Components/TableContent";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";



export default function Aluno({AddPath , urlView , urlEdit , deleteUrl}){
    const navigate = useNavigate();
    const headers = ["Nome", "Telefone", "CPF"];
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin,setIsAdmin] = useState('')


    const [alunos,setAlunos] = useState('')

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
        axios.get('http://localhost:5000/ListarAluno', { withCredentials: true })
            .then(response => {
                if (response.data.alunos) {
                    setAlunos(response.data.alunos);
                }
            })
            .catch(() => {
                // Tratar erro (se necessário)
            });
    }, []);  // Lista de dependências vazia, a requisição será feita apenas uma vez
    
    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <TableComponent dados={alunos.length >0 ? alunos : []} headers={headers} titulo={"Tabela de Alunos"} AddPath={AddPath} urlView={"/aluno/view"} keyUnique={"matricula"} urlEdit={"/aluno/edit"} deleteUrl={"http://localhost:5000/ExcluirAluno"}/>
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    );
}