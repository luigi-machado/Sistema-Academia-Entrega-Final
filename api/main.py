from flask import Flask
from routes.ctlLogin import login_route
from routes.ctlAluno import aluno_route
from routes.ctlPlano import plano_route
from routes.ctlAula import aula_route
from routes.ctlTreino import treino_route
from routes.ctlVisitante import visitante_route
from routes.ctlGestMaterial import gestMaterial_route
from routes.ctlFuncionario import funcionario_route
from routes.ctlAvFisica import avaliacao_fisica_route
from routes.ctlExercicio import exercicio_route
from flask_cors import CORS
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

app.secret_key = os.getenv("SECRET_KEY")
CORS(app, supports_credentials=True)

app.register_blueprint(login_route)
app.register_blueprint(aluno_route)
app.register_blueprint(plano_route)
app.register_blueprint(aula_route)
app.register_blueprint(visitante_route)
app.register_blueprint(gestMaterial_route)
app.register_blueprint(funcionario_route)
app.register_blueprint(treino_route)
app.register_blueprint(avaliacao_fisica_route)
app.register_blueprint(exercicio_route)



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
