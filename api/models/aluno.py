from dataclasses import dataclass
import secrets
from sqlalchemy.orm import sessionmaker
from BD.bd import engine
from sqlalchemy.sql import text

@dataclass
class Aluno:
    matricula: str
    nome: str
    data_nascimento: str
    cpf: str
    email: str
    telefone: str
    plano_id: int


    def CadastrarAluno(self, session):
        query = text("""
        INSERT INTO mydb.aluno (matricula, nome, data_nascimento, cpf, email, telefone, plano_id_plano) 
        VALUES (:matricula, :nome, :data_nascimento, :cpf, :email, :telefone, :plano_id) 
        """)
        params = {
            "matricula": self.matricula,
            "nome": self.nome,
            "data_nascimento": self.data_nascimento,
            "cpf": self.cpf,
            "email": self.email,
            "telefone": self.telefone,
            "plano_id": int(self.plano_id)
        }
        session.execute(query, params)



    def AtualizarAluno(self, session):
        query = text("""
        UPDATE mydb.aluno SET
        nome = :nome, 
        data_nascimento = :data_nascimento, 
        cpf = :cpf, 
        email = :email, 
        telefone = :telefone,
        plano_id_plano = :plano_id
        WHERE matricula = :matricula
        RETURNING plano_id_plano
        """)
        params = {
            "nome": self.nome,
            "data_nascimento": self.data_nascimento,
            "cpf": self.cpf,
            "email": self.email,
            "telefone": self.telefone,
            "matricula": self.matricula,
            "plano_id": self.plano_id
        }
        result = session.execute(query, params)
        id = result.fetchone()
        return id
        
            

    def ExcluirAluno(self, matricula, session):
            query = text("DELETE FROM mydb.aluno WHERE matricula = :matricula")
            params = {"matricula": matricula}
            session.execute(query, params)
            


    def ListarAluno(self, session):    
            query = text("""SELECT * FROM mydb.aluno""")
            result = session.execute(query)
            return result.fetchall()
    
    
    def CadastrarAlunoAula(self, id_aula, session):
        query = text("""
        INSERT INTO mydb.aula_has_aluno (aula_id_aula, aluno_matricula) 
        VALUES (:id_aula, :matricula) 
        """)
        params = {
            "id_aula": id_aula,
            "matricula": self.matricula
        }
        session.execute(query, params)

    def ExcluirAlunoDeAulas(self, session):
        query = text("DELETE FROM mydb.aula_has_aluno WHERE aluno_matricula = :aluno_matricula")
        params = {"aluno_matricula": self.matricula}
        session.execute(query, params)
        
    def ExcluirAlunoDeTreinos(self, session):
        query = text("DELETE FROM mydb.treino_has_aluno WHERE aluno_matricula = :aluno_matricula")
        params = {"aluno_matricula": self.matricula}
        session.execute(query, params) 
    
    def CadastrarAlunoTreino(self, id_treino, session):
        query = text("""
        INSERT INTO mydb.treino_has_aluno (treino_id_treino, aluno_matricula) 
        VALUES (:id_treino, :matricula) 
        """)
        params = {
            "id_treino": id_treino,
            "matricula": self.matricula
        }
        session.execute(query, params)

    
        


    def GetAllAluno(self, session):
        query = text("""SELECT 
            a.matricula, a.nome, a.data_nascimento, a.cpf, a.email, a.telefone,
            e.id_endereco, e.logradouro, e.cep, e.rua, e.num_casa, e.bairro, e.cidade, e.aluno_matricula, 
            p.id_plano, p.nome AS nome_plano, p.valor AS valor_plano, p.descricao AS descricao_plano,
            ARRAY_AGG(DISTINCT t.id_treino) AS treinos,
            ARRAY_AGG(DISTINCT aa.aula_id_aula) AS aulas
        FROM mydb.aluno a
        LEFT JOIN mydb.endereco e ON a.matricula = e.aluno_matricula
        LEFT JOIN mydb.plano p ON a.plano_id_plano = p.id_plano
        LEFT JOIN mydb.treino_has_aluno ta ON a.matricula = ta.aluno_matricula
        LEFT JOIN mydb.treino t ON ta.treino_id_treino = t.id_treino
        LEFT JOIN mydb.aula_has_aluno aa ON a.matricula = aa.aluno_matricula
        WHERE a.matricula = :matricula
        GROUP BY 
            a.matricula, a.nome, a.data_nascimento, a.cpf, a.email, a.telefone,
            e.id_endereco, e.logradouro, e.cep, e.rua, e.num_casa, e.bairro, e.cidade, e.aluno_matricula,
            p.id_plano, p.nome, p.valor, p.descricao;
        """)
        params = {"matricula": self.matricula}
        result = session.execute(query, params)
        return result.fetchone()
   
    @staticmethod
    def gerar_matricula(session, nome, cpf):
        letras_nome = nome[:2].upper() if len(nome) >= 2 else nome[0].upper() + "X"
        cpf_part = cpf.replace(".", "").replace("-", "")[:2]
        aleatorio = secrets.randbelow(90000) + 10000

        while True:
            matricula = f"{letras_nome}{cpf_part}{aleatorio}"  

            query = text("SELECT matricula FROM mydb.aluno WHERE matricula = :matricula")
            result = session.execute(query, {"matricula": matricula}).fetchone()

            if not result:
                return matricula