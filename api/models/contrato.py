from dataclasses import dataclass
from sqlalchemy.sql import text

@dataclass
class Contrato:
    salario: float
    data_contratacao: str
    data_final: str
    nit : str


    def CadastrarContrato(self, session):
        query = text("""INSERT INTO mydb.contrato (salario, data_contratacao, data_final, funcionario_nit)
        VALUES (:salario, :data_contratacao, :data_final, :funcionario_nit)
            """)
        
        params = {
            "salario": self.salario,
            "data_contratacao": self.data_contratacao,
            "data_final": self.data_final,
            "funcionario_nit": self.nit
        }
        session.execute(query, params)

    def AtualizarContrato(self, session):
        query = text("""
        UPDATE mydb.contrato SET
        salario = :salario,
        data_contratacao = :data_contratacao,
        data_final = :data_final
        WHERE funcionario_nit = :funcionario_nit
        """)
        params = {
            "salario": self.salario,
            "data_contratacao": self.data_contratacao,
            "data_final": self.data_final,
            "funcionario_nit": self.nit
        }
        session.execute(query, params)
        
