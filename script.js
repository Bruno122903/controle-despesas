// 1. Tenta pegar os dados. IMPORTANTE: O nome 'gastosPai' tem que ser igual em todo o código
let listaGastos = JSON.parse(localStorage.getItem('gastosPai')) || [];

function renderizarGastos() {
    const listaHtml = document.getElementById('lista');
    const totalHtml = document.getElementById('total');
    
    if (!listaHtml) return; // Segurança caso o HTML não carregou

    listaHtml.innerHTML = ""; 
    let soma = 0;

    listaGastos.forEach((gasto, index) => {
        soma += gasto.valor;
        const item = document.createElement('li');
        item.innerHTML = `
            ${gasto.nome} 
            <span>
                R$ ${gasto.valor.toFixed(2)} 
                <button onclick="removerGasto(${index})" style="width: auto; padding: 2px 8px; background: #dc3545; margin-left: 10px; display: inline;">X</button>
            </span>
        `;
        listaHtml.appendChild(item);
    });

    totalHtml.innerText = soma.toFixed(2);
    
    // 2. SALVA NA MEMÓRIA: Aqui é onde a mágica acontece
    localStorage.setItem('gastosPai', JSON.stringify(listaGastos));
}

function adicionarGasto() {
    const nomeInput = document.getElementById('nomeGasto');
    const valorInput = document.getElementById('valorGasto');

    const nome = nomeInput.value;
    const valor = parseFloat(valorInput.value);

    if (nome === "" || isNaN(valor)) {
        alert("Preencha os campos!");
        return;
    }

    listaGastos.push({ nome, valor });
    nomeInput.value = "";
    valorInput.value = "";

    renderizarGastos();
}

function removerGasto(index) {
    listaGastos.splice(index, 1); 
    renderizarGastos();
}

// 3. ESSA LINHA É FUNDAMENTAL: Ela desenha os gastos salvos assim que a página abre
renderizarGastos();