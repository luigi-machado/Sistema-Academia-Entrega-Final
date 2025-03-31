import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css';
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import "../Assets/Forms.css";
import addIcon from '../Assets/add-64px.png';
import removeIcon from '../Assets/lixo.png';

function convertToNumber(strList) {
    return strList.map(str => parseInt(str, 10));
  }

export default function CadastroTreino({ submitUrl }) {
    const navigate = useNavigate();
    const [IsAdmin, setIsAdmin] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [formData, setFormData] = useState({
        objetivo: '',
        dificuldade: '',
        exercicios: [], // Alterado para array
        aluno_id: '',
        ids_exercicio: ''
        //id: ''
    });
    const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
    const [exercicioSelecionado, setExercicioSelecionado] = useState('');
    const [alunos, setAlunos] = useState([{id:'1',nome:"Aluno 1"},{id:'2',nome:"Aluno 2"}]);

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
                    //console.log(response.data.exerciciosDisponiveis)
                } else {
                  
                }
            })
            .catch();
    }, [navigate]);


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
        if (exercicioSelecionado && !formData.exercicios.includes(exercicioSelecionado)) {
            setFormData(prevData => ({
                ...prevData,
                exercicios: [...prevData.exercicios, exercicioSelecionado]
            }));
            setExercicioSelecionado(''); // Limpa a seleção após adicionar
        }
    };

    const removerExercicio = (exercicio) => {
        setFormData(prevData => ({
            ...prevData,
            exercicios: prevData.exercicios.filter((item) => item !== exercicio)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!Array.isArray(formData.exercicios) || formData.exercicios.length === 0) {
            setFeedback({ message: 'Por favor, adicione ao menos um exercício!', type: 'error' });
            return;
        }
        
        formData.ids_exercicio = convertToNumber(formData.exercicios);
        //formData.id = parseInt(formData.id,10);
        console.log(formData);
        
        axios.post(submitUrl, formData)
            .then((response) => {
                setFeedback({ message: 'Treino cadastrado com sucesso!', type: 'success' });
            })
            .catch((error) => {
                console.log(error)
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
                            {formData.exercicios.map((exercicioId, index) => {
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

                    <button type="submit">Cadastrar</button>
                </form>

                <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
            </div>
        </>
    );
}