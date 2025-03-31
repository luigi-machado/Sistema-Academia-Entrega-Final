import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import ProfilePage from "../Components/ProfilePage";

export default function ShowExercicio({ viewUrl }) {
    const { id } = useParams()
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [exercicio, setExercicio] = useState({})
    const [materiaisElemen, setMateriaisElemen] = useState([])
    const [IsAdmin, setIsAdmin] = useState('');

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
        axios.get('http://localhost:5000/FormAtualizarExercicio/' + id, { withCredentials: true })
            .then(response => {
                if (response.data.exercicio.exercicio) {
                    const exercicioData = response.data.exercicio.exercicio;
                    setExercicio(exercicioData);
                    
                    // Carrega os aparelhos assim que o exercício for carregado
                    if (exercicioData.ids_aparelho && exercicioData.ids_aparelho.length > 0) {
                        const promises = exercicioData.ids_aparelho.map(materialId => 
                            axios.get('http://localhost:5000/FormAtualizarAparelho/' + materialId, { withCredentials: true })
                        );
                        
                        Promise.all(promises)
                            .then(responses => {
                                const aparelhos = responses.map(response => response.data.aparelho.aparelho);
                                setMateriaisElemen(aparelhos);
                            })
                            .catch(error => console.error("Erro ao carregar aparelhos:", error));
                    }
                }
            })
            .catch(error => console.error("Erro ao carregar exercício:", error));
    }, [id, navigate]);

    return (
        <>
            <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin} />
            <div className="home-page">
                <MenuBar isAdm={IsAdmin}/>
                <ProfilePage ProfileData={{
                    Exercicio: exercicio,
                    Aparelhos: materiaisElemen
                }} />
                <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
            </div>
        </>
    );
}