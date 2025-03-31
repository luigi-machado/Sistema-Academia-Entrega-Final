from BD.bd import engine
from sqlalchemy.orm import sessionmaker
from flask import Blueprint, request, jsonify
from models.exercicio import Exercicio
from models.treino import Treino

exercicio_route = Blueprint('exercicio', __name__)

@exercicio_route.route('/CadastrarExercicio', methods=['POST'])
def CadastrarExercicio():
    data = request.get_json()
    nome = data.get('nome')
    musculo = data.get('musculo')
    series = data.get('series')
    repeticoes = data.get('repeticoes')
    ids_aparelho = data.get('ids_aparelho')
    session = sessionmaker(bind=engine)()
    try:
        exercicio = Exercicio(nome, musculo, series, repeticoes)
        id_exercicio = exercicio.CadastrarExercicio(session)
        for id_aparelho in ids_aparelho:
            exercicio.CadastrarExercicioAparelho(id_exercicio, id_aparelho, session)
        session.commit()
        return jsonify({"mensagem": "Exercicio cadastrado com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao cadastrar exercicio", "erro": str(e)}), 404
    finally:
        session.close()

@exercicio_route.route('/ListarExercicio', methods=['GET'])
def ListarExercicio():
    session = sessionmaker(bind=engine)()
    try:
        exercicio = Exercicio("", "", 0, 0)
        result = exercicio.ListarExercicio(session)
        exercicios = [
            {"id": row[0], "nome": row[1], "musculo": row[2], "series": row[3], "repeticoes": row[4]}
            for row in result
        ]
        return jsonify({"mensagem": "Lista de exercicios encontrada com sucesso!", "dados": exercicios}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao listar exercicios", "erro": str(e)}), 404
    finally:
        session.close()

@exercicio_route.route('/FormAtualizarExercicio/<int:id_exercicio>', methods=['GET'])
def FormAtualizarExercicio(id_exercicio):
    session = sessionmaker(bind=engine)()
    try:
        exercicio = Exercicio("", "", "", "")
        result = exercicio.GetAllExercicio(id_exercicio, session)

        dictExercicio = {
            "exercicio": {
                "id_exercicio": result[0],
                "nome": result[1],
                "musculo": result[2],
                "series": result[3],
                "repeticoes": result[4],
                "ids_aparelho": result[5]
            }
        }

        return jsonify({"exercicio": dictExercicio}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": f"Error ao selecionar exercicio - {e}"}), 404
    finally:
        session.close()


@exercicio_route.route('/AtualizarExercicio/<int:id_exercicio>', methods=['PUT'])
def AtualizarExercicio(id_exercicio):
    data = request.get_json()
    id_exercicio = str(id_exercicio)
    nome = data.get('nome')
    musculo = data.get('musculo')
    series = data.get('series')
    repeticoes = data.get('repeticoes')
    ids_aparelho = data.get('ids_aparelho')

    session = sessionmaker(bind=engine)()
    try:
        exercicio = Exercicio(nome, musculo, series, repeticoes)
        exercicio.AtualizarExercicio(id_exercicio, session)
        exercicio.ExcluirExercicioAparelho(id_exercicio, session)
        for id_aparelho in ids_aparelho:
            exercicio.CadastrarExercicioAparelho(id_exercicio, id_aparelho, session)
        session.commit()
        return jsonify({"mensagem": "Exercicio atualizado com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao atualizar exercicio", "erro": str(e)}), 404
    finally:
        session.close()


@exercicio_route.route('/ExcluirExercicio/<int:id_exercicio>', methods=['DELETE'])
def ExcluirExercicio(id_exercicio):
    session = sessionmaker(bind=engine)()
    try:
        exercicio = Exercicio("", "", "", "")
        exercicio.ExcluirExercicio(id_exercicio, session)
        session.commit()
        return jsonify({"mensagem": "Exercicio excluído com sucesso!"}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao excluir exercicio", "erro": str(e)}), 404
    finally:
        session.close()