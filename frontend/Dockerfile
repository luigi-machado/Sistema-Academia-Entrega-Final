FROM node:23-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Copia apenas os arquivos necessários para instalar as dependências primeiro
COPY package.json  ./

# Instala as dependências do projeto
RUN npm install .
# Copia o restante dos arquivos do projeto para o container
COPY . .

# Expõe a porta padrão do React
EXPOSE 5173

# Comando para iniciar a aplicação React
CMD ["npm","run", "dev"]

