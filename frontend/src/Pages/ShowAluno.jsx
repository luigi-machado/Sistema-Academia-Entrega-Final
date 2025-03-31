import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate ,useParams } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import ProfilePage from "../Components/ProfilePage";

function getAulasDoAluno(aulas, aluno) {
  return aulas.filter(aula => aluno.ids_aula.includes(aula.id_aula));
}

// Função para filtrar os treinos do aluno
function getTreinosDoAluno(treinos, aluno) {
  return treinos.filter(treino => aluno.ids_treino.includes(treino.id));
}

export default function ShowAluno({viewUrl}){
    const {id} = useParams()
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [treinos,setTreinos] = useState([]);
    const [aulas,setAulas] = useState([]);
    const [IsAdmin,setIsAdmin] = useState('')
    const [aluno,setAluno] = useState({
      ids_aula:[],
      ids_treino:[]
    })

    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
      };

      let newJson = {}

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
        axios.get('http://localhost:5000/ListarAula', { withCredentials: true })
            .then(response => {
                if (response.data.aulas) {
                    setAulas(response.data.aulas)
                } else {
       
                }
            })
            .catch()
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:5000/ListarTreinos', { withCredentials: true })
            .then(response => {
                if (response.data.dados) {
                    setTreinos(response.data.dados)
                } else {
                  
                }
            })
            .catch();
    }, [navigate]);

    
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
        axios.get('http://localhost:5000/FormAtualizarAluno/' + id , { withCredentials: true })
            .then(response => {
                if (response.data.aluno) {
                    setAluno(response.data.aluno);
                }
            })
            .catch(() => {
                // Tratar erro (se necessário)
            });
    }, []);  // Lista de dependências vazia, a requisição será feita apenas uma vez
    
    let lista_aulas =  aulas.filter(aula => aluno.ids_aula.includes(aula.id_aula));
    let lista_treinos = treinos.filter(treino => aluno.ids_treino.includes(treino.id));

    newJson = {
      Aluno: aluno.aluno,
      Endereço: aluno.endereco,
      Aulas:lista_aulas,
      Treinos:lista_treinos,
      Plano:aluno.plano
    }

    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <ProfilePage ProfileData={newJson}/>
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    );
}