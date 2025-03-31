from flask import Blueprint, request, jsonify
from models.aparelho import Aparelho
from BD.bd import engine
from sqlalchemy.orm import sessionmaker

gestMaterial_route = Blueprint('gestMaterial', __name__)


@gestMaterial_route.route('/CadastrarAparelho', methods=['POST'])
def CadastrarAparelho():
    data = request.get_json()  
    nome = data.get('nome')
    numero_serie = data.get('numero_serie')
    disponibilidade = data.get('disponibilidade')
    session = sessionmaker(bind=engine)()
    try:
        aparelho = Aparelho(nome, numero_serie, disponibilidade)
        aparelho.CadastrarAparelho(session)
        session.commit()
        return jsonify({"mensagem": "Aparelho cadastrado com sucesso!", "dados": data}), 201
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao cadastrar aparelho", "erro": str(e)}), 404
    finally:
        session.close()


@gestMaterial_route.route('/FormAtualizarAparelho/<int:id_aparelho>', methods=['GET'])
def FormAtualizarAparelho(id_aparelho):
    session = sessionmaker(bind=engine)()
    try:
        aparelho = Aparelho("", "", "")
        result = aparelho.GetAparelho(id_aparelho, session)
        dictAparelho = {
            "aparelho": {
                "id_aparelho": result[0],
                "nome": result[1],
                "numero_serie": result[2],
                "disponibilidade": result[3]
            }
        }
        return jsonify({"aparelho": dictAparelho}), 200
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao selecionar aparelho", "erro": str(e)}), 404
    finally:
        session.close()

@gestMaterial_route.route('/AtualizarAparelho/<int:id_aparelho>', methods=['PUT'])
def AtualizarAparelho(id_aparelho):
    data = request.get_json()  
    nome = data.get('nome')
    numero_serie = data.get('numero_serie')
    disponibilidade = data.get('disponibilidade')

    session = sessionmaker(bind=engine)()
    try:
        aparelho = Aparelho(nome, numero_serie, disponibilidade)
        aparelho.AtualizarAparelho(id_aparelho, session)
        session.commit()
        return jsonify({"mensagem": "Aparelho atualizado com sucesso!"}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao atualizar aparelho", "erro": str(e)}), 404
    finally:
        session.close()


@gestMaterial_route.route('/ListarAparelhos', methods=['GET'])
def ListarAparelhos():
    session = sessionmaker(bind=engine)()
    try:
        aparelho = Aparelho("", "", "")
        result = aparelho.ListarAparelhos(session)
        if result:
            aparelhos = [
                {"id_aparelho": row[0], "nome": row[1], "numero_serie": row[2], "disponibilidade": row[3]}
                for row in result
            ]
            return jsonify({"Aparelhos": aparelhos}), 200
        
        elif result == []:
            return jsonify({"mensagem": "Nenhum aparelho encontrado"}), 404
        
        return jsonify({"mensagem": "Erro ao listar aparelhos"}), 404
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao listar aparelhos", "erro": str(e)}), 404
    finally:
        session.close()


@gestMaterial_route.route('/ExcluirAparelho/<int:id_aparelho>', methods=['DELETE'])
def ExcluirAparelho(id_aparelho):
    session = sessionmaker(bind=engine)()
    try:
        aparelho = Aparelho("", "", "")
        aparelho.ExcluirAparelho(id_aparelho, session)
        session.commit()
        return jsonify({"mensagem": "Aparelho excluído com sucesso!"}), 200
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao excluir aparelho", "erro": str(e)}), 404
    finally:
        session.close()