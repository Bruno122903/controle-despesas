let listaGastos = JSON.parse(localStorage.getItem('gastosPai')) || [];

function renderizarGastos() {
    const listaHtml = document.getElementById('lista');
    const totalHtml = document.getElementById('total');
    
    listaHtml.innerHTML = ""; 
    let soma = 0;

    listaGastos.forEach((gasto, index) => {
        soma += gasto.valor;
        const item = document.createElement('li');
        
        item.innerHTML = `
            <div>
                <strong>${gasto.categoria}</strong>
                <span class="categoria-tag">${gasto.data}</span>
            </div>
            <div style="display: flex; align-items: center;">
                <span style="font-weight: bold; margin-right: 10px;">R$ ${gasto.valor.toFixed(2)}</span>
                <button onclick="removerGasto(${index})" style="width: 30px; height: 30px; padding: 0; background: #dc3545; border-radius: 50%; color: white; border: none; cursor: pointer;">✕</button>
            </div>
        `;
        listaHtml.appendChild(item);
    });

    totalHtml.innerText = soma.toFixed(2);
    localStorage.setItem('gastosPai', JSON.stringify(listaGastos));
}

function adicionarGasto() {
    const categoriaInput = document.getElementById('categoriaGasto');
    const valorInput = document.getElementById('valorGasto');

    const categoria = categoriaInput.value;
    const valor = parseFloat(valorInput.value);
    const data = new Date().toLocaleDateString('pt-BR');

    if (categoria === "" || isNaN(valor)) {
        alert("Por favor, preencha o ramo e o valor!");
        return;
    }

    // Salvamos apenas o "ramo" (categoria) e o valor
    listaGastos.push({ categoria, valor, data });
    
    categoriaInput.value = "";
    valorInput.value = "";
    
    renderizarGastos();
}

function removerGasto(index) {
    if(confirm("Apagar esse registro?")) {
        listaGastos.splice(index, 1); 
        renderizarGastos();
    }
}

renderizarGastos();


function removerGasto(index) {
    if(confirm("Tem certeza que quer apagar esse gasto?")) {
        listaGastos.splice(index, 1); 
        renderizarGastos();
    }
}

renderizarGastos();