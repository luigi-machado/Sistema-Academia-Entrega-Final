from BD.bd import engine
from sqlalchemy.orm import sessionmaker
from flask import Blueprint, request, jsonify
from models.treino import Treino

treino_route = Blueprint('route_treino', __name__)

@treino_route.route('/CadastrarTreino', methods=['POST'])
def CadastrarTreino():
    data = request.get_json()
    objetivo = data.get('objetivo')
    dificuldade = data.get('dificuldade')
    ids_exercicio = data.get('ids_exercicio')
    
    session = sessionmaker(bind=engine)()
    try:
        treino = Treino(objetivo, dificuldade)
        id_treino = treino.CadastrarTreino(session)
        for id_exercicio in ids_exercicio:
            treino.CadastrarTreinoExercicio(id_treino, id_exercicio, session)
        session.commit()
        return jsonify({"mensagem": "Treino cadastrado com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao cadastrar treino", "erro": str(e)}), 404
    finally:
        session.close()

@treino_route.route('/ListarTreinos', methods=['GET'])
def ListarTreinos():
    session = sessionmaker(bind=engine)()
    try:
        treino = Treino("", "")
        treinos = treino.ListarTreinos(session)
        dictTreinos = [{"id": row[0], "objetivo": row[1], "dificuldade": row[2]} for row in treinos]
        return jsonify({"mensagem": "Lista de treinos encontrada com sucesso!", "dados": dictTreinos}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao listar treinos", "erro": str(e)}), 404
    finally:
        session.close()

@treino_route.route('/FormAtualizarTreino/<int:id_treino>', methods=['GET'])
def FormAtualizarTreino(id_treino):
    session = sessionmaker(bind=engine)()
    try:
        treino = Treino("", "")
        result = treino.GetAllTreino(id_treino, session)

        dictTreino = {
            "treino": {
                "id_treino": result[0],
                "objetivo": result[1],
                "dificuldade": result[2],
                "ids_exercicio": result[3]
            }
        }
        return jsonify({"treino": dictTreino}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": f"Error ao selecionar treino - {e}"}), 404
    finally:
        session.close()


@treino_route.route('/AtualizarTreino/<int:id_treino>', methods=['PUT'])
def AtualizarTreino(id_treino):
    data = request.get_json()
    id_treino = str(id_treino)
    objetivo = data.get('objetivo')
    dificuldade = data.get('dificuldade')
    ids_exercicio = data.get('ids_exercicio') or []

    session = sessionmaker(bind=engine)()
    try:
        treino = Treino(objetivo, dificuldade)
        treino.AtualizarTreino(id_treino, session)
        treino.ExcluirTreinoExercicio(id_treino, session)
        for id_exercicio in ids_exercicio:
            treino.CadastrarTreinoExercicio(id_treino, id_exercicio, session)
        session.commit()
        return jsonify({"mensagem": "Treino atualizado com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao atualizar treino", "erro": str(e)}), 404
    finally:
        session.close()



@treino_route.route('/ExcluirTreino/<int:id_treino>', methods=['DELETE'])
def ExcluirTreino(id_treino):
    session = sessionmaker(bind=engine)()
    try:
        treino = Treino("", "")
        treino.ExcluirTreino(id_treino, session)
        session.commit()
        return jsonify({"mensagem": "Treino excluído com sucesso!"}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao excluir treino", "erro": str(e)}), 404
    finally:
        session.close()
