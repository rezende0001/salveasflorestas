import inversores from './inversor.js';
import PainelSolar from './solarPainel.js';

const painel270w = new PainelSolar("Canadian Risen 270w", 270, 38.2, 31.2, 8.67, 9.2, -0.33, -0.39, 0.033, 45, 1.64, 0.99, 1.63, 1.79);
const painel330w = new PainelSolar("Canadian Risen 330w", 330, 46.3, 38.1, 8.7, 9.25, -0.32, -0.40, 0.034, 45, 1.96, 0.99, 1.94, 2.13);
const painel325w = new PainelSolar("Canadian Risen 325w", 325, 45.5, 37, 8.78, 9.34, -0.31, -0.41, 0.053, 45, 1.96, 0.99, 1.94, 2.13);

const paineis = [painel270w, painel330w, painel325w];
const painel = paineis[1]

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".pergunta-frequente").forEach(pergunta => {
        pergunta.addEventListener("click", () => {
            let resposta = pergunta.nextElementSibling; // Pega o próximo elemento que é a resposta
            if (resposta && resposta.classList.contains("resposta")) { // Verifica se é uma resposta
                if (resposta.style.display === "none" || resposta.style.display === "") {
                    resposta.style.display = "block"; // Mostra a resposta
                } else {
                    resposta.style.display = "none"; // Oculta a resposta
                }
                pergunta.classList.toggle("aberta"); // Alterna a seta para cima/baixo
            } else {
                console.error("Elemento resposta não encontrado."); // Mensagem de erro para depuração
            }
        });
    });

    async function calcular() {
        const consumoMedioMensal = parseFloat(document.getElementById("consumoMedioMensal").value);
        const custoPorKWH = parseFloat(document.getElementById("custo-kwh").value);
        const cidade = document.getElementById("localizacao").value;
        
        // Exibir os resultados
        let irradiacaoSolarMediaDiaria = 0
        let mediaTemperaturaAnual = 18
        await fetch('radiacaoMedia.json')
        .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao carregar o arquivo');
            }
            return response.json(); // Converter para JSON
          })
        .then(data => {
            console.log(data)
            if (data[cidade]) {
                // Defina o resultado para a irradiação solar média da cidade
                irradiacaoSolarMediaDiaria = data[cidade].mediaIrradiacaoSolar;
                mediaTemperaturaAnual = data[cidade].mediaTemperaturaAnual;
              } else {
                // Cidade não encontrada
                document.getElementById("resultado").innerHTML = "Cidade não encontrada";
              }
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
        
        console.log(irradiacaoSolarMediaDiaria, mediaTemperaturaAnual)
        const tamanhoDoSistema = consumoMedioMensal  / (irradiacaoSolarMediaDiaria  * 30); // Consumo mensal dividido pelas horas de sol e dias do mês
        let consumoDiário = consumoMedioMensal / 30;
    
        const rendimentoInversor = inversores.inversor4.getEficiencia();
        console.log(rendimentoInversor)
        const potCorrigida = painel.calcularPotenciaCorrigida(18.8);
        const potSaidaInversor = painel.calculaPotSaidaInversor(potCorrigida, rendimentoInversor, 1);
        const energiaGerada = painel.calculoEnergiaGeradaMensal(30,(irradiacaoSolarMediaDiaria*30*12)/ 1000, 0.98, Number(potSaidaInversor));
    
        const qtd = Math.ceil(consumoMedioMensal / energiaGerada);
        const potSistema = Number(((qtd * painel.potPico)/1000).toFixed(2));
      
        let potenciaSistema = consumoDiário / irradiacaoSolarMediaDiaria;
        let custoAnual = consumoMedioMensal * custoPorKWH * 12;
        let investimentoMedio = potenciaSistema * custoPorKWH;
        let payback = investimentoMedio / custoAnual;
    
        const resultado = `
            <p>Tamanho do sistema: ${tamanhoDoSistema} kW</p>
            <p>Potencia do sistema: ${potSistema} kW</p>
            <p>Quantidade de Placas: ${qtd}</p>
            <p>Tempo de retorno do investimento: ${payback.toFixed(2)} anos</p>
            <p>Investimento Médio: R$ ${investimentoMedio.toFixed(2)} reais</p>
        `;
        document.getElementById("resultado").style.display = "block";
        document.getElementById("resultado").innerHTML = resultado; // Exibe os resultados
    }

    document.getElementById('botao').addEventListener('click', () => {
        // Chama a função calcular quando o botão é clicado
        calcular();
    });
});