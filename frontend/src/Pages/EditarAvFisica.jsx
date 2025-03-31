import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import '../Assets/HomePage.css';
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import "../Assets/Forms.css";

export default function EditarAvFisica({ submitUrl }) {
    const navigate = useNavigate();
    const {id} = useParams()
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [formData, setFormData] = useState({
        altura: '',
        peso: '',
        observacoes: '',
        biotipo: '',
        medidas: '',
        aluno_matricula: '',
        id_avaliacao_fisica:id
    });

    const [alunos, setAlunos] = useState([]);


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

    // Dados de exemplo para teste
    useEffect(() => {
        // Simulando dados carregados de uma API

      
            axios.get('http://localhost:5000/FormAtualizarAvaliacaoFisica/' + id, { withCredentials: true })
                .then(response => {
                    if (response.data["avaliacao fisica"]) {
                        setFormData(response.data["avaliacao fisica"])
                    } else {
    
                    }
                })
                .catch();
       
 
            axios.get('http://localhost:5000/ListarAluno', { withCredentials: true })
                .then(response => {
                    if (response.data.alunos) {
                        setAlunos(response.data.alunos)
                        console.log(response.data.alunos)
                    } else {
    
                    }
                })
                .catch();

    }, []);

    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        
        // Log para verificar os dados sendo alterados
        console.log(`Campo alterado: ${name} = ${value}`);
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`${submitUrl}/${id}`, formData)
        .then((response) => {
            setFeedback({ message: 'Avaliação atualizada com sucesso!', type: 'success' });
        })
        .catch((error) => {
            setFeedback({ message: 'Erro ao atualizar avaliação', type: 'error' });
        });
};


    return (
        <>
            <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
            <div className="home-page">
                <MenuBar isAdm={IsAdmin}/>

                <form className="generic-form" onSubmit={handleSubmit}>
                    {/* Altura */}
                    <div className="form-group">
                        <label htmlFor="altura">Altura</label>
                        <input
                            type="number"
                            id="altura"
                            name="altura"
                            value={formData.altura}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Peso */}
                    <div className="form-group">
                        <label htmlFor="peso">Peso</label>
                        <input
                            type="number"
                            id="peso"
                            name="peso"
                            value={formData.peso}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Observações */}
                    <div className="form-group">
                        <label htmlFor="observacoes">Observações</label>
                        <textarea
                            name="observacoes"
                            value={formData.observacoes}
                            onChange={handleChange}
                            cols={40}
                            rows={4}
                            required
                        />
                    </div>

                    {/* Biotipo */}
                    <div className="form-group">
                        <label htmlFor="biotipo">Biotipo</label>
                        <input
                            type="text"
                            id="biotipo"
                            name="biotipo"
                            value={formData.biotipo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Medidas */}
                    <div className="form-group">
                        <label htmlFor="medidas">Medidas</label>
                        <input
                            type="text"
                            id="medidas"
                            name="medidas"
                            value={formData.medidas}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Aluno */}
                    <div className="form-group">
                        <label htmlFor="aluno_matricula">Aluno</label>
                        <select
                            id="aluno_matricula"
                            name="aluno_matricula"
                            value={formData.aluno_matricula}
                            onChange={handleChange}
                            required
                        >
                            {alunos.length > 0 ? (
                                alunos.map((aluno) => (
                                    <option key={aluno.matricula} value={aluno.matricula}>
                                        {aluno.nome}
                                    </option>
                                ))
                            ) : (
                                <option value="">Carregando alunos...</option>
                            )}
                        </select>
                    </div>

                    <button type="submit">Cadastrar</button>
                </form>

                <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
            </div>
        </>
    );
}
