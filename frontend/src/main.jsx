import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { createBrowserRouter, data, RouterProvider } from "react-router-dom";
import Index from './Pages/Index';
import Login from './Pages/Login';
import Aluno from './Pages/Aluno';
import Visitante from './Pages/Visitante';
import Planos from './Pages/Plano';
import Cadastro from './Pages/Cadastro';
import CadastroAluno from './Pages/CadastroAluno';
import ShowInfo from './Components/ShowInfo';
import ProfilePage from './Components/ProfilePage';
import Funcionario from './Pages/Funcionario';
import Aulas from './Pages/Aulas';
import Material from './Pages/Material';
import Avaliacao from './Pages/AvaliacaoFisica';
import Treinos from './Pages/Treino';
import CadastroAvFisica from './Pages/CadastroAvFisica'
import CadastroFuncionario from './Pages/CadastroFuncionario';
import EditarAluno from './Pages/EditarAluno';
import CadastroTreino from './Pages/CadastroTreino';
import CadastroVisitante from './Pages/CadastroVisitante';
import CadastroMaterial from './Pages/CadastroMaterial';
import CadastroPlano from './Pages/CadastroPlano';
import CadastroAula from './Pages/CadastroAula';
import EditarFuncionario from './Pages/EditarFuncionario'
import EditarAula from './Pages/EditarAula';
import EditarTreino from './Pages/EditarTreino';
import EditarAvFisica from './Pages/EditarAvFisica';
import EditarVisitante from './Pages/EditarVisitante';
import EditarPlano from './Pages/EditarPlano';
import EditarMaterial from './Pages/EditarMaterial';
import Exercicio from './Pages/Exercicio';
import CadastroExercicio from './Pages/CadastroExercicio';
import EditarExercicio from './Pages/EditarExercicio';
import ShowAluno from './Pages/ShowAluno';
import ShowFuncionario from './Pages/ShowFuncionario';
import ShowTreino from './Pages/ShowTreino';
import ShowAvFisica from './Pages/ShowAvFisica';
import ShowExercicio from './Pages/ShowExercicio';

const submitUrlCadPlano = 'http://localhost:5000/CadastrarPlano';
const submitUrlCadAluno = 'http://localhost:5000/CadastrarAluno';
const submitUrlCadFuncionario = 'http://localhost:5000/CadastrarFuncionario';
const submitUrlCadAvFisica = 'http://localhost:5000/CadastrarAvaliacaoFisica';
const submitUrlCadAula = 'http://localhost:5000/CadastrarAula';
const submitUrlCadVisitante = 'http://localhost:5000/CadastrarVisitante';
const submitUrlCadMaterial = 'http://localhost:5000/CadastrarAparelho';
const submitUrlCadTreino = 'http://localhost:5000/CadastrarTreino';
const submitUrlCadExercicio = 'http://localhost:5000/CadastrarExercicio';

const submitUrlEditPlano = 'http://localhost:5000/AtualizarPlano/';
const submitUrlEditAluno = 'http://localhost:5000/AtualizarAluno/';
const submitUrlEditFuncionario = 'http://localhost:5000/AtualizarFuncionario';
const submitUrlEditAvFisica = 'http://localhost:5000/AtualizarAvaliacaoFisica';
const submitUrlEditAula = 'http://localhost:5000/AtualizarAula/';
const submitUrlEditVisitante = 'http://localhost:5000/AtualizarVisitante';
const submitUrlEditMaterial = 'http://localhost:5000/AtualizarAparelho/';
const submitUrlEditTreino = 'http://localhost:5000/AtualizarTreino/';
const submitUrlEditExercicio = 'http://localhost:5000/AtualizarExercicio';


const submitUrlRemovePlano = 'http://localhost:5000/CadastrarPlano';
const submitUrlRemoveAluno = 'http://localhost:5000/CadastrarPlano';
const submitUrlRemoveFuncionario = 'http://localhost:5000/CadastrarPlano';
const submitUrlRemoveAvFisica = 'http://localhost:5000/CadastrarPlano';
const submitUrlRemoveAula = 'http://localhost:5000/CadastrarPlano';
const submitUrlRemoveVisitante = 'http://localhost:5000/CadastrarPlano';
const submitUrlRemoveMaterial = 'http://localhost:5000/CadastrarPlano';
const submitUrlRemoveTreino = 'http://localhost:5000/CadastrarPlano';
const submitUrlRemoveExercicio = 'http://localhost:5000/CadastrarPlano';

const submitUrlViewPlano = 'http://localhost:5000/CadastrarPlano';
const submitUrlViewAluno = 'http://localhost:5000/CadastrarPlano';
const submitUrlViewFuncionario = 'http://localhost:5000/CadastrarPlano';
const submitUrlViewAvFisica = 'http://localhost:5000/FormAtualizarAvaliacaoFisica/';
const submitUrlViewAula = 'http://localhost:5000/CadastrarPlano';
const submitUrlViewVisitante = 'http://localhost:5000/CadastrarPlano';
const submitUrlViewMaterial = 'http://localhost:5000/CadastrarPlano';
const submitUrlViewTreino = 'http://localhost:5000/CadastrarPlano';
const submitUrlViewExercicio = 'http://localhost:5000/CadastrarPlano';

const dataAluno = {
  "matricula": "123456",
  "nome": "João Silva",
  "data_nascimento": "1995-05-15",
  "cpf": "123.456.789-00",
  "email": "joao.silva@email.com",
  "telefone": "(11) 98765-4321",
  "logradouro": "Rua das Flores",
  "cep": "12345-678",
  "rua": "Rua das Flores",
  "num_casa": "123",
  "bairro": "Jardim Primavera",
  "cidade": "São Paulo",
  "plano_id": "1",
  "aulas": [
      "matematica",
      "fisica",
      "literatura"
  ]
}

const AppRouter = () => {

  return (
    <RouterProvider
      router={createBrowserRouter([
        { path: "/", element: <Login /> },
        { path: "/main", element: <Index /> },
        { path: "/aluno", element: <Aluno AddPath="/aluno/cadastro" /> },
        { path: "/aulas", element: <Aulas AddPath="/aulas/cadastro" urlEdit={"/aulas/edit"}/> },
        { path: "/funcionarios", element: <Funcionario AddPath={"/funcionario/cadastro"}/>},
        { path: "/visitante", element: <Visitante AddPath="/visitante/cadastro"/> },
        { path: "/planos", element: <Planos AddPath="/planos/cadastro"/> },
        { path: "/avaliacao", element: <Avaliacao AddPath="/avaliacao/cadastro" urlEdit={"/avaliacao/edit"} urlView={"/avaliacao/view"}/> },
        { path: "/material", element: <Material AddPath="/material/cadastro"/>},
        { path: "/treino", element: <Treinos AddPath="/treino/cadastro"/>},
        { path: "/exercicio" , element: <Exercicio AddPath={"/exercicio/cadastro"} urlEdit={"/exercicio/edit"} urlView={"/exercicio/view"}/>},

        { path: "/planos/cadastro", element: <CadastroPlano submitUrl={submitUrlCadPlano}/>},
		    { path: "/aluno/cadastro", element: <CadastroAluno submitUrl={submitUrlCadAluno}/> },
        { path: "/aulas/cadastro", element: <CadastroAula submitUrl={submitUrlCadAula}/>},
        { path: "/material/cadastro", element: <CadastroMaterial submitUrl={submitUrlCadMaterial}/>},
        { path: "/visitante/cadastro", element: <CadastroVisitante submitUrl={submitUrlCadVisitante}/>},
        { path: "/avaliacao/cadastro", element: <CadastroAvFisica submitUrl={submitUrlCadAvFisica}/>},
        { path: "/treino/cadastro" , element: <CadastroTreino submitUrl={submitUrlCadTreino} />},
        { path: "/funcionario/cadastro", element: <CadastroFuncionario submitUrl={submitUrlCadFuncionario} />},
        { path: "/exercicio/cadastro", element: <CadastroExercicio submitUrl={submitUrlCadExercicio} />},

        { path: "/aluno/edit/:id" , element: <EditarAluno submitUrl={submitUrlEditAluno} />},
        { path: "/funcionario/edit/:id" , element: <EditarFuncionario submitUrl={submitUrlEditFuncionario} />},
        { path: "/aulas/edit/:id" , element: <EditarAula submitUrl={submitUrlEditAula} />},
        { path: "/treino/edit/:id" , element: <EditarTreino submitUrl={submitUrlEditTreino} />},
        { path: "/avaliacao/edit/:id" , element: <EditarAvFisica submitUrl={submitUrlEditAvFisica} />},
        { path: "/visitante/edit/:id" , element: <EditarVisitante submitUrl={submitUrlEditVisitante} />},
        { path: "/planos/edit/:id" , element: <EditarPlano submitUrl={submitUrlEditPlano} />},
        { path: "/material/edit/:id" , element: <EditarMaterial submitUrl={submitUrlEditMaterial} />},
        { path: "/Exercicio/edit/:id" , element: <EditarExercicio submitUrl={submitUrlEditExercicio} />},

        { path: "/aluno/view/:id" , element: <ShowAluno viewUrl={submitUrlViewAula}/>},
        { path: "/funcionario/view/:id" , element: <ShowFuncionario viewUrl={submitUrlViewFuncionario}/>},
        { path: "/treino/view/:id" , element: <ShowTreino  viewUrl={submitUrlViewTreino}/>},
        { path: "/avaliacao/view/:id" , element: <ShowAvFisica  viewUrl={submitUrlViewAvFisica}/>},
        //{ path: "/visitante/view/:id" , element: <EditarVisitante />},
        //{ path: "/material/view/:id" , element: <EditarMaterial submitUrl={submitUrlEditMaterial} />},
        { path: "/Exercicio/view/:id" , element: <ShowExercicio  viewUrl={submitUrlViewExercicio} />},

        { path: "/dev", element:<ShowTreino/> },
        { path: "/novo", element: <ShowInfo labels={["nome", "sobrenome"]} data={{nome: ["nome1"], sobrenome: ["dois"]}} /> }
      ])}
    />
  );
};
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
