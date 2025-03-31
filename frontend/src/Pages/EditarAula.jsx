import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate , useParams} from "react-router-dom";
import '../Assets/HomePage.css';
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import "../Assets/Forms.css";
import addIcon from '../Assets/add-64px.png';  // Caminho para o ícone "mais"
import removeIcon from '../Assets/lixo.png'; // Caminho para o ícone "remover"

export default function EditarAula({ submitUrl }) {
    const navigate = useNavigate();
    const {id} = useParams()
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [formData, setFormData] = useState({
        horario: '',
        tipo: '',
        sala: ''
    });

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
        axios.get('http://localhost:5000/FormAtualizarAula/' + id, { withCredentials: true })
            .then(response => {
                if (response.data.aula.aula) {
                    setFormData({
                            horario: response.data.aula.aula.horario,
                            tipo: response.data.aula.aula.tipo,
                            sala: response.data.aula.aula.sala
                    });
                } else {

                }
            })
            .catch();
    }, []);

    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
    };

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };


    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Prepare the data with selected
        const dataToSubmit = {
            // implement
        };

        axios.put(submitUrl + id, formData)
            .then((response) => {
                setFeedback({ message: 'Aula atualizada com sucesso!', type: 'success' });
            })
            .catch((error) => {
                setFeedback({ message: 'Erro ao editar Aparelho!', type: 'error' });
            });
    };

    return (
        <>
            <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
            <div className="home-page">
                <MenuBar isAdm={IsAdmin}/>

                <form className="generic-form" onSubmit={handleSubmit}>

                    {/* Nome */}
                    <div className="form-group">
                        <label htmlFor="horario">Horario</label>
                        <input
                            type="text"
                            id="horario"
                            name="horario"
                            value={formData.horario}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Tipo */}
                    <div className="form-group">
                        <label htmlFor="tipo">Tipo</label>
                        <input
                            type="text"
                            id="tipo"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Sala */}
                    <div className="form-group">
                        <label htmlFor="sala">Sala</label>
                        <input
                            type="text"
                            id="sala"
                            name="sala"
                            value={formData.sala}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <button type="submit">Cadastrar</button>
                </form>

                <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
            </div>
        </>
    );
}
