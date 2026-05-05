let meusGastos = JSON.parse(localStorage.getItem('RaimundoAppDB')) || [];

window.onload = () => {
    renderizarRecentes();
    atualizarTotal();
};

function salvarGasto() {
    const desc = document.getElementById('item').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const data = new Date();

    if (!desc || isNaN(valor)) {
        alert("Pai, preencha a descrição e o valor!");
        return;
    }

    const novoGasto = {
        id: Date.now(),
        desc,
        valor,
        dataIso: data.toISOString(),
        dataPT: data.toLocaleDateString('pt-BR')
    };

    meusGastos.push(novoGasto);
    localStorage.setItem('RaimundoAppDB', JSON.stringify(meusGastos));

    document.getElementById('item').value = "";
    document.getElementById('valor').value = "";
    
    renderizarRecentes();
    atualizarTotal();
    
    // Pequeno feedback visual no botão
    const btn = document.querySelector('.btn-main');
    const originalText = btn.innerText;
    btn.innerText = "✅ Salvo!";
    btn.style.background = "#16a34a";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
    }, 1500);
}

function mudarAba(nome) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`aba-${nome}`).classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${nome}`).classList.add('active');

    if (nome === 'perfil') filtrar('todos');
}

function atualizarTotal() {
    const total = meusGastos.reduce((acc, g) => acc + g.valor, 0);
    document.getElementById('valor-total').innerText = total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function renderizarRecentes() {
    const lista = document.getElementById('lista-curta');
    lista.innerHTML = "";
    
    meusGastos.slice(-3).reverse().forEach(g => {
        lista.innerHTML += `
            <div class="item-card">
                <div class="item-info">
                    <b>${g.desc}</b>
                    <small>${g.dataPT}</small>
                </div>
                <div class="item-price">R$ ${g.valor.toFixed(2)}</div>
            </div>`;
    });
}

function filtrar(modo, event) {
    const container = document.getElementById('tabela-corpo');
    container.innerHTML = "";
    
    if (event) {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
    }

    let filtrados = meusGastos;
    const hoje = new Date().toLocaleDateString('pt-BR');
    const mesAtual = new Date().getMonth();

    if(modo === 'dia') filtrados = meusGastos.filter(g => g.dataPT === hoje);
    if(modo === 'mes') filtrados = meusGastos.filter(g => new Date(g.dataIso).getMonth() === mesAtual);

    filtrados.reverse().forEach(g => {
        container.innerHTML += `
            <div class="item-card">
                <div class="item-info">
                    <b>${g.desc}</b>
                    <small>${g.dataPT}</small>
                </div>
                <div class="item-price">R$ ${g.valor.toFixed(2)}</div>
            </div>`;
    });
}