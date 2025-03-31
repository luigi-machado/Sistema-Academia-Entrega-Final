from dataclasses import dataclass
from sqlalchemy.sql import text

@dataclass
class Treino:
    objetivo: str
    dificuldade: str

    def CadastrarTreino(self, session):
        query = text("""
        INSERT INTO mydb.treino (objetivo, dificuldade) 
        VALUES (:objetivo, :dificuldade) 
        RETURNING id_treino
        """)
        params = {
            "objetivo": self.objetivo,
            "dificuldade": self.dificuldade
        }
        id = session.execute(query, params)
        id = id.fetchone()[0]
        return id

    def ListarTreinos(self, session):
        query = text("""
        SELECT * FROM mydb.treino
        """)
        return session.execute(query).fetchall()
    
    def CadastrarTreinoExercicio(self, id_treino, id_exercicio, session):
        query = text("""
        INSERT INTO mydb.exercicio_has_treino (treino_id_treino, exercicio_id_exercicio)
        VALUES (:id_treino, :id_exercicio) 
        """)
        params = {
            "id_treino": id_treino,
            "id_exercicio": id_exercicio
        }
        session.execute(query, params)


    def GetAllTreino(self, id_treino, session):
        query = text("""
        SELECT 
        t.*,
        COALESCE(array_agg(e.id_exercicio), '{}') AS ids_exercicio
        FROM mydb.treino t
        LEFT JOIN mydb.exercicio_has_treino eht ON t.id_treino = eht.treino_id_treino
        LEFT JOIN mydb.exercicio e ON eht.exercicio_id_exercicio = e.id_exercicio
        WHERE t.id_treino = :id_treino
        GROUP BY t.id_treino;

        """)
        params = {
            "id_treino": id_treino
        }
        return session.execute(query, params).fetchone()
    
    def AtualizarTreino(self, id_treino, session):
        query = text("""
        UPDATE mydb.treino SET
        objetivo = :objetivo,
        dificuldade = :dificuldade
        WHERE id_treino = :id_treino
        """)
        params = {
            "objetivo": self.objetivo,
            "dificuldade": self.dificuldade,
            "id_treino": id_treino
        }
        session.execute(query, params)

    def ExcluirTreino(self, id_treino, session):
        query = text("DELETE FROM mydb.treino WHERE id_treino = :id_treino")
        params = {"id_treino": id_treino}
        session.execute(query, params)


    def ExcluirTreinoExercicio(self, id_treino, session):
        query = text("DELETE FROM mydb.exercicio_has_treino WHERE treino_id_treino = :id_treino")
        params = {"id_treino": id_treino}
        session.execute(query, params)