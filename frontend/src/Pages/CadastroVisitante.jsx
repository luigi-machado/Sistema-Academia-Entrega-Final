import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css';
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import "../Assets/Forms.css";
import addIcon from '../Assets/add-64px.png';  // Caminho para o ícone "mais"
import removeIcon from '../Assets/lixo.png'; // Caminho para o ícone "remover"

export default function CadastroVisitante({ submitUrl }) {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [formData, setFormData] = useState({
        nome: '',
        data_ultima_visita: '',
        qunt_visitas:1,
        telefone:'',
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

        axios.post(submitUrl, formData)
            .then((response) => {
                setFeedback({ message: 'Cadastro realizado com sucesso!', type: 'success' });
            })
            .catch((error) => {
                setFeedback({ message: 'Erro ao cadastrar visitante!', type: 'error' });
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
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Data de Visita */}
                    <div className="form-group">
                        <label htmlFor="data_ultima_visita">Data de Visita</label>
                        <input
                            type="date"
                            id="data_nascimento"
                            name="data_ultima_visita"
                            value={formData.data_ultima_visita}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Telefone */}
                    <div className="form-group">
                        <label htmlFor="telefone">Telefone</label>
                        <input
                            type="tel"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                        {/* Valor */}
                        <div className="form-group">
                        <label htmlFor="visitas">Visitas</label>
                        <input
                            type="number"
                            min={0}
                            id="visitas"
                            name="visitas"
                            value={formData.qunt_visitas}
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
