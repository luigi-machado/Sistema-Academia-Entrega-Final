import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate , useParams} from "react-router-dom";
import '../Assets/HomePage.css';
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import "../Assets/Forms.css";
import addIcon from '../Assets/add-64px.png';
import removeIcon from '../Assets/lixo.png';

export default function EditarTreino({ submitUrl }) {
    const {id} = useParams()
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [formData, setFormData] = useState({
        objetivo: '',
        dificuldade: '',
        ids_exercicio: [], // Alterado para array
    });
    const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
    const [exercicioSelecionado, setExercicioSelecionado] = useState('');


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
        axios.get('http://localhost:5000/FormAtualizarTreino/'+id, { withCredentials: true })
            .then(response => {
                if (response.data.treino.treino) {
                    setFormData({
                        objetivo:response.data.treino.treino.objetivo,
                        dificuldade:response.data.treino.treino.dificuldade,
                        ids_exercicio:response.data.treino.treino.ids_exercicio
                    })
                } else {
      
                }
            })
            .catch();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/ListarExercicio', { withCredentials: true })
            .then(response => {
                if (response.data.dados) {
                    setExerciciosDisponiveis(response.data.dados)
                }
            })
            .catch();
    }, []);
    /*
    useEffect(() => {
        let ExerciciosFiltradas = [];
        for (let x = 0; x < treinosDisp.length; x++) {
            for (let y = 0; y < formData.ids_treino.length; y++) {
                if (treinosDisp[x].id === formData.ids_treino[y]) {
                    treinosFiltradas.push({ objetivo: treinosDisp[x].objetivo, id: formData.ids_treino[y] });
                }
            }
        }
       
        setTreinos(treinosFiltradas);
    }, [treinosDisp, formData.ids_treino,formData]);*/

    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleExercicioChange = (e) => {
        setExercicioSelecionado(e.target.value);
    };

    const adicionarExercicio = () => {
        if (exercicioSelecionado && !formData.ids_exercicio.includes(Number(exercicioSelecionado))) {
            setFormData(prevData => ({
                ...prevData,
                ids_exercicio: [...prevData.ids_exercicio, Number(exercicioSelecionado)]
            }));
            setExercicioSelecionado(''); // Limpa a seleção após adicionar
        }
    };
    
    const removerExercicio = (exercicioId) => {
        setFormData(prevData => ({
            ...prevData,
            ids_exercicio: prevData.ids_exercicio.filter(id => id !== exercicioId)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        console.log(submitUrl)
        axios.put(submitUrl + id, formData)
            .then((response) => {
                setFeedback({ message: 'Treino cadastrado com sucesso!', type: 'success' });
            })
            .catch((error) => {
                setFeedback({ message: 'Erro ao cadastrar treino!', type: 'error' });
            });
    };

    return (
        <>
            <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
            <div className="home-page">
                <MenuBar isAdm={IsAdmin}/>

                <form className="generic-form" onSubmit={handleSubmit}>
                    {/* Objetivo */}
                    <div className="form-group">
                        <label htmlFor="objetivo">Objetivo</label>
                        <input
                            type="text"
                            id="objetivo"
                            name="objetivo"
                            value={formData.objetivo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Dificuldade */}
                    <div className="form-group">
                        <label htmlFor="dificuldade">Dificuldade</label>
                        <input
                            type="text"
                            id="dificuldade"
                            name="dificuldade"
                            value={formData.dificuldade}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Seleção de Exercícios */}
                    <div className="aula-selection">
                        <label htmlFor="exercicio">Selecione um Exercício</label>
                        <select
                            id="exercicio"
                            name="exercicio"
                            value={exercicioSelecionado}
                            onChange={handleExercicioChange}
                        >
                            <option value="">Selecione...</option>
                            {exerciciosDisponiveis.map((exercicio) => (
                                <option key={exercicio.id} value={exercicio.id}>
                                    {exercicio.nome}
                                </option>
                            ))}
                        </select>
                        <button 
                            type="button" 
                            onClick={adicionarExercicio} 
                            className="icon-button add-btn"
                        >
                            <img src={addIcon} alt="Adicionar Exercício" className="icon" />
                        </button>
                    </div>

                    {/* Lista de Exercícios Selecionados */}
                    <div>
                        <h3>Exercícios Selecionados:</h3>
                        <ul>
                            {formData.ids_exercicio.map((exercicioId, index) => {
                                const exercicio = exerciciosDisponiveis.find(e => e.id == exercicioId);
                                return (
                                    <li key={index} className="selected-aula">
                                        <div className="aula">
                                            <span>{exercicio ? exercicio.nome : exercicioId}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => removerExercicio(exercicioId)} 
                                                className="icon-button remove-btn"
                                            >
                                                <img src={removeIcon} alt="Remover Exercício" className="icon" />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <button type="submit">Editar</button>
                </form>

                <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
            </div>
        </>
    );
}