
import "../Assets/MenuBar.css"


export default function MenuBar({isAdm}){
    if (isAdm){
        return (
        <div class="frame-8">
            <a href="/funcionarios"><div class="frame-item"><span>Funcionário</span></div></a>
            <a href="/aluno"><div class="frame-item"><span>Alunos</span></div></a>
            <a href="/treino"><div class="frame-item"><span>Treino</span></div></a>
            <a href="/exercicio"><div class="frame-item"><span>Exercicios</span></div></a>
            <a href="/aulas"><div class="frame-item"><span>Aulas</span></div></a>
            <a href="/planos"><div class="frame-item"><span>Planos</span></div></a>
            <a><div class="frame-item"><span>Avaliação Física</span></div></a>
            <a href="/visitante"><div class="frame-item"><span>Visitantes</span></div></a>
            <a href="/material"><div class="frame-item"><span>Material</span></div></a>
        </div>
        
    );}
    else {
        return (
        <div class="frame-8">
            <a><div class="frame-item"><span>Funcionário</span></div></a>
            <a href="/aluno"><div class="frame-item"><span>Alunos</span></div></a>
            <a href="/treino"><div class="frame-item"><span>Treino</span></div></a>
            <a href="/exercicio"><div class="frame-item"><span>Exercicios</span></div></a>
            <a href="/aulas"><div class="frame-item"><span>Aulas</span></div></a>
            <a><div class="frame-item"><span>Planos</span></div></a>
            <a href="/avaliacao"><div class="frame-item"><span>Avaliação Física</span></div></a>
            <a href="/visitante"><div class="frame-item"><span>Visitantes</span></div></a>
            <a><div class="frame-item"><span>Material</span></div></a>
        </div>
    );}
        
}