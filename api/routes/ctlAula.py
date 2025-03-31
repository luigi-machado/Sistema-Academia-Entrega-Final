from flask import Blueprint, request, jsonify
from models.aula import Aula
from sqlalchemy.orm import sessionmaker
from BD.bd import engine

aula_route = Blueprint('aula', __name__)

@aula_route.route('/CadastrarAula', methods=['POST'])
def CadastrarAula():
    data = request.get_json()
    horario = data.get('horario')
    tipo = data.get('tipo')
    sala = data.get('sala')
    ids_funcionario = data.get('ids_funcionario') or []
    session = sessionmaker(bind=engine)()
    try:
        aula = Aula(horario, tipo, sala)
        id_aula = aula.CadastrarAula(session)
        for id_funcionario in ids_funcionario:
            aula.CadastrarFuncionarioAula(id_funcionario, id_aula, session)
        session.commit()
        return jsonify({"mensagem": "Aula cadastrada com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao cadastrar aula", "erro": str(e)}), 404
    finally:
        session.close()


@aula_route.route('/ListarAula', methods=['GET'])
def ListarAula():
    session = sessionmaker(bind=engine)()
    try:
        aula = Aula("", "", "")
        result = aula.ListarAula(session)
        aulas = [
            {"id_aula": row[0], "horario": row[1], "tipo": row[2], "sala": row[3]}
            for row in result
        ]
        return jsonify({"aulas": aulas}), 200
    except Exception as e:  
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao listar aulas", "erro": str(e)}), 404
    finally:
        session.close()


@aula_route.route('/FormAtualizarAula/<int:id_aula>', methods=['GET'])
def FormAtualizarAula(id_aula):
    session = sessionmaker(bind=engine)()
    try:
        aula = Aula("", "", "")
        result = aula.GetAllAula(id_aula, session)
        dictAula = {
            "aula": {
                "id_aula": result[0],
                "horario": result[1],
                "tipo": result[2],
                "sala": result[3],
                "ids_funcionario": result[4]
            }
        }
        return jsonify({"aula": dictAula}), 200
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao buscar aula", "erro": str(e)}), 404
    finally:
        session.close()



@aula_route.route('/AtualizarAula/<int:id_aula>', methods=['PUT'])
def AtualizarAula(id_aula):
    data = request.get_json()
    id_aula = str(id_aula)
    horario = data.get('horario')
    tipo = data.get('tipo')
    sala = data.get('sala')
    ids_funcionario = data.get('ids_funcionario') or []

    session = sessionmaker(bind=engine)()
    try:
        aula = Aula(horario, tipo, sala)
        aula.AtualizarAula(id_aula, session)
        aula.ExcluirFuncionarioAula(id_aula, session)
        for id_funcionario in ids_funcionario:
            aula.CadastrarFuncionarioAula(id_funcionario, id_aula, session)
        session.commit()
        return jsonify({"mensagem": "Aula atualizada com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao atualizar aula", "erro": str(e)}), 404
    finally:
        session.close() 



@aula_route.route('/ExcluirAula/<int:id_aula>', methods=['DELETE'])
def ExcluirAula(id_aula):
    session = sessionmaker(bind=engine)()
    try:
        aula = Aula("", "", "")
        aula.ExcluirAula(id_aula, session)
        session.commit()
        return jsonify({"mensagem": "Aula excluída com sucesso!"}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao excluir aula", "erro": str(e)}), 404
    finally:
        session.close()
        