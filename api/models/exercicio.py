from sqlalchemy.sql import text
from dataclasses import dataclass

@dataclass
class Exercicio:
    nome: str
    musculo: str
    series: int
    repeticoes: int

    def CadastrarExercicio(self, session):
        query = text("""
        INSERT INTO mydb.exercicio (nome, musculo, series, repeticoes) 
        VALUES (:nome, :musculo, :series, :repeticoes) 
        RETURNING id_exercicio
        """)
        params = {
            "nome": self.nome,
            "musculo": self.musculo,
            "series": self.series,
            "repeticoes": self.repeticoes
        }
        id = session.execute(query, params)
        id = id.fetchone()[0]
        return id

    def ListarExercicio(self, session):
        query = text("""
        SELECT * FROM mydb.exercicio
        """)
        return session.execute(query).fetchall()
    
    def CadastrarExercicioAparelho(self, id_exercicio, id_aparelho, session):
        query = text("""
        INSERT INTO mydb.exercicio_has_aparelho (exercicio_id_exercicio, aparelho_id_aparelho)
        VALUES (:id_exercicio, :id_aparelho) 
        """)
        params = {
            "id_exercicio": id_exercicio,
            "id_aparelho": id_aparelho
        }
        session.execute(query, params)
        

    def ExcluirExercicioAparelho(self, id_exercicio, session):
        query = text("DELETE FROM mydb.exercicio_has_aparelho WHERE exercicio_id_exercicio = :id_exercicio")
        params = {"id_exercicio": id_exercicio}
        session.execute(query, params)



    def GetAllExercicio(self, id_exercicio, session):
        query = text("""
        SELECT 
        e.*, 
        COALESCE(array_agg(DISTINCT a.id_aparelho), '{}') AS ids_aparelho
        FROM mydb.exercicio e
        LEFT JOIN mydb.exercicio_has_aparelho ea ON e.id_exercicio = ea.exercicio_id_exercicio
        LEFT JOIN mydb.aparelho a ON ea.aparelho_id_aparelho = a.id_aparelho
        WHERE e.id_exercicio = :id_exercicio
        GROUP BY e.id_exercicio;

        """)
        params = {
            "id_exercicio": id_exercicio
        }
        return session.execute(query, params).fetchone()
    
    def AtualizarExercicio(self, id_exercicio, session):
        query = text("""
        UPDATE mydb.exercicio SET
        nome = :nome,
        musculo = :musculo,
        series = :series,
        repeticoes = :repeticoes
        WHERE id_exercicio = :id_exercicio
        """)
        params = {
            "nome": self.nome,
            "musculo": self.musculo,
            "series": self.series,
            "repeticoes": self.repeticoes,
            "id_exercicio": id_exercicio
        }
        session.execute(query, params)


    def ExcluirExercicio(self, id_exercicio, session):
        query = text("DELETE FROM mydb.exercicio WHERE id_exercicio = :id_exercicio")
        params = {"id_exercicio": id_exercicio} 
        session.execute(query, params)

  

    