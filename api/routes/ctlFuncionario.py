from flask import request, jsonify, Blueprint
from BD.bd import engine
from sqlalchemy.orm import sessionmaker
from models.funcionario import Funcionario
from models.endereco import Endereco
from models.adm import Adm
from models.instrutor import Instrutor
from models.contrato import Contrato
from models.usuario import Usuario
import hashlib

funcionario_route = Blueprint('funcionario', __name__)

@funcionario_route.route('/CadastrarFuncionario', methods=['POST'])
def CadastrarFuncionario():
    data = request.get_json()
    nit = data.get('nit')
    nome = data.get('nome')
    data_nascimento = data.get('data_nascimento')
    cpf = data.get('cpf')
    email = data.get('email')
    telefone = data.get('telefone')
    logradouro = data.get('logradouro')
    cep = data.get('cep')
    rua = data.get('rua')
    num_casa = data.get('num_casa')
    bairro = data.get('bairro')
    cidade = data.get('cidade')
    is_admin = data.get('is_admin')
    cargo = data.get('cargo')
    grau_academico = data.get('grau_academico')
    salario = data.get("salario")
    data_contratacao = data.get("data_contratacao")
    data_final = data.get("data_final")
    username = data.get("username")
    password = data.get("password")
    

    session = sessionmaker(bind=engine)()

    try:
        funcionario = Funcionario(nit, nome, data_nascimento, cpf, email, telefone)
        funcionario.CadastrarFuncionario(session)

        contrato = Contrato(salario, data_contratacao, data_final, nit)
        contrato.CadastrarContrato(session)

        hash_password = hashlib.sha256(password.encode()).hexdigest()

        usuario = Usuario(username, hash_password, is_admin, nit)
        usuario.CadastrarUser(session)

        end = Endereco(logradouro, cep, rua, num_casa, bairro, cidade, None,  nit)
        end.CadastrarEndereco(session)

        if is_admin:
            adm = Adm(nit, cargo)
            adm.CadastrarAdm(session)
        else:
            instrutor = Instrutor(nit, grau_academico)
            instrutor.CadastrarInstrutor(session)
        
        session.commit()
        return jsonify({"mensagem": "Funcionário cadastrado com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao cadastrar funcionário", "erro": str(e)}), 404
    finally:
        session.close()


@funcionario_route.route('/ListarFuncionarios', methods=['GET'])
def ListarFuncionarios():
    session = sessionmaker(bind=engine)()
    try:
        funcionario = Funcionario("", "", "", "", "", "")
        result = funcionario.ListarFuncionarios(session)
        funcionarios = [
            {"nit": row[0], "nome": row[1], "data_nascimento": row[2], "cpf": row[3], "email": row[4], "telefone": row[5]}
            for row in result
        ]
        return jsonify({"funcionarios": funcionarios}), 200
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao listar funcionários", "erro": str(e)}), 404
    finally:
        session.close()

@funcionario_route.route('/ListarInstrutores', methods=['GET'])
def ListarInstrutores():
    session = sessionmaker(bind=engine)()
    try:
        instrutor = Instrutor("", "")
        result = instrutor.ListarInstrutores(session)
        instrutores = [
            {
                "nit": row[0],  # O primeiro campo é o 'nit' do instrutor
                "grau_academico": row[1],  # O segundo campo é o 'grau_academico'
                "nome": row[3],  # O terceiro campo é o 'nome' do funcionário
                "data_nascimento": row[4],  # A data de nascimento do funcionário
                "cpf": row[5],  # O CPF do funcionário
                "email": row[6],  # O e-mail do funcionário
                "telefone": row[7]  # O telefone do funcionário
            }
            for row in result
        ]
        return jsonify({"instrutores": instrutores}), 200
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao listar instrutores", "erro": str(e)}), 404
    finally:
        session.close()

@funcionario_route.route('/FormAtualizarFuncionario/<string:nit>', methods=['GET'])
def FormAtualizarFuncionario(nit):
    session = sessionmaker(bind=engine)()
    try:
        funcionario = Funcionario(nit, "", "", "", "", "")
        result = funcionario.GetAllFuncionario(session)
        dictFunc = {
            "funcionario": {
                "nit": result[0],
                "nome": result[1],
                "data_nascimento": result[2],
                "cpf": result[3],
                "email": result[4],
                "telefone": result[5]},

                "usuario": {
                    "id_usuario": result[6],
                    "nit": result[7],
                    "username": result[8],
                    "senha_hash": result[9],
                    "is_adm": result[10]
                    
                },

                "administrador": {
                    "nit": result[11],
                    "cargo_administrador": result[12]
                },

                "instrutor": {
                    "nit": result[13],
                    "grau_instrutor": result[14]
                },

                "contrato": {
                    "id_contrato": result[15],
                    "salario": result[16],
                    "data_contratacao": result[17],
                    "data_final": result[18],
                    "nit": result[19]
                },

                "endereco": {
                    "id_endereco": result[20],
                    "logradouro": result[21],
                    "cep": result[22],
                    "rua": result[23],
                    "num_casa": result[24],
                    "bairro": result[25],
                    "cidade": result[26],
                    "aluno_matricula": result[27],
                    "nit": result[28]
                }
            }
        

        return jsonify({"funcionario": dictFunc}), 200
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao buscar funcionário", "erro": str(e)}), 404
    finally:
        session.close()



@funcionario_route.route('/AtualizarFuncionario/<string:nit>', methods=['PUT'])
def AtualizarFuncionario(nit):
    data = request.get_json()
    nome = data.get('nome')
    data_nascimento = data.get('data_nascimento')
    cpf = data.get('cpf')
    email = data.get('email')
    telefone = data.get('telefone')
    logradouro = data.get('logradouro')
    cep = data.get('cep')
    rua = data.get('rua')
    num_casa = data.get('num_casa')
    bairro = data.get('bairro')
    cidade = data.get('cidade')
    is_admin = data.get('is_admin')
    cargo = data.get('cargo')
    grau_academico = data.get('grau_academico')
    salario = data.get("salario")
    data_contratacao = data.get("data_contratacao")
    data_final = data.get("data_final")
    username = data.get("username")
    password = data.get("password")
    hash_password = data.get("hash_password")

    session = sessionmaker(bind=engine)()

    try:
        funcionario = Funcionario(nit, nome, data_nascimento, cpf, email, telefone)
        funcionario.AtualizarFuncionario(session)
        

        contrato = Contrato(salario, data_contratacao, data_final, nit)
        contrato.AtualizarContrato(session)

        if password:
            hash_password = hashlib.sha256(password.encode()).hexdigest()

        usuario = Usuario(username, hash_password, is_admin, nit)
        usuario.AtualizarUsuario(session)

        end = Endereco(logradouro, cep, rua, num_casa, bairro, cidade, None,  nit)
        end.AtualizarEnderecoFunc(nit, session)

        if is_admin:
            adm = Adm(nit, cargo)
            adm.AtualizarAdm(session)
        else:
            instrutor = Instrutor(nit, grau_academico)
            instrutor.AtualizarInstrutor(session)
        
        session.commit()
        return jsonify({"mensagem": "Funcionário atualizado com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao atualizar funcionário", "erro": str(e)}), 404
    finally:
        session.close()


@funcionario_route.route('/ExcluirFuncionario/<string:nit>', methods=['DELETE'])
def ExcluirFuncionario(nit):
    session = sessionmaker(bind=engine)()
    try:
        funcionario = Funcionario(nit, "", "", "", "", "")
        funcionario.ExcluirFuncionario(nit, session)
        session.commit()
        return jsonify({"mensagem": "Funcionário excluído com sucesso!"}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao excluir funcionário", "erro": str(e)}), 404
    finally:
        session.close()
        
