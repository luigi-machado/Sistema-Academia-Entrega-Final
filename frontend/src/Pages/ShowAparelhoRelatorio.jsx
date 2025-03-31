// Pages/ShowFuncionario.js
import React, { useEffect, useState } from 'react';
import { data, useParams } from 'react-router-dom';
import axios from 'axios';
import TopBar from "../Components/TopBar";
import MenuBar from "../Components/MenuBar";
import ShowInfo from "../Components/ShowInfo";
import FeedbackPopup from "../Components/FeedbackPopup";

function NumDisponiveis(aparelhos) {
    count = 0
    foreach (aparelho in aparelhos) 
    {
        if (aparelho.disponibilidade == "Disponível")
            count++
    }
    return count
}

export default function ShowRelatorio() {
    const { id } = useParams();
    const [data,setData] = useState('')
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin, setIsAdmin] = useState('');
    
    const labels = ["Nome", "Serial", "Disponibilidade"]; // Mesmo headers da tabela

    const datas = [{ Nome: "Halteres 5kg", Serial: [10], disponibilidade: ["Disponível"] }]
    //const plano =  { Nome: ["Plano A"], Valor: ["220,00"], Descricao: ["asdfasdfgadefgsd"] }

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

    /*
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
        axios.get(`http://localhost:5000/funcionarios/${id}`, { withCredentials: true })
            .then(response => {
                setFuncionario(response.data);
            })
            .catch(error => {
                setFeedback({ message: 'Erro ao carregar funcionário', type: 'error' });
            });
    }, [id]);
*/
    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
    };

    if (!datas) {
        return <div>Carregando...</div>;
    }

    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <ShowInfo labels={labels} data={datas}/>
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    )

}

