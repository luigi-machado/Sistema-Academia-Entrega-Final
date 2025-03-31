from dataclasses import dataclass
from sqlalchemy.sql import text
from typing import Optional

@dataclass
class Usuario:
    username: str
    password: str
    is_adm:bool
    nit : str


    def Login(self, session):
        query = text("""SELECT * FROM mydb.usuario WHERE username = :username""")
        params = {
            "username": self.username
        }
        result = session.execute(query, params)
        user = result.fetchone()
        return user
        


    def CadastrarUser(self, session):
        query = text("""
        INSERT INTO mydb.usuario (username,funcionario_NIT, senha_hash, is_admin)
        VALUES (:username,:funcionario_NIT, :password, :is_adm)
        RETURNING id_usuario
        """)
        params = {
            "username": self.username,
            "password": self.password,
            "is_adm": self.is_adm,
            "funcionario_NIT": self.nit
        }
        session.execute(query, params)


    def AtualizarUsuario(self, session):
        query = text("""
        UPDATE mydb.usuario SET
        username = :username,
        senha_hash = :password,
        is_admin = :is_adm
        WHERE funcionario_NIT = :funcionario_NIT
        """)
        params = {
            "username": self.username,
            "password": self.password,
            "is_adm": self.is_adm,
            "funcionario_NIT": self.nit
        }
        session.execute(query, params)
        

    
