
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TopBar from "../Components/TopBar";
import MenuBar from "../Components/MenuBar";
import ShowInfo from "../Components/ShowInfo";
import FeedbackPopup from "../Components/FeedbackPopup";

export default function ShowAvFisica({viewUrl}) {
    const { id } = useParams();
    const [AvFisicas,setAvFisicas] = useState('')
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    
    const labels = ["altura", "peso", "observacoes","biotipo","medidas","aluno_matricula"]; // Mesmo headers da tabela

    //const plano =  { Nome: ["Plano A"], Valor: ["220,00"], Descricao: ["asdfasdfgadefgsd"] }

    
    useEffect(() => {
        // Verificar sessão
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

        // Buscar dados do funcionário
        axios.get(`${viewUrl}/${id}`, { withCredentials: true })
            .then(response => {
                setAvFisicas(response.data["avaliacao fisica"]);
            })
            .catch(error => {
                setFeedback({ message: 'Erro ao carregar', type: 'error' });
            });
    }, [id]);

    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
    };

    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <ShowInfo labels={labels} data={AvFisicas}/>
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    )

}

