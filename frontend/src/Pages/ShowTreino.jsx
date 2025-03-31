import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate ,useParams } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import ProfilePage from "../Components/ProfilePage";



export default function ShowTreino({viewUrl}){
    const {id} = useParams()
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
    const [IsAdmin,setIsAdmin] = useState('');
    const [treino, setTreino] = useState({
      ids_exercicio: []
    });

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
      axios.get('http://localhost:5000/ListarExercicio', { withCredentials: true })
          .then(response => {
              if (response.data.dados) {
                  setExerciciosDisponiveis(response.data.dados)
                  console.log(response.data.dados)
              } else {
                
              }
          })
          .catch();
  }, [navigate]);

    

    useEffect(() => {
        axios.get('http://localhost:5000/FormAtualizarTreino/' + id, { withCredentials: true })
            .then(response => {
                if (response.data.treino.treino) {
                    setTreino(response.data.treino.treino);
                    console.log(treino)
                }
            })
            .catch(() => {
                // Tratar erro (se necessário)
            });
    }, []);  // Lista de dependências vazia, a requisição será feita apenas uma vez
    
    let lista_execicios = exerciciosDisponiveis.filter(exercicio => treino.ids_exercicio.includes(exercicio.id));
    
    let lista_nova = [];

    lista_execicios.forEach((element) =>
    {
      lista_nova.push( {
        Nome: element.nome,
        Musculo: element.musculo,
        Series: element.series,
        Repeticoes: element.repeticoes
      })
    })

    let TreinoData = {
      Treino: {
        dificuldade: treino.dificuldade,
        id_treino: treino.id_treino,
        ids_exercicio: treino.ids_exercicio,
        objetivo: treino.objetivo
      },
      Exercicios: lista_nova
    }
    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <ProfilePage ProfileData={TreinoData}/>
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    );
}