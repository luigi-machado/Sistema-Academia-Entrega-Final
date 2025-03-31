import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Assets/HomePage.css';
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import "../Assets/Forms.css";


export default function CadastroAvFisica({ submitUrl }) {
    const navigate = useNavigate();
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
        instrutor_NIT: ''
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


    const [aluno, setAlunos] = useState([]);
    const [funcionario, setFuncionarios] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:5000/ListarAluno', { withCredentials: true })
            .then(response => {
                if (response.data.alunos) {
                    setAlunos(response.data.alunos)
                    console.log(response.data.alunos)
                } else {

                }
            })
            .catch();
    }, [navigate]);


    useEffect(() => {
        axios.get('http://localhost:5000/ListarFuncionarios', { withCredentials: true })
            .then(response => {
                if (response.data.funcionarios) {
                    setFuncionarios(response.data.funcionarios)
                    console.log(funcionario);
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
        formData.altura = parseFloat(formData.altura,10);
        formData.peso = parseFloat(formData.peso, 10);
        console.log(formData);  // Add this for debugging
        axios.post(submitUrl, formData)
            .then((response) => {
                setFeedback({ message: 'Cadastro realizado com sucesso!', type: 'success' });
            })
            .catch((error) => {
                setFeedback({ message: 'Erro ao cadastrar aluno!', type: 'error' });
            });
    };

    return (
        <>
            <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
            <div className="home-page">
                <MenuBar isAdm={IsAdmin}/>

                <form className="generic-form" onSubmit={handleSubmit}>
                    {/* Matrícula */}
                    <div className="form-group">
                        <label htmlFor="altura">Altura / cm</label>
                        <input
                            type="number"
                            id="altura"
                            name="altura"
                            value={formData.altura}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Nome */}
                    <div className="form-group">
                        <label htmlFor="peso">Peso / kg</label>
                        <input
                            type="number"
                            id="peso"
                            name="peso"
                            value={formData.peso}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Data de Nascimento */}
                    <div className="form-group">
                        <label htmlFor="data_nascimento">Observações</label>
                        <textarea
                            name="observacoes"
                            value={formData.observacoes}
                            onChange={handleChange}
                            cols={40}
                            rows={4}
                            required
                        />
                    </div>

                    {/* CPF */}
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

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="medidas">Medidas / cm</label>
                        <input
                            type="medidas"
                            id="medidas"
                            name="medidas"
                            value={formData.medidas}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Plano Selection */}
                    <div className="form-group">
                        <label htmlFor="aluno_matricula">Aluno</label>
                        <select
                            id="aluno_matricula"
                            name="aluno_matricula"
                            value={formData.aluno_matricula}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {aluno.length > 0 ? (
                                aluno.map((aluno) => (
                                    <option key={aluno.matricula} value={aluno.matricula}>
                                        {aluno.nome}
                                    </option>
                                ))
                            ) : (
                                <option value="">Carregando...</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="instrutor_NIT">Funcionario</label>
                        <select
                            id="instrutor_NIT"
                            name="instrutor_NIT"
                            value={formData.instrutor_NIT}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {funcionario.length > 0 ? (
                                funcionario.map((funcionario) => (
                                    <option key={funcionario.nit} value={funcionario.nit}>
                                        {funcionario.nome}
                                    </option>
                                ))
                            ) : (
                                <option value="">Carregando...</option>
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
