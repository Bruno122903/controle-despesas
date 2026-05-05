// 1. Declaração única do Banco de Dados
let db = JSON.parse(localStorage.getItem('Raimundo_Dark_DB')) || [];

// 2. Configuração ao carregar a página
window.onload = () => {
    const inputValor = document.getElementById('valor');
    
    // MÁSCARA DE VÍRGULA: Transforma "500" em "R$ 5,00" em tempo real
    inputValor.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, ''); 
        if (v === "") { e.target.value = ""; return; }
        v = (v / 100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
        e.target.value = "R$ " + v;
    });

    atualizarTudo();
};

// 3. Função para Salvar
function salvarGasto() {
    const desc = document.getElementById('item').value;
    const inputValor = document.getElementById('valor').value;
    
    // LIMPEZA DO VALOR: Transforma "R$ 5,00" em 5.00 para salvar
    const valorLimpo = parseFloat(inputValor.replace("R$ ", "").replace(/\./g, "").replace(",", "."));
    const date = new Date();

    if (!desc || isNaN(valorLimpo) || valorLimpo <= 0) {
        alert("Insira o Valor ou o Nome do item");
        return;
    }

    const novo = {
        id: Date.now(),
        desc,
        valor: valorLimpo,
        data: date.toLocaleDateString('pt-BR'),
        mes: date.getMonth(),
        iso: date.toISOString()
    };

    db.push(novo);
    localStorage.setItem('Raimundo_Dark_DB', JSON.stringify(db));

    // Limpa os campos após salvar
    document.getElementById('item').value = "";
    document.getElementById('valor').value = "";
    
    atualizarTudo();
}

// 4. Funções de Interface (Menu e Atualização)
function mudarAba(nome) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`aba-${nome}`).classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${nome}`).classList.add('active');

    if (nome === 'perfil') filtrar('todos');
}

function atualizarTudo() {
    const lista = document.getElementById('lista-curta');
    if(lista) {
        lista.innerHTML = "";
        db.slice(-3).reverse().forEach(g => {
            lista.innerHTML += criarCard(g);
        });
    }

    const total = db.reduce((acc, g) => acc + g.valor, 0);
    const elemTotal = document.getElementById('valor-total');
    if(elemTotal) {
        elemTotal.innerText = total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
}

// 5. Histórico e Filtros
function filtrar(tipo, e) {
    const container = document.getElementById('tabela-corpo');
    if(!container) return;
    
    container.innerHTML = "";
    
    if (e) {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
    }

    let listaFiltrada = db;
    const hoje = new Date().toLocaleDateString('pt-BR');
    const mesAtual = new Date().getMonth();

    if (tipo === 'dia') listaFiltrada = db.filter(g => g.data === hoje);
    if (tipo === 'mes') listaFiltrada = db.filter(g => g.mes === mesAtual);

    listaFiltrada.slice().reverse().forEach(g => {
        container.innerHTML += criarCard(g);
    });
}

function criarCard(g) {
    return `
        <div class="item-card">
            <div class="item-info">
                <b>${g.desc}</b>
                <small>📅 ${g.data}</small>
            </div>
            <div style="display: flex; align-items: center;">
                <div class="item-price">R$ ${g.valor.toFixed(2).replace(".", ",")}</div>
                <button class="btn-delete" onclick="apagar(${g.id})">🗑️</button>
            </div>
        </div>`;
}

function apagar(id) {
    if (confirm("Você quer mesmo apagar esse gasto?")) {
        db = db.filter(g => g.id !== id);
        localStorage.setItem('Raimundo_Dark_DB', JSON.stringify(db));
        atualizarTudo();
        if (document.getElementById('aba-perfil').classList.contains('active')) filtrar('todos');
    }
}