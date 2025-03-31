from dataclasses import dataclass
from sqlalchemy.sql import text

@dataclass
class Funcionario:
    nit: str
    nome: str
    data_nascimento: str
    cpf: str
    email: str
    telefone: str
    


    def  ListarFuncionarios(self, session):
        query = text("""
        SELECT * FROM mydb.funcionario
        """)
        result = session.execute(query)
        funcionarios = result.fetchall()
        return funcionarios
    

    def CadastrarFuncionario(self, session):
        query = text("""
        INSERT INTO mydb.funcionario (nit, nome, data_nascimento, cpf, email, telefone) 
        VALUES (:nit, :nome, :data_nascimento, :cpf, :email, :telefone) 
        """)
        params = {
            "nit": self.nit,
            "nome": self.nome,
            "data_nascimento": self.data_nascimento,
            "cpf": self.cpf,
            "email": self.email,
            "telefone": self.telefone
        }
        session.execute(query, params)


    def GetAllFuncionario(self, session):
        query = text("""
        SELECT 
            f.*, u.*, a.*, i.*, c.*, e.*
        FROM mydb.funcionario f
        LEFT JOIN mydb.usuario u ON f.NIT = u.funcionario_NIT
        LEFT JOIN mydb.administrador a ON f.NIT = a.funcionario_NIT
        LEFT JOIN mydb.instrutor i ON f.NIT = i.funcionario_NIT
        LEFT JOIN mydb.contrato c ON f.NIT = c.funcionario_NIT
        LEFT JOIN mydb.endereco e ON f.NIT = e.funcionario_NIT
        WHERE f.NIT = :nit;		
        """)
        params = {
            "nit": self.nit
        }
        result = session.execute(query, params)
        funcionario = result.fetchone()
        return funcionario
    
    def AtualizarFuncionario(self, session):
        query = text("""
        UPDATE mydb.funcionario SET
        nome = :nome,
        data_nascimento = :data_nascimento,
        cpf = :cpf,
        email = :email,
        telefone = :telefone
        WHERE nit = :nit
        """)
        params = {
            "nome": self.nome,
            "data_nascimento": self.data_nascimento,
            "cpf": self.cpf,
            "email": self.email,
            "telefone": self.telefone,
            "nit": self.nit
        }
        session.execute(query, params)

    def ExcluirFuncionario(self, nit, session):
        query = text("DELETE FROM mydb.funcionario WHERE NIT = :nit")
        params = {"nit": nit}
        session.execute(query, params)

       