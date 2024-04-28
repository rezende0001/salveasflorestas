import inversores from './inversor.js';
import PainelSolar from './solarPainel.js';
import OpenMeteo from './mediaIrradianciaMensal.js';

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
        const openMeteo = new OpenMeteo(-23.4628, -46.5333);

        await openMeteo.addMedia();

        const mediaIrradiacaoAnual = OpenMeteo.meses.reduce((total, mes) => {
            if (mes.mediaIrradiacao) {
                return total + mes.mediaIrradiacao;
            } else {
                return total;
            }
        }, 0) / 12;

        const mediaTemperaturaAnual = OpenMeteo.meses.reduce((total, mes) => {
            if (mes.mediaTemperatura) {
                return total + mes.mediaTemperatura;
            } else {
                return total;
            }
        }, 0) / 12;


        const consumoMedioMensal = parseFloat(document.getElementById("consumoMedioMensal").value);
        const custoPorKWH = parseFloat(document.getElementById("custo-kwh").value);
        const cidade = document.getElementById("localizacao").value;
        
        // Exibir os resultados
        let irradiacaoSolarMediaDiaria = 0
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
        
    
        const rendimentoInversor = inversores.inversor4.getEficiencia();
        const potCorrigida = painel.calcularPotenciaCorrigida(18.8);
        const potSaidaInversor = painel.calculaPotSaidaInversor(potCorrigida, rendimentoInversor, 1);
        const energiaGerada = painel.calculoEnergiaGeradaMensal(30,mediaIrradiacaoAnual/ 1000, 0.98, Number(potSaidaInversor));
        console.log(energiaGerada) // saida: 0.035 ERRADO 


        const qtd = Math.ceil(consumoMedioMensal / energiaGerada);
        const potSistema = Number(((qtd * painel.potPico)/1000).toFixed(2));

        let energiaGeradaMes = [];
        let mediaIrradiacao = [];
        let mediaTemp = [];
        let meses = [];
        
        for (let i = 0; i < OpenMeteo.meses.length; i++) {

            const mes = OpenMeteo.meses[i];
            
            mediaIrradiacao.push(Math.round(mes.mediaIrradiacao !== undefined ? mes.mediaIrradiacao : 0));
            mediaTemp.push(mes.mediaTemperatura !== undefined ? mes.mediaTemperatura : 0);
            meses.push(mes.nome);
            const potCorrigida = painel.calcularPotenciaCorrigida(mes.mediaTemperatura !== undefined ? mes.mediaTemperatura : 0);
            const potSaidaInversor = painel.calculaPotSaidaInversor(potCorrigida, rendimentoInversor, qtd);

            const energiaGerada = painel.calculoEnergiaGeradaMensal(mes.dias, (mes.mediaIrradiacao !== undefined ? mes.mediaIrradiacao : 0) / 1000, 0.98, potSaidaInversor);
            energiaGeradaMes.push(Math.round(energiaGerada)); 
        }

        let energiaGeradaArray = { meses: meses, dados: energiaGeradaMes };
        mediaIrradiacao = { meses: meses, dados: mediaIrradiacao };
        mediaTemp = { meses: meses, dados: mediaTemp };
        const energiaTotal = energiaGeradaArray.dados.reduce((total, mes) => total + mes, 0);
      
        const investimentoMedio = (qtd * 1700)
      
        const TONco2 = Number(((energiaTotal * 0.295)/1000).toFixed(1));
        const arvores = Math.round((TONco2) * 7.14451202);

        const areaInstalacao = Number((qtd * painel.areaInstalacao).toFixed(1));

        const resultado = `
            <p>Potencia do sistema: ${potSistema} kWp</p>
            <p>Quantidade de Placas: ${qtd}</p>
            <p>Tempo de retorno do investimento: X anos</p>
            <p>Investimento Médio: R$ ${investimentoMedio} reais</p>
            <p>Redução de CO2: ${TONco2} TON</p>
            <p>Area de Instalação: ${areaInstalacao} m2</p>
        `;
        document.getElementById("resultado").style.display = "block";
        document.getElementById("resultado").innerHTML = resultado; // Exibe os resultados
    }

    document.getElementById('botao').addEventListener('click', () => {
        // Chama a função calcular quando o botão é clicado
        calcular();
    });
});