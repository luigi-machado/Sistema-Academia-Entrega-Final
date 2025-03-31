from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()

HOST = os.getenv("HOST")
PASSWORD = os.getenv("PASSWORD_BD")
USER = os.getenv("USER")
DB = os.getenv("DB")

DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}/{DB}"
engine = create_engine(DATABASE_URL)

if __name__ == '__main__':
    try:
        with engine.connect() as connection:
            print("Conexão bem-sucedida!")
    except Exception as e:
        print(f"Erro na conexão: {e}")