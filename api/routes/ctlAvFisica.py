from flask import Blueprint, request, jsonify
from models.avaliacaoF import AvaliacaoFisica
from sqlalchemy.orm import sessionmaker
from BD.bd import engine


avaliacao_fisica_route = Blueprint('avaliacao_fisica', __name__)


@avaliacao_fisica_route.route('/FormCadastrarAvaliacaoFisica', methods=['GET'])
def FormCadastrarAvaliacaoFisica():
    ...

@avaliacao_fisica_route.route('/CadastrarAvaliacaoFisica', methods=['POST'])
def CadastrarAvaliacaoFisica():
    data = request.get_json()  # Obtém o JSON enviado
    altura = data.get('altura')
    peso = data.get('peso')
    observacoes = data.get('observacoes')
    biotipo = data.get('biotipo')
    medidas = data.get('medidas')
    matricula = data.get('aluno_matricula')
    instrutor_NIT = data.get('instrutor_NIT')

    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    try:
        avaliacao_fisica = AvaliacaoFisica(altura, peso, observacoes, biotipo, medidas, matricula, instrutor_NIT)
        avaliacao_fisica.CadastrarAvaliacaoFisica(session)
        session.commit()
        return jsonify({"mensagem": "Avaliação física cadastrada com sucesso!", "dados": data}), 201

    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao cadastrar avaliação física", "erro": str(e)}), 404
    
    finally:
        session.close()


@avaliacao_fisica_route.route('/ListarAvaliacaoFisica', methods=['GET'])
def ListarAvaliacaoFisica():
    avaliacao_fisica = AvaliacaoFisica("", "", "", "", "", "", "")
    session = sessionmaker(bind=engine)()
    try:
        result = avaliacao_fisica.ListarAvaliacaoFisica(session)
        if result:
            avaliacoes_fisicas = [
                {"id_avaliacao_fisica": row[0], "altura": row[1], "peso": row[2], "observacoes": row[3], "biotipo": row[4], "medidas": row[5], "instrutor_NIT": row[6], "aluno_matricula": row[7]}
                for row in result
            ]
            session.commit()
            return jsonify({"avaliacoes fisicas": avaliacoes_fisicas}), 200
    
        elif result == []:
            session.commit()
            return jsonify({"mensagem": "Nenhuma avaliação física encontrada"}), 404
    
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao listar avaliação física", "erro": str(e)}), 404
    
    finally:
        session.close()



@avaliacao_fisica_route.route('/FormAtualizarAvaliacaoFisica/<int:id_avaliacao_fisica>', methods=['GET'])
def FormAtualizarAvaliacaoFisica(id_avaliacao_fisica):
    avaliacao_fisica = AvaliacaoFisica("", "", "", "", "", "", "")
    session = sessionmaker(bind=engine)()
    
    try:
        resultAvaliacaoF = avaliacao_fisica.GetAvaliacaoFisica(id_avaliacao_fisica, session)
        if resultAvaliacaoF:
            avaliacao_fisica = {"id_avaliacao_fisica": resultAvaliacaoF[0], "altura": resultAvaliacaoF[1], "peso": resultAvaliacaoF[2], "observacoes": resultAvaliacaoF[3], "biotipo": resultAvaliacaoF[4], "medidas": resultAvaliacaoF[5], "instrutor_NIT": resultAvaliacaoF[6], "aluno_matricula": resultAvaliacaoF[7]}
            return jsonify({"avaliacao fisica": avaliacao_fisica}), 200
        elif resultAvaliacaoF is None:
            return jsonify({"mensagem": "Avaliação física não encontrada"}), 404
    
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao selecionar avaliação física", "erro": str(e)}), 404
    
    finally:
        session.close()
        


@avaliacao_fisica_route.route('/AtualizarAvaliacaoFisica/<int:id_avaliacao_fisica>', methods=['PUT'])
def AtualizarAvaliacaoFisica(id_avaliacao_fisica):
    data = request.get_json()  # Obtém o JSON enviado
    altura = data.get('altura')
    peso = data.get('peso')
    observacoes = data.get('observacoes')
    biotipo = data.get('biotipo')
    medidas = data.get('medidas')
    matricula = data.get('aluno_matricula')
    instrutor_NIT = data.get('instrutor_NIT')
    avaliacao_fisica = AvaliacaoFisica(altura, peso, observacoes, biotipo, medidas, matricula, instrutor_NIT)
    
    session = sessionmaker(bind=engine)()
    
    try:
        ids = avaliacao_fisica.AtualizarAvaliacaoFisica(id_avaliacao_fisica, session)
        session.commit()
        if ids is None:
            return jsonify({"mensagem": "Avaliação física não encontrada"}), 404
        return jsonify({"mensagem": "Avaliação física atualizada com sucesso!"}), 200
    
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao atualizar avaliação física", "erro": str(e)}), 404
    
    finally:
        session.close()

@avaliacao_fisica_route.route('/ExcluirAvaliacaoFisica/<int:id_avaliacao_fisica>', methods=['DELETE'])
def ExcluirAvaliacaoFisica(id_avaliacao_fisica):
    avaliacao_fisica = AvaliacaoFisica("", "", "", "", "", "", "")
    session = sessionmaker(bind=engine)()
    try:
        rowsResult = avaliacao_fisica.ExcluirAvaliacaoFisica(id_avaliacao_fisica, session)
        session.commit()
        if rowsResult == 0:
            return jsonify({"mensagem": "Avaliação física não encontrada"}), 404
        return jsonify({"mensagem": "Avaliação física excluída com sucesso!"}), 200
    
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        return jsonify({"mensagem": "Erro ao excluir avaliação física", "erro": str(e)}), 404
    
    finally:
        session.close()
        