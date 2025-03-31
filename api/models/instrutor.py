from dataclasses import dataclass
from models.funcionario import Funcionario
from sqlalchemy.sql import text

@dataclass
class Instrutor():
    nit: str
    grau_academico: str

    def CadastrarInstrutor(self, session):
        query_instrutor = text("""
        INSERT INTO mydb.instrutor (funcionario_NIT, grau_academico)
        VALUES (:funcionario_NIT, :grau_academico)
        """)
        params_instrutor = {
            "funcionario_NIT": self.nit,
            "grau_academico": self.grau_academico
        }
        session.execute(query_instrutor, params_instrutor)

    def AtualizarInstrutor(self, session):
        query = text("""
        UPDATE mydb.instrutor SET
        grau_academico = :grau_academico
        WHERE funcionario_NIT = :funcionario_NIT
        """)
        params = {
            "grau_academico": self.grau_academico,
            "funcionario_NIT": self.nit
        }        
        session.execute(query, params)
    
    def ListarInstrutores(self, session):
        query = text("""
        SELECT i.*, f.*
        FROM mydb.instrutor i
        JOIN mydb.funcionario f ON i.funcionario_NIT = f.NIT
        """)
        return session.execute(query).fetchall()