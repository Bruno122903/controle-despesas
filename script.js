let db = JSON.parse(localStorage.getItem('Raimundo_Dark_DB')) || [];

window.onload = () => {
    atualizarTudo();
};

function salvarGasto() {
    const desc = document.getElementById('item').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const date = new Date();

    if (!desc || isNaN(valor)) {
        alert("Pai, escreva o que comprou e o valor!");
        return;
    }

    const novo = {
        id: Date.now(),
        desc,
        valor,
        data: date.toLocaleDateString('pt-BR'),
        mes: date.getMonth(),
        iso: date.toISOString()
    };

    db.push(novo);
    localStorage.setItem('Raimundo_Dark_DB', JSON.stringify(db));

    document.getElementById('item').value = "";
    document.getElementById('valor').value = "";
    
    atualizarTudo();
}

function mudarAba(nome) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`aba-${nome}`).classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${nome}`).classList.add('active');

    if (nome === 'perfil') filtrar('todos');
}

function atualizarTudo() {
    // Atualiza Lista Curta
    const lista = document.getElementById('lista-curta');
    lista.innerHTML = "";
    db.slice(-3).reverse().forEach(g => {
        lista.innerHTML += criarCard(g);
    });

    // Atualiza Total
    const total = db.reduce((acc, g) => acc + g.valor, 0);
    document.getElementById('valor-total').innerText = total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function filtrar(tipo, e) {
    const container = document.getElementById('tabela-corpo');
    container.innerHTML = "";
    
    if (e) {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
    }

    let lista = db;
    const hoje = new Date().toLocaleDateString('pt-BR');
    const mesAtual = new Date().getMonth();

    if (tipo === 'dia') lista = db.filter(g => g.data === hoje);
    if (tipo === 'mes') lista = db.filter(g => g.mes === mesAtual);

    lista.reverse().forEach(g => {
        container.innerHTML += criarCard(g);
    });
}

function criarCard(g) {
    return `
        <div class="item-card">
            <div class="item-info">
                <b>${g.desc}</b>
                <small>${g.data}</small>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="item-price">R$ ${g.valor.toFixed(2)}</span>
                <button class="btn-delete" onclick="apagar(${g.id})">🗑️</button>
            </div>
        </div>`;
}

function apagar(id) {
    if (confirm("Pai, quer mesmo apagar esse gasto?")) {
        db = db.filter(g => g.id !== id);
        localStorage.setItem('Raimundo_Dark_DB', JSON.stringify(db));
        atualizarTudo();
        if (document.getElementById('aba-perfil').classList.contains('active')) filtrar('todos');
    }
}