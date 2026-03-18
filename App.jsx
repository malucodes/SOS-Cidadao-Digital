import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [protocolos, setProtocolos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Falha ao carregar data.json.');
        }
        const data = await response.json();
        setProtocolos(data);
        setResultados(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    
    carregarDados();
  }, []);

  useEffect(() => {
    if (termoBusca.length > 0 && termoBusca.length < 3) {
      setResultados([]);
      return;
    }

    const resultadosFiltrados = protocolos.filter(protocolo => {
      const buscaEmTags = protocolo.tags.some(tag => tag.includes(termoBusca));
      return protocolo.titulo.toLowerCase().includes(termoBusca) ||
             protocolo.sintoma.toLowerCase().includes(termoBusca) ||
             buscaEmTags;
    });

    setResultados(resultadosFiltrados);
  }, [termoBusca, protocolos]);

  return (
    <div className="app-container">
      <header>
        <h1>SOS Cidadão Digital</h1>
      </header>

      <main>
        <div className="busca-container">
          <input 
            type="text" 
            id="busca-input" 
            placeholder="Digite termos como 'pix', 'lgpd', 'lento'..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value.toLowerCase().trim())}
          />
        </div>

        <div id="container-protocolos">
          {termoBusca.length > 0 && termoBusca.length < 3 && (
            <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--tertiary-color)' }}>
              Digite no mínimo 3 caracteres para iniciar a busca.
            </p>
          )}

          {termoBusca.length >= 3 && resultados.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--tertiary-color)' }}>
              Nenhum protocolo encontrado. Tente digitar termos mais simples.
            </p>
          )}

          {(termoBusca.length === 0 || termoBusca.length >= 3) && resultados.map((protocolo, index) => (
            <ProtocoloCard key={index} protocolo={protocolo} />
          ))}
        </div>
      </main>
    </div>
  );
}

function ProtocoloCard({ protocolo }) {
  let riscoCor = 'var(--primary-color)';
  if (protocolo.risco === 'CRÍTICO') {
      riscoCor = 'var(--alert-critical)';
  } else if (protocolo.risco === 'ALTO') {
      riscoCor = '#FFC300'; 
  }

  return (
    <article className="protocolo-acao">
      <div className="protocolo-header">
        <h2>{protocolo.titulo}</h2>
        <span className="protocolo-risco" style={{ borderColor: riscoCor, color: riscoCor }}>
          {protocolo.risco} ⚠️
        </span>
      </div>
      
      <p><strong>Situação:</strong> {protocolo.sintoma}</p>
      
      <h3>Passos de Solução Imediata</h3>
      <ol className="solucao-passos">
        {protocolo.solucao.map((passo, index) => (
          <li key={index}>{passo}</li>
        ))}
      </ol>

      <div className="direito-info">
        <strong>Seus Direitos:</strong> {protocolo.direito}
      </div>

      <a 
        href={protocolo.linkOficial.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="link-oficial-btn"
      >
        {protocolo.linkOficial.texto}
      </a>
    </article>
  );
}

export default App;
