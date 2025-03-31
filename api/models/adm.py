from dataclasses import dataclass
from models.funcionario import Funcionario
from sqlalchemy.sql import text

@dataclass
class Adm():
    nit: str
    cargo: str

    def CadastrarAdm(self, session):
        query_administrador = text("""
        INSERT INTO mydb.administrador (funcionario_NIT, cargo)
        VALUES (:funcionario_NIT, :cargo)
        """)
        params_administrador = {
            "funcionario_NIT": self.nit,
            "cargo": self.cargo
        }
        session.execute(query_administrador, params_administrador)

    def AtualizarAdm(self, session):
        query = text("""
        UPDATE mydb.administrador SET
        cargo = :cargo
        WHERE funcionario_NIT = :funcionario_NIT
        """)
        params = {
            "cargo": self.cargo,
            "funcionario_NIT": self.nit
        }
        session.execute(query, params)
