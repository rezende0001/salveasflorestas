function calcular() {
    const consumo = parseFloat(document.getElementById("consumo").value);
    const custoPorKWH = parseFloat(document.getElementById("custo-kwh").value);
    const horasSol = parseFloat(document.getElementById("horas-sol").value);
    const cidade = document.getElementById("localizacao").value;

    // Calcular o tamanho do sistema
    const tamanhoDoSistema = consumo / (horasSol * 30); // Consumo mensal dividido pelas horas de sol e dias do mês
    // Calcular o custo total
    const custoTotal = custoPorKWH * tamanhoDoSistema; // Custo total do sistema
    // Calcular o número de placas necessárias
/*     const numeroDePlacas = Math.ceil((tamanhoDoSistema * 1000) / potenciaPorPlaca); // Número de placas */
    const numeroDePlacas = 5 // Número de placas
    // Calcular o tempo de retorno
    const custoAnual = consumo * custoPorKWH * 12; // Consumo anual
    const tempoDeRetorno = custoTotal / custoAnual; // Tempo de retorno do investimento

    // Exibir os resultados
    const resultado = `
        <p>Tamanho do sistema: ${tamanhoDoSistema.toFixed(2)} kW</p>
        <p>Custo total do sistema: R$ ${custoTotal.toFixed(2)}</p>
        <p>Número de placas necessárias: ${numeroDePlacas}</p>
        <p>Tempo de retorno do investimento: ${tempoDeRetorno.toFixed(2)} anos</p>
    `;

    /* fetch(`https://cresesb.cepel.br/index.php?section=sundata&city=${cidade}`)
    .then(response => response.json()) // Parsear a resposta como JSON
    .then(data => {
        console.log("Dados de irradiação solar para", cidade, ":", data);
        // Processar e exibir os dados conforme necessário
    })
    .catch(error => {
        console.error("Erro ao buscar irradiação solar:", error);
    }); */

    document.getElementById("resultado").innerHTML = resultado; // Exibe os resultados
}
