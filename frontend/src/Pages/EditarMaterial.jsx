import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate , useParams } from "react-router-dom";
import '../Assets/HomePage.css';
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import "../Assets/Forms.css";
import addIcon from '../Assets/add-64px.png';  // Caminho para o ícone "mais"
import removeIcon from '../Assets/lixo.png'; // Caminho para o ícone "remover"

export default function EditarMaterial({ submitUrl }) {
    const navigate = useNavigate();
    const {id} = useParams();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [formData, setFormData] = useState({
        nome: '',
        numero_serie: '',
        disponibilidade: ''
    });

    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
    };

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
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
        axios.get('http://localhost:5000/FormAtualizarAparelho/' + id, { withCredentials: true })
            .then(response => {
                if (response.data.aparelho) {
                    setFormData({
                            nome: response.data.aparelho.aparelho.nome,
                            numero_serie: response.data.aparelho.aparelho.numero_serie,
                            disponibilidade: response.data.aparelho.aparelho.disponibilidade
                    });
                } else {

                }
            })
            .catch();
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();


        axios.put(submitUrl + id, formData)
            .then((response) => {
                setFeedback({ message: 'Aparelho atualizado com sucesso!', type: 'success' });
            })
            .catch((error) => {
                setFeedback({ message: 'Erro ao atualizar Aparelho!', type: 'error' });
            });
    };
    console.log(formData)

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

                    {/* Quantidade */}
                    <div className="form-group">
                        <label htmlFor="numero_serie">Numero De Serie</label>
                        <input
                            type="text"
                            id="numero_serie"
                            name="numero_serie"
                            value={formData.numero_serie}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Disponibilidade */}
                    <div className="form-group">
                        <label htmlFor="disponibilidade">Disponibilidade</label>
                        <input
                            type="text"
                            id="disponibilidade"
                            name="disponibilidade"
                            value={formData.disponibilidade}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <button type="submit">Editar</button>
                </form>

                <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
            </div>
        </>
    );
}
