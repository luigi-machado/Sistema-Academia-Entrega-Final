import { useState , useEffect} from "react";
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

export default function CadastroExercicio({ submitUrl }) {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    const [formData, setFormData] = useState({
        nome: '',
        musculo: '',
        series: '',
        repeticoes: '',
        ids_aparelho: [] // Alterado para array de materiais
    });
    const [materiaisDisponiveis, setMateriais] = useState([]);
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
        axios.get('http://localhost:5000/ListarAparelhos', { withCredentials: true })
            .then(response => {
                if (response.data.Aparelhos) {
                    setMateriais(response.data.Aparelhos)
                    console.log(response.data.Aparelhos)
                } else {
                  
                }
            })
            .catch();
    }, [navigate]);


    const [materialSelecionado, setMaterialSelecionado] = useState('');

    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleMaterialChange = (e) => {
        setMaterialSelecionado(e.target.value);
    };

    const adicionarMaterial = () => {
        if (materialSelecionado && !formData.ids_aparelho.includes(materialSelecionado)) {
            setFormData(prevData => ({
                ...prevData,
                ids_aparelho: [...prevData.ids_aparelho, materialSelecionado]
            }));
            setMaterialSelecionado(''); // Limpa a seleção após adicionar
        }
    };

    const removerMaterial = (materialId) => {
        setFormData(prevData => ({
            ...prevData,
            ids_aparelho: prevData.ids_aparelho.filter(id => id !== materialId)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        formData.ids_aparelho = convertToNumber(formData.ids_aparelho )
        formData.repeticoes = parseInt(formData.repeticoes,10)
        formData.series = parseInt(formData.series,10)
        console.log(formData);
        
        axios.post(submitUrl, formData)
            .then((response) => {
                setFeedback({ message: 'Exercício cadastrado com sucesso!', type: 'success' });
            })
            .catch((error) => {
                setFeedback({ message: 'Erro ao cadastrar exercício!', type: 'error' });
            });
    };

    return (
        <>
            <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
            <div className="home-page">
                <MenuBar isAdm={IsAdmin}/>

                <form className="generic-form" onSubmit={handleSubmit}>
                    {/* Nome do Exercício */}
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

                    {/* Músculo Trabalhado */}
                    <div className="form-group">
                        <label htmlFor="musculo">Músculo</label>
                        <input
                            type="text"
                            id="musculo"
                            name="musculo"
                            value={formData.musculo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Séries */}
                    <div className="form-group">
                        <label htmlFor="series">Séries</label>
                        <input
                            type="text"
                            id="series"
                            name="series"
                            value={formData.series}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Repetições */}
                    <div className="form-group">
                        <label htmlFor="repeticoes">Repetições</label>
                        <input
                            type="text"
                            id="repeticoes"
                            name="repeticoes"
                            value={formData.repeticoes}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Seleção de Materiais */}
                    <div className="aula-selection">
                        <label htmlFor="material">Selecione um Material</label>
                        <select
                            id="material"
                            name="material"
                            value={materialSelecionado}
                            onChange={handleMaterialChange}
                        >
                            <option value="">Selecione...</option>
                            {materiaisDisponiveis.map((material) => (
                                <option key={material.id_aparelho} value={material.id_aparelho}>
                                    {material.nome}
                                </option>
                            ))}
                        </select>
                        <button 
                            type="button" 
                            onClick={adicionarMaterial} 
                            className="icon-button add-btn"
                        >
                            <img src={addIcon} alt="Adicionar Material" className="icon" />
                        </button>
                    </div>

                    {/* Lista de Materiais Selecionados */}
                    <div>
                        <h3>Materiais Selecionados:</h3>
                        <ul>
                            {formData.ids_aparelho.map((materialId, index) => {

                                const material = materiaisDisponiveis.find(m => m.id_aparelho == materialId);
                                console.log(material)
                                console.log(materialId)
                                return (
                                    <li key={index} className="selected-aula">
                                        <div className="aula">
                                            <span>{material ? material.nome : materialId}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => removerMaterial(materialId)} 
                                                className="icon-button remove-btn"
                                            >
                                                <img src={removeIcon} alt="Remover Material" className="icon" />
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