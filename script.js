let protocolos = []; 

async function carregarDados() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Falha ao carregar data.json. Verifique o caminho e permissões CORS.');
        }
        protocolos = await response.json();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function buscarProtocolos() {
    if (protocolos.length === 0) {
        console.warn("Protocolos ainda não carregados. Tente novamente.");
        return;
    }

    const termoBusca = document.getElementById('busca-input').value.toLowerCase().trim();
    const container = document.getElementById('container-protocolos');
    container.innerHTML = ''; 

    if (termoBusca.length < 3 && termoBusca.length > 0) {
        container.innerHTML = `<p style="text-align: center; margin-top: 3rem; color: var(--tertiary-color);">Digite no mínimo 3 caracteres para iniciar a busca.</p>`;
        return;
    }

    const resultados = protocolos.filter(protocolo => {
        const buscaEmTags = protocolo.tags.some(tag => tag.includes(termoBusca));
        return protocolo.titulo.toLowerCase().includes(termoBusca) ||
               protocolo.sintoma.toLowerCase().includes(termoBusca) ||
               buscaEmTags;
    });

    if (resultados.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; margin-top: 3rem; color: var(--tertiary-color);">
                Nenhum protocolo encontrado. Tente digitar termos mais simples (ex: 'pix', 'lgpd', 'lento').
            </p>
        `;
        return;
    }

    resultados.forEach(protocolo => {
        const solucaoLista = protocolo.solucao.map(item => `<li>${item}</li>`).join('');

        let riscoCor = 'var(--primary-color)';
        if (protocolo.risco === 'CRÍTICO') {
            riscoCor = 'var(--alert-critical)';
        } else if (protocolo.risco === 'ALTO') {
            riscoCor = '#FFC300'; 
        } 

        const protocoloHTML = `
            <article class="protocolo-acao">
                <div class="protocolo-header">
                    <h2>${protocolo.titulo}</h2>
                    <span class="protocolo-risco" style="border-color: ${riscoCor}; color: ${riscoCor};">
                        ${protocolo.risco} ⚠️
                    </span>
                </div>
                
                <p><strong>Situação:</strong> ${protocolo.sintoma}</p>
                
                <h3>Passos de Solução Imediata</h3>
                <ol class="solucao-passos">
                    ${solucaoLista}
                </ol>

                <div class="direito-info">
                    <strong>Seus Direitos:</strong> ${protocolo.direito}
                </div>

                <a 
                    href="${protocolo.linkOficial.url}" 
                    target="_blank" 
                    class="link-oficial-btn"
                >
                    ${protocolo.linkOficial.texto}
                </a>
            </article>
        `;
        container.innerHTML += protocoloHTML;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDados().then(() => {
        document.getElementById('busca-input').addEventListener('keyup', buscarProtocolos);
        document.getElementById('botao-busca').addEventListener('click', buscarProtocolos);
    });
});