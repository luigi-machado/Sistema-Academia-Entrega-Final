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

export default function CadastroAluno({ submitUrl }) {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [formData, setFormData] = useState({
        matricula: '',
        nome: '',
        data_nascimento: '',
        cpf: '',
        email: '',
        telefone: '',
        logradouro: '',
        cep: '',
        rua: '',
        num_casa: '',
        bairro: '',
        cidade: '',
        plano_id: ''
    });
    const [planos, setPlanos] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [aulasDisp,setAulasDisp] = useState([]);
    const [aulaSelecionada, setAulaSelecionada] = useState('');
    const [treinos, setTreinos] = useState([]);
    const [treinoSelecionado, setTreinoSelecionado] = useState('');
    const [treinosDisp, setTreinosDisp] = useState([]);

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
        axios.get('http://localhost:5000/ListarAula', { withCredentials: true })
            .then(response => {
                if (response.data.aulas) {
                    setAulasDisp(response.data.aulas)
                } else {
       
                }
            })
            .catch()
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:5000/ListarTreinos', { withCredentials: true })
            .then(response => {
                if (response.data.dados) {
                    setTreinosDisp(response.data.dados)
                } else {
                  
                }
            })
            .catch();
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:5000/ListarPlano', { withCredentials: true })
            .then(response => {
                if (response.data.planos) {
                    setPlanos(response.data.planos)
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

    // Aulas functions
    const handleAulaChange = (e) => {
        setAulaSelecionada(e.target.value);
    };

    const adicionarAula = () => {
        if (!aulaSelecionada) return; // Impede adicionar se nenhum valor estiver selecionado
    
        const aulaObj = aulasDisp.find(aula => aula.id_aula === parseInt(aulaSelecionada, 10));
    
        if (!aulaObj) {
            console.error("Aula não encontrada!");
            return;
        }
    
        // Verifica se a aula já está na lista antes de adicionar
        if (aulas.some(a => a.id === aulaObj.id_aula)) {
            console.warn("Aula já adicionada!");
            return;
        }
    
        const novaAula = { id: aulaObj.id_aula, tipo: aulaObj.tipo };
        setAulas([...aulas, novaAula]);
    };
    

    const removerAula = (idAula) => {
        setAulas(aulas.filter(aula => aula.id !== idAula));
    };
  
    const handleTreinoChange = (e) => {
        setTreinoSelecionado(e.target.value);
    };

    const adicionarTreino = () => {
        const treinoObj = treinosDisp.find(treino => treino.id === parseInt(treinoSelecionado));
        const treinoObj2 = {id:treinoObj.id,objetivo:treinoObj.objetivo}
        if (treinoObj && !treinos.some(t => t.id === treinoObj.id)) {
            setTreinos([...treinos, treinoObj2]);
        }
    };

    const removerTreino = (idTreino) => {
        setTreinos(treinos.filter(treino => treino.id !== idTreino));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let aulas_id = []
        let treinos_id = []

        for(let i = 0; i < aulas.length;i++){
            aulas_id.push(aulas[i].id)
        }
        for(let i = 0; i < treinos.length;i++){
            treinos_id.push(treinos[i].id)
        }
        let dataToSubmit = {
            ...formData,
            aulas_id,
            treinos_id,
        };
        dataToSubmit.num_casa = parseInt(dataToSubmit.num_casa , 10)
        console.log(dataToSubmit)
       axios.post(submitUrl, dataToSubmit)
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

                    {/* Data de Nascimento */}
                    <div className="form-group">
                        <label htmlFor="data_nascimento">Data de Nascimento</label>
                        <input
                            type="date"
                            id="data_nascimento"
                            name="data_nascimento"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* CPF */}
                    <div className="form-group">
                        <label htmlFor="cpf">CPF</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
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

                    {/* Logradouro */}
                    <div className="form-group">
                        <label htmlFor="logradouro">Logradouro</label>
                        <input
                            type="text"
                            id="logradouro"
                            name="logradouro"
                            value={formData.logradouro}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* CEP */}
                    <div className="form-group">
                        <label htmlFor="cep">CEP</label>
                        <input
                            type="text"
                            id="cep"
                            name="cep"
                            value={formData.cep}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Rua */}
                    <div className="form-group">
                        <label htmlFor="rua">Rua</label>
                        <input
                            type="text"
                            id="rua"
                            name="rua"
                            value={formData.rua}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Número da Casa */}
                    <div className="form-group">
                        <label htmlFor="num_casa">Número da Casa</label>
                        <input
                            type="text"
                            id="num_casa"
                            name="num_casa"
                            value={formData.num_casa}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Bairro */}
                    <div className="form-group">
                        <label htmlFor="bairro">Bairro</label>
                        <input
                            type="text"
                            id="bairro"
                            name="bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Cidade */}
                    <div className="form-group">
                        <label htmlFor="cidade">Cidade</label>
                        <input
                            type="text"
                            id="cidade"
                            name="cidade"
                            value={formData.cidade}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Aula Selection */}
                    <div className="aula-selection">
                        <label htmlFor="aula">Selecione uma Aula</label>
                        <select
                            id="aula"
                            name="aula"
                            value={aulaSelecionada}
                            onChange={handleAulaChange}
                        >
                            <option value="">Selecione...</option>
                            {aulasDisp.length > 0 ? (
                                aulasDisp.map((aula) => (
                                    <option key={aula.id_aula} value={aula.id_aula}>
                                        {aula.tipo}
                                    </option>
                                ))
                            ) : (
                                <option value="">Carregando...</option>
                            )}
                        </select>
                        <button type="button" onClick={adicionarAula} className="icon-button add-btn">
                            <img src={addIcon} alt="Adicionar Aula" className="icon" />
                        </button>
                    </div>

                    {/* List of selected aulas */}
                    <div>
                        <h3>Aulas Selecionadas:</h3>
                        <ul>
                            {aulas.map((aula, index) => (
                                <li key={index} className="selected-aula">
                                    <div className="aula"><span>{aula.tipo}</span>
                                        <button type="button" onClick={() => removerAula(aula.id)} className="icon-button remove-btn">
                                            <img src={removeIcon} alt="Remover Aula" className="icon" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Treino Selection */}
                    <div className="aula-selection">
                        <label htmlFor="treino">Selecione um Treino</label>
                        <select
                            id="treino"
                            name="treino"
                            value={treinoSelecionado}
                            onChange={handleTreinoChange}
                        >
                            <option value="">Selecione...</option>
                           {treinosDisp.length > 0 ? (
                                treinosDisp.map((treno) => (
                                    <option key={treno.id} value={treno.id}>
                                        {treno.objetivo}
                                    </option>
                                ))
                            ) : (
                                <option value="">Carregando...</option>
                            )}
                        </select>
                        <button type="button" onClick={adicionarTreino} className="icon-button add-btn">
                            <img src={addIcon} alt="Adicionar Treino" className="icon" />
                        </button>
                    </div>

                    {/* List of selected treinos */}
                    <div>
                        <h3>Treinos Selecionados:</h3>
                        <ul>
                            {treinos.map((treino, index) => (
                                <li key={index} className="selected-aula">
                                    <div className="aula"><span>{treino.objetivo}</span>
                                        <button type="button" onClick={() => removerTreino(treino.id)} className="icon-button remove-btn">
                                            <img src={removeIcon} alt="Remover Treino" className="icon" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Plano Selection */}
                    <div className="form-group">
                        <label htmlFor="plano_id">Plano</label>
                        <select
                            id="plano_id"
                            name="plano_id"
                            value={formData.plano_id}
                            onChange={handleChange}
                            required
                        >
                              <option value="">Selecione...</option>
                            {planos.length > 0 ? (
                                planos.map((plano) => (
                                    <option key={plano.id} value={plano.id}>
                                        {plano.nome}
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