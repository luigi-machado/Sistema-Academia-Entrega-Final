from dataclasses import dataclass
from sqlalchemy.orm import sessionmaker
from BD.bd import engine
from sqlalchemy.sql import text

@dataclass
class Aparelho:
    nome: str
    numero_serie: int
    disponibilidade: str

    def CadastrarAparelho(self, session):
        query = text("""
        INSERT INTO mydb.aparelho (nome, numero_serie, disponibilidade) 
        VALUES (:nome, :numero_serie, :disponibilidade) 
        """)
        params = {
            "nome": self.nome,
            "numero_serie": self.numero_serie,
            "disponibilidade": self.disponibilidade
        }
        session.execute(query, params)


    def AtualizarAparelho(self, id_aparelho, session):
            query = text("""
            UPDATE mydb.aparelho SET
            nome = :nome,
            numero_serie = :numero_serie, 
            disponibilidade = :disponibilidade
            WHERE id_aparelho = :id_aparelho
            """)
            params = {
                "nome": self.nome,
                "numero_serie": self.numero_serie,
                "disponibilidade": self.disponibilidade,
                "id_aparelho": id_aparelho
            }
            session.execute(query, params)
    
            

    def ExcluirAparelho(self, id_aparelho, session):
        query = text("DELETE FROM mydb.aparelho WHERE id_aparelho = :id_aparelho")
        params = {"id_aparelho": id_aparelho}
        session.execute(query, params)



    def GetAparelho(self, id_aparelho, session):
        query = text("SELECT * FROM mydb.aparelho WHERE id_aparelho = :id_aparelho")
        params = {"id_aparelho": id_aparelho}
        result = session.execute(query, params)
        return result.fetchone()

            
    def ListarAparelhos(self, session):
        query = text("""SELECT * FROM mydb.aparelho""")
        result = session.execute(query)
        return result.fetchall()
    


    

    

