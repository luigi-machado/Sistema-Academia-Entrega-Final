from dataclasses import dataclass
from sqlalchemy.sql import text

@dataclass
class Visitante:
    nome: str
    data_ultima_visita: str
    telefone: str
    qunt_visitas: int

    def CadastrarVisitante(self, session):
        query = text("""
        INSERT INTO mydb.visitante (nome, data_ultima_visita, telefone, qunt_visitas) 
        VALUES (:nome, :data_ultima_visita, :telefone, :qunt_visitas) 
        """)
        params = {
            "nome": self.nome,
            "data_ultima_visita": self.data_ultima_visita,
            "telefone": self.telefone,
            "qunt_visitas": self.qunt_visitas,
        }
        session.execute(query, params)

    def AtualizarVisitante(self, id_visitante, session):
        query = text("""
        UPDATE mydb.visitante SET
        nome = :nome,
        data_ultima_visita = :data_ultima_visita,
        telefone = :telefone,
        qunt_visitas = :qunt_visitas
        WHERE id_visitante = :id_visitante
        RETURNING id_visitante
        """)
        params = {
            "nome": self.nome,
            "data_ultima_visita": self.data_ultima_visita,
            "telefone": self.telefone,
            "qunt_visitas": self.qunt_visitas,
            "id_visitante": id_visitante
        }
        result = session.execute(query, params)
        id = result.fetchone()
        return id
        
    def ExcluirVisitante(self, id_visitante, session):
        query = text("DELETE FROM mydb.visitante WHERE id_visitante = :id_visitante")
        params = {"id_visitante": id_visitante}
        result = session.execute(query, params)
        return result.rowcount

    def GetVisitante(self, id_visitante, session):
        query = text("SELECT * FROM mydb.visitante WHERE id_visitante = :id_visitante")
        params = {"id_visitante": id_visitante}
        result = session.execute(query, params)
        return result.fetchone()
            
    def ListarVisitantes(self, session):
        query = text("""SELECT * FROM mydb.visitante""")
        result = session.execute(query)
        return result.fetchall()

