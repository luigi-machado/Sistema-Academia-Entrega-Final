DROP SCHEMA IF EXISTS mydb CASCADE;
CREATE SCHEMA mydb;
SET search_path TO mydb;

-- Criando a tabela plano antes da aluno para evitar erro de referência
CREATE TABLE plano (
    id_plano SERIAL PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    valor FLOAT NOT NULL, 
    descricao VARCHAR(200) NOT NULL
);

CREATE TABLE aluno (
    matricula VARCHAR(45) PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(45) UNIQUE NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    telefone VARCHAR(45) NOT NULL,
    plano_id_plano INT NULL REFERENCES plano(id_plano) ON DELETE SET NULL
);

CREATE TABLE funcionario (
    NIT VARCHAR(45) PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(45) UNIQUE NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    telefone VARCHAR(45) NOT NULL
);

CREATE TABLE endereco (
    id_endereco SERIAL PRIMARY KEY,
    logradouro VARCHAR(45) NOT NULL,
    cep VARCHAR(45) NOT NULL,
    rua VARCHAR(45) NOT NULL,
    num_casa INT NOT NULL,
    bairro VARCHAR(45) NOT NULL,
    cidade VARCHAR(45) NOT NULL,
    aluno_matricula VARCHAR(45) REFERENCES mydb.aluno(matricula) ON DELETE CASCADE, -- Correção: Adicionada coluna aluno_matricula
    funcionario_nit VARCHAR(45) REFERENCES mydb.funcionario(NIT) ON DELETE CASCADE, -- Correção: Adicionada coluna funcionario_nit
    CHECK (
        (aluno_matricula IS NOT NULL AND funcionario_nit IS NULL) OR
        (aluno_matricula IS NULL AND funcionario_nit IS NOT NULL)
    ) -- Correção: Regra de integridade mantida para evitar referências duplas
);

CREATE TABLE avaliacao_fisica (
    id_avaliacao_fisica SERIAL PRIMARY KEY,
    altura FLOAT NOT NULL, 
    peso FLOAT NOT NULL, 
    observacoes VARCHAR(200),
    biotipo VARCHAR(45) NOT NULL,
    medidas VARCHAR(200) NOT NULL,
    instrutor_NIT VARCHAR(45) NOT NULL REFERENCES mydb.funcionario(NIT) ON DELETE CASCADE,
    aluno_matricula VARCHAR(45) NOT NULL REFERENCES mydb.aluno(matricula) ON DELETE CASCADE
);

CREATE TABLE treino (
    id_treino SERIAL PRIMARY KEY,
    objetivo VARCHAR(45) NOT NULL,
    dificuldade VARCHAR(45) NOT NULL
);

CREATE TABLE treino_has_aluno (
    treino_id_treino INT NOT NULL REFERENCES mydb.treino(id_treino) ON DELETE CASCADE,
    aluno_matricula VARCHAR(45) NOT NULL REFERENCES mydb.aluno(matricula) ON DELETE CASCADE,
    PRIMARY KEY (treino_id_treino, aluno_matricula)
);

CREATE TABLE exercicio (
    id_exercicio SERIAL PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    musculo VARCHAR(45) NOT NULL,
    series INT NOT NULL,
    repeticoes INT NOT NULL
);

CREATE TABLE exercicio_has_treino (
    exercicio_id_exercicio INT NOT NULL REFERENCES mydb.exercicio(id_exercicio) ON DELETE CASCADE,
    treino_id_treino INT NOT NULL REFERENCES mydb.treino(id_treino) ON DELETE CASCADE,
    PRIMARY KEY (exercicio_id_exercicio, treino_id_treino)
);

CREATE TABLE aparelho (
    id_aparelho SERIAL PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    numero_serie VARCHAR(45) NOT NULL, 
    disponibilidade VARCHAR(45) NOT NULL
);

CREATE TABLE exercicio_has_aparelho (
    exercicio_id_exercicio INT NOT NULL REFERENCES mydb.exercicio(id_exercicio) ON DELETE CASCADE,
    aparelho_id_aparelho INT NOT NULL REFERENCES mydb.aparelho(id_aparelho) ON DELETE CASCADE,
    PRIMARY KEY (exercicio_id_exercicio, aparelho_id_aparelho)
);

CREATE TABLE aula (
    id_aula SERIAL PRIMARY KEY,
    horario VARCHAR(45) NOT NULL,
    tipo VARCHAR(45) NOT NULL,
    sala VARCHAR(45) NOT NULL
);

CREATE TABLE aula_has_aluno (
    aula_id_aula INT NOT NULL REFERENCES mydb.aula(id_aula) ON DELETE CASCADE,
    aluno_matricula VARCHAR(45) NOT NULL REFERENCES mydb.aluno(matricula) ON DELETE CASCADE,
    PRIMARY KEY (aula_id_aula, aluno_matricula)
);

CREATE TABLE aula_has_funcionario (
    aula_id_aula INT NOT NULL REFERENCES mydb.aula(id_aula) ON DELETE CASCADE,
    funcionario_NIT VARCHAR(45) NOT NULL REFERENCES mydb.funcionario(NIT) ON DELETE CASCADE,
    PRIMARY KEY (aula_id_aula, funcionario_NIT)
);

CREATE TABLE visitante (
    id_visitante SERIAL PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    data_ultima_visita DATE NOT NULL,
    telefone VARCHAR(45) NOT NULL,
    qunt_visitas INT NOT NULL
);

CREATE TABLE administrador (
    funcionario_NIT VARCHAR(45) PRIMARY KEY UNIQUE NOT NULL REFERENCES mydb.funcionario(NIT) ON DELETE CASCADE,
    cargo VARCHAR(100) NOT NULL
);

CREATE TABLE instrutor (
    funcionario_NIT VARCHAR(45) PRIMARY KEY UNIQUE NOT NULL REFERENCES mydb.funcionario(NIT) ON DELETE CASCADE,
    grau_academico VARCHAR(45) NOT NULL
);

CREATE TABLE contrato (
    id_contrato SERIAL PRIMARY KEY,
    salario FLOAT NOT NULL, 
    data_contratacao DATE NOT NULL,
    data_final DATE, 
    funcionario_NIT VARCHAR(45) NOT NULL REFERENCES mydb.funcionario(NIT) ON DELETE CASCADE
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    funcionario_NIT VARCHAR(45) UNIQUE NOT NULL REFERENCES mydb.funcionario(NIT) ON DELETE CASCADE,
    username VARCHAR(45) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL, 
    is_admin BOOLEAN DEFAULT FALSE
);

-- Inserção de planos
INSERT INTO plano (nome, valor, descricao) VALUES
('Básico', 100.00, 'Acesso livre a equipamentos'),
('Premium', 150.00, 'Acesso livre + aulas coletivas'),
('VIP', 200.00, 'Acesso total + Personal Trainer'),
('Elite', 250.00, 'Acesso 24h + Nutricionista'),
('Executivo', 300.00, 'Treino VIP + Acompanhamento médico');

-- Inserção de alunos
INSERT INTO aluno (matricula, nome, data_nascimento, cpf, email, telefone, plano_id_plano) VALUES
('JO1201234', 'João Silva', '1995-06-15', '123.456.789-01', 'joao@email.com', '99999-9999', 1),
('MA9805678', 'Maria Souza', '1998-03-22', '987.654.321-02', 'maria@email.com', '98888-8888', 2),
('CA1103456', 'Carlos Pereira', '2000-05-30', '111.222.333-44', 'carlos@email.com', '97777-7777', 3),
('AN4409876', 'Ana Lima', '1997-08-12', '444.555.666-77', 'ana@email.com', '96666-6666', 4),
('BE9902468', 'Beatriz Almeida', '1999-12-20', '999.888.777-66', 'beatriz@email.com', '95555-5555', 5);

-- Inserção de funcionários (com NIT de 11 dígitos)
INSERT INTO funcionario (NIT, nome, data_nascimento, cpf, email, telefone) VALUES
('12345678901', 'Carlos Oliveira', '1980-02-10', '111.222.333-44', 'carlos@email.com', '97777-7777'),
('23456789012', 'Ana Lima', '1985-07-19', '555.666.777-88', 'ana@email.com', '96666-6666'),
('34567890123', 'Bruno Mendes', '1990-01-25', '222.333.444-55', 'bruno@email.com', '94444-4444'),
('45678901234', 'Fernanda Costa', '1988-11-05', '777.888.999-00', 'fernanda@email.com', '93333-3333'),
('56789012345', 'Ricardo Santos', '1982-04-18', '666.555.444-33', 'ricardo@email.com', '92222-2222');

-- Definir funções dos funcionários
INSERT INTO administrador (funcionario_NIT, cargo) VALUES 
('12345678901', 'Gerente'), 
('45678901234', 'Supervisor');

INSERT INTO instrutor (funcionario_NIT, grau_academico) VALUES 
('23456789012', 'Educação Física'), 
('34567890123', 'Esporte e Performance'), 
('56789012345', 'Treinamento Funcional');

INSERT INTO usuario (funcionario_NIT, username, senha_hash, is_admin) VALUES
('12345678901', 'carlos_admin', 'af316ecb91a8ee7ae99210702b2d4758f30cdde3bf61e3d8e787d74681f90a6e', TRUE),
('23456789012', 'ana_instrutora', 'e7bf382f6e5915b3f88619b866223ebf1d51c4c5321cccde2e9ff700a3259086', FALSE),
('34567890123', 'bruno_instrutor', '42caa4abb7b60f8f914e5bfb8e6511d7d9bd9817de719b74251755d97fe97bf1', FALSE),
('45678901234', 'fernanda_admin', '1c27099b3b84b13d0e3fbd299ba93ae7853ec1d0d3a4e5daa89e68b7ad59d7cb', TRUE),
('56789012345', 'ricardo_instrutor', '7da450ab64a26820e56dd73cd346950d656e60a20dba00bd4be9ced75ba7cdef', FALSE);

INSERT INTO endereco (logradouro, cep, rua, num_casa, bairro, cidade, aluno_matricula, funcionario_nit) VALUES
('Rua A', '12345-678', 'Av. Brasil', 10, 'Centro', 'São Paulo', 'JO1201234', NULL),
('Rua B', '23456-789', 'Rua das Flores', 25, 'Jardim', 'Rio de Janeiro', 'MA9805678', NULL),
('Rua C', '34567-890', 'Rua da Saúde', 30, 'Saúde', 'Belo Horizonte', 'CA1103456', NULL),
('Rua D', '45678-901', 'Avenida Fitness', 45, 'Academia', 'Curitiba', 'AN4409876', NULL),
('Rua E', '56789-012', 'Rua dos Atletas', 100, 'Esportes', 'Porto Alegre', 'BE9902468', NULL);

-- Inserção de endereços para funcionários
INSERT INTO endereco (logradouro, cep, rua, num_casa, bairro, cidade, aluno_matricula, funcionario_nit) VALUES
('Rua F', '67890-123', 'Av. Trabalho', 15, 'Centro', 'São Paulo', NULL, '12345678901'),
('Rua G', '78901-234', 'Rua do Exercício', 20, 'Bairro Azul', 'Rio de Janeiro', NULL, '23456789012'),
('Rua H', '89012-345', 'Rua da Força', 35, 'Musculação', 'Belo Horizonte', NULL, '34567890123'),
('Rua I', '90123-456', 'Avenida Saúde', 50, 'Condicionamento', 'Curitiba', NULL, '45678901234'),
('Rua J', '01234-567', 'Rua do Treino', 110, 'Performance', 'Porto Alegre', NULL, '56789012345');

-- Inserção de avaliações físicas
INSERT INTO avaliacao_fisica (altura, peso, observacoes, biotipo, medidas, instrutor_NIT, aluno_matricula) VALUES
(1.75, 70.5, 'Bom condicionamento', 'Atlético', 'Peito: 100cm, Cintura: 80cm', '23456789012', 'JO1201234'),
(1.68, 65.0, 'Médio condicionamento', 'Mesomorfo', 'Peito: 90cm, Cintura: 75cm', '23456789012', 'MA9805678'),
(1.82, 85.2, 'Excelente condicionamento', 'Atlético', 'Peito: 110cm, Cintura: 85cm', '34567890123', 'CA1103456'),
(1.60, 55.4, 'Bom condicionamento', 'Ectomorfo', 'Peito: 85cm, Cintura: 70cm', '56789012345', 'AN4409876'),
(1.90, 95.3, 'Ótimo condicionamento', 'Mesomorfo', 'Peito: 115cm, Cintura: 90cm', '56789012345', 'BE9902468');

-- Inserção de contratos
INSERT INTO contrato (salario, data_contratacao, data_final, funcionario_NIT) VALUES
(5000.00, '2024-01-10', NULL, '12345678901'),
(4000.00, '2024-02-15', NULL, '23456789012'),
(4500.00, '2024-03-01', NULL, '34567890123'),
(4800.00, '2024-03-15', NULL, '45678901234'),
(4200.00, '2024-04-01', NULL, '56789012345');

-- Inserção de aulas
INSERT INTO aula (horario, tipo, sala) VALUES
('08:00', 'Yoga', 'Sala 1'),
('10:00', 'Musculação', 'Sala 2'),
('14:00', 'Pilates', 'Sala 3'),
('18:00', 'Crossfit', 'Sala 4'),
('20:00', 'Funcional', 'Sala 5');

-- Inserção de exercícios
INSERT INTO exercicio (nome, musculo, series, repeticoes) VALUES
('Supino Reto', 'Peito', 4, 10),
('Agachamento', 'Pernas', 4, 12),
('Remada Curvada', 'Costas', 3, 10),
('Rosca Direta', 'Bíceps', 3, 12),
('Tríceps Testa', 'Tríceps', 3, 12);

-- Inserção de aparelhos
INSERT INTO aparelho (nome, numero_serie, disponibilidade) VALUES
('Leg Press', 'AP001', 'Disponível'),
('Esteira', 'AP002', 'Em uso'),
('Supino Reto', 'AP003', 'Disponível'),
('Pull Down', 'AP004', 'Em manutenção'),
('Crossover', 'AP005', 'Disponível');