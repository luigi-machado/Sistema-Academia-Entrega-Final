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

function formatarData(dataString) {
    const data = new Date(dataString);

    const ano = data.getUTCFullYear();
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // Janeiro = 0
    const dia = String(data.getUTCDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}


export default function EditarVisitante({ submitUrl }) {
    const {id} = useParams()
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [formData, setFormData] = useState({
        nome: '',
        data_ultima_visita: '',
        telefone: '',
        qunt_visitas: ''
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
            .catch();
    }, [navigate]);


    useEffect(() => {
        axios.get('http://localhost:5000/FormAtualizarVisitante/' + id, { withCredentials: true })
            .then(response => {
                if (response.data.visitante) {
                    setFormData({
                        nome: response.data.visitante.nome,
                        data_ultima_visita: response.data.visitante.data_ultima_visita,
                        qunt_visitas: response.data.visitante.qunt_visitas,
                        telefone: response.data.visitante.telefone,
                        id_visitante:id
                    });
                } else {

                }
            })
            .catch();
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
    formData.data_ultima_visita = formatarData(formData.data_ultima_visita);
    console.log(formData);

    axios.put(`${submitUrl}/${id}`, formData, { withCredentials: true }) 
        .then((response) => {
            setFeedback({ message: 'Visitante atualizado com sucesso!', type: 'success' });
        })
        .catch((error) => {
            setFeedback({ message: 'Erro ao atualizar visitante!' + error, type: 'error' });
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
                            id="data_ultima_visita"
                            name="data_ultima_visita"
                            value={formatarData(formData.data_ultima_visita)}
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
                        <label htmlFor="qunt_visitas">Visitas</label>
                        <input
                            type="number"
                            min={0}
                            id="qunt_visitas"
                            name="qunt_visitas"
                            value={parseInt(formData.qunt_visitas,10)}
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
