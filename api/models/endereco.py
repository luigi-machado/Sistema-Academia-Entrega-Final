from BD.bd import engine
from dataclasses import dataclass
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
@dataclass
class Endereco:
    logradouro: str
    cep: str
    rua: str
    num_casa: int
    bairro: str
    cidade: str 
    aluno_matricula: str = None
    funcionario_nit: str = None
    

    def CadastrarEndereco(self , session):
            query = text("""INSERT INTO mydb.endereco (logradouro, cep, rua, num_casa, bairro, cidade, aluno_matricula, funcionario_nit)
            VALUES (:logradouro, :cep, :rua, :num_casa, :bairro, :cidade, :aluno_matricula, :funcionario_nit)
            RETURNING id_endereco""")
            params = {
                "logradouro": self.logradouro,
                "cep": self.cep,
                "rua": self.rua,
                "num_casa": int(self.num_casa),
                "bairro": self.bairro,
                "cidade": self.cidade,
                "aluno_matricula": self.aluno_matricula if self.aluno_matricula else None,
                "funcionario_nit": self.funcionario_nit if self.funcionario_nit else None
            }
            session.execute(query, params)
            
    
    def AtualizarEndereco(self, aluno_matricula, session):
        query = text("""
        UPDATE mydb.endereco SET
        logradouro = :logradouro,
        cep = :cep,
        rua = :rua,
        num_casa = :num_casa,
        bairro = :bairro,   
        cidade = :cidade
        WHERE aluno_matricula = :aluno_matricula
        """)
        params = {
            "logradouro": self.logradouro,
            "cep": self.cep,
            "rua": self.rua,
            "num_casa": self.num_casa,
            "bairro": self.bairro,
            "cidade": self.cidade,
            "aluno_matricula": aluno_matricula
        }
        session.execute(query, params)

    def AtualizarEnderecoFunc(self, funcionario_nit, session):
        query = text("""
        UPDATE mydb.endereco SET
        logradouro = :logradouro,
        cep = :cep,
        rua = :rua,
        num_casa = :num_casa,
        bairro = :bairro,   
        cidade = :cidade
        WHERE funcionario_nit = :funcionario_nit
        """)
        params = {
            "logradouro": self.logradouro,
            "cep": self.cep,
            "rua": self.rua,
            "num_casa": self.num_casa,
            "bairro": self.bairro,
            "cidade": self.cidade,
            "funcionario_nit": funcionario_nit
        }
        session.execute(query, params)
            
    
    def GetEndereco(self, id_endereco):
        try:
            sessionLocal = sessionmaker(bind=engine)
            session = sessionLocal()
            query = text("""SELECT * FROM mydb.endereco WHERE id_endereco = :id_endereco""")
            params = {
                "id_endereco": id_endereco
            }
            result = session.execute(query, params)
            endereco = result.fetchall()
            session.commit()
            return endereco
        except Exception as e:
            return str(e)
        finally:
            session.close()
    