from flask import Blueprint, request, jsonify
from models.visitante import Visitante
from sqlalchemy.orm import sessionmaker
from BD.bd import engine


visitante_route = Blueprint('visitante', __name__)


@visitante_route.route('/FormCadastrarVisitante', methods=['GET'])
def FormCadastrarVisitante():
    ...

@visitante_route.route('/CadastrarVisitante', methods=['POST'])
def CadastrarVisitante():
    data = request.get_json()  # Obtém o JSON enviado
    nome = data.get('nome')
    data_ultima_visita = data.get('data_ultima_visita')
    telefone = data.get('telefone')
    qunt_visitas = data.get('qunt_visitas')

    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    try:
        visitante = Visitante(nome, data_ultima_visita, telefone, qunt_visitas)
        visitante.CadastrarVisitante(session)
        session.commit()
        return jsonify({"mensagem": "Visitante cadastrado com sucesso!", "dados": data}), 201

    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao cadastrar visitante", "erro": str(e)}), 404
    
    finally:
        session.close()


@visitante_route.route('/ListarVisitantes', methods=['GET'])
def ListarVisitantes():
    visitante = Visitante("", "", "", "")
    session = sessionmaker(bind=engine)()
    try:
        result = visitante.ListarVisitantes(session)
        if result:
            visitantes = [
                {"id_visitante": row[0], "nome": row[1], "data_ultima_visita": row[2], "telefone": row[3], "qunt_visitas": row[4]}
                for row in result
            ]
            session.commit()
            return jsonify({"visitantes": visitantes}), 200
    
        elif result == []:
            session.commit()
            return jsonify({"mensagem": "Nenhum visitante encontrado"}), 404
    
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao listar visitante", "erro": str(e)}), 404
    
    finally:
        session.close()



@visitante_route.route('/FormAtualizarVisitante/<int:id_visitante>', methods=['GET'])
def FormAtualizarVisitante(id_visitante):
    visitante = Visitante("", "", "", "")
    session = sessionmaker(bind=engine)()
    
    try:
        resultVisitante = visitante.GetVisitante(id_visitante, session)
        if resultVisitante:
            visitante = {"id_visitante": resultVisitante[0], "nome": resultVisitante[1], "data_ultima_visita": resultVisitante[2], "telefone": resultVisitante[3], "qunt_visitas": resultVisitante[4]}
            return jsonify({"visitante": visitante}), 200
        elif resultVisitante is None:
            return jsonify({"mensagem": "Visitante não encontrado"}), 404
    
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao selecionar visitante", "erro": str(e)}), 404
    
    finally:
        session.close()
        


@visitante_route.route('/AtualizarVisitante/<int:id_visitante>', methods=['PUT'])
def AtualizarVisitante(id_visitante):
    data = request.get_json()  # Obtém o JSON enviado
    nome = data.get('nome')
    data_ultima_visita = data.get('data_ultima_visita')
    telefone = data.get('telefone')
    qunt_visitas = data.get('qunt_visitas')
    visitante = Visitante(nome, data_ultima_visita, telefone, qunt_visitas)
    
    session = sessionmaker(bind=engine)()
    
    try:
        ids = visitante.AtualizarVisitante(id_visitante, session)
        session.commit()
        if ids is None:
            return jsonify({"mensagem": "Visitante não encontrado"}), 404
        return jsonify({"mensagem": "Visitante atualizado com sucesso!"}), 200
    
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao atualizar visitante", "erro": str(e)}), 404
    
    finally:
        session.close()

@visitante_route.route('/ExcluirVisitante/<int:id_visitante>', methods=['DELETE'])
def ExcluirVisitante(id_visitante):
    visitante = Visitante("", "", "", "")
    session = sessionmaker(bind=engine)()
    try:
        rowsResult = visitante.ExcluirVisitante(id_visitante, session)
        session.commit()
        if rowsResult == 0:
            return jsonify({"mensagem": "Visitante não encontrado"}), 404
        return jsonify({"mensagem": "Visitante excluído com sucesso!"}), 200
    
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao excluir visitante", "erro": str(e)}), 404
    
    finally:
        session.close()
        