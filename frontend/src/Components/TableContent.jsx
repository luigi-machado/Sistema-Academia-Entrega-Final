import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Assets/TableComponent.css'; 
import lixoIcon from "../Assets/lixo.png";
import editIcon from "../Assets/editar.png";
import plusIcon from "../Assets/add-64px.png";
import FeedbackPopup from "../Components/FeedbackPopup";

const TableComponent = ({ titulo, dados, headers, AddPath, urlView, keyUnique, urlEdit, deleteUrl }) => {
  const [busca, setBusca] = useState('');
  const [dadosFiltrados, setDadosFiltrados] = useState(dados);
  const [localDados, setLocalDados] = useState(dados);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  // Atualiza os dados locais quando a prop dados muda
  useEffect(() => {
    setLocalDados(dados);
  }, [dados]);

  // Efeito para filtrar os dados sempre que o valor da busca mudar
  useEffect(() => {
    const resultadosFiltrados = Array.isArray(localDados) ? localDados.filter((item) =>
      headers.some((header) => {
        const value = item[header.toLowerCase()];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(busca.toLowerCase());
        }
        return String(value).toLowerCase().includes(busca.toLowerCase());
      })
    ) : [];

    setDadosFiltrados(resultadosFiltrados);
  }, [busca, localDados, headers]);

  const closeFeedback = () => {
    setFeedback({ message: '', type: '' });
  };

  const handleRowClick = (id) => {
    if (!urlView)
      return;
    navigate(urlView + `/${id}`);
  };

  const ClickEdit = (id) => {
    navigate(urlEdit + `/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      // Confirmação antes de deletar
      if (!window.confirm('Tem certeza que deseja excluir este item?')) {
        return;
      }

      // Requisição para a API
      await axios.delete(`${deleteUrl}/${id}`);
      
      // Atualização local dos dados
      setLocalDados(prevDados => prevDados.filter(item => item[keyUnique] !== id));
      
      setFeedback({ message: 'Item excluído com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      setFeedback({ message: 'Erro ao excluir item!', type: 'error' });
    }
  };

  return (
    <div className="table-container">
      <h2>{titulo}</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
              <th>Editar</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={headers.length + 2}>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Digite uma busca"
                    className="search-input"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                  <button className="plusButton">
                    <a href={AddPath}>
                      <img className="plusIcon" src={plusIcon} alt="Adicionar" />
                    </a>
                  </button>
                </div>
              </td>
            </tr>
            {dadosFiltrados.length > 0 ? (
              dadosFiltrados.map((item) => (
                <tr key={item[keyUnique]}>
                  {headers.map((header, index) => (
                    <td key={index} onClick={() => handleRowClick(item[keyUnique])}>
                      {item[header.toLowerCase()]}
                    </td>
                  ))}
                  <td>
                    <button className="whiteButton" onClick={() => ClickEdit(item[keyUnique])}>
                      <img src={editIcon} alt="Editar" className="icon" />
                    </button>
                  </td>
                  <td>
                    <button 
                      className="whiteButton" 
                      onClick={() => handleDelete(item[keyUnique])}
                    >
                      <img src={lixoIcon} alt="Remover" className="icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 2}>Nenhum dado encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
    </div>
  );
};

export default TableComponent;