from dataclasses import dataclass
from sqlalchemy.sql import text


@dataclass
class Plano:
    nome: str
    valor: float
    descricao: str


    def CadastrarPlano(self,session):
        query = text("""
        INSERT INTO mydb.plano (nome, valor, descricao) 
        VALUES (:nome, :valor, :descricao) 
        """)
        params = {
            "nome": self.nome,
            "valor": self.valor,
            "descricao": self.descricao
        }
        session.execute(query, params)
        


    def ListarPlano(self, session):
        query = text("""
        SELECT * FROM mydb.plano
        """)
        result = session.execute(query)
        return result.fetchall()
    

    def GetPlano(self, id_plano, session):
        query = text("""
        SELECT * FROM mydb.plano WHERE id_plano = :id_plano
        """)
        params = {
            "id_plano": id_plano
        }
        result = session.execute(query, params)
        return result.fetchone()
    
    def AtualizarPlano(self, id_plano, session):
        query = text("""
        UPDATE mydb.plano SET
        nome = :nome, 
        valor = :valor, 
        descricao = :descricao 
        WHERE id_plano = :id_plano
        """)
        params = {
            "nome": self.nome,
            "valor": self.valor,
            "descricao": self.descricao,
            "id_plano": id_plano
        }
        session.execute(query, params)


    def ExcluirPlano(self, id_plano, session):
        query = text("""
        DELETE FROM mydb.plano WHERE id_plano = :id_plano
        """)
        params = {
            "id_plano": id_plano
        }
        session.execute(query, params)