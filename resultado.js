document.addEventListener('DOMContentLoaded', function() {
/*     const potencia = localStorage.getItem("potencia") || 'Dados não disponíveis'; */
    const quantidadePlacas = localStorage.getItem("quantidadePlacas") || 'Dados não disponíveis';
    const payback = localStorage.getItem("payback") || 'Dados não disponíveis';
    const investimentoMedio = localStorage.getItem("investimentoMedio") || 'Dados não disponíveis';
    const reducaoCO2 = localStorage.getItem("reducaoCO2") || 'Dados não disponíveis';
    const areaInstalacao = localStorage.getItem("areaInstalacao") || 'Dados não disponíveis';
    const arvore = localStorage.getItem("arvores") || 'Dados não disponíveis';

/*     document.getElementById('potenciaSistema').innerHTML = potencia; */
    document.getElementById('quantidadePlacas').innerHTML = quantidadePlacas;
    document.getElementById('payback').innerHTML = payback;
    document.getElementById('investimentoMedio').innerHTML = investimentoMedio;
    document.getElementById('reducaoCO2').innerHTML = reducaoCO2;
    document.getElementById('areaInstalacao').innerHTML = areaInstalacao;
    document.getElementById('arvores').innerHTML = arvore;
});
