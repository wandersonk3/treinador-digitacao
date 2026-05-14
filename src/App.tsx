import { useState, useEffect, useRef } from 'react';
import './App.css';

const NIVEIS_DIFICULDADE = {
  BASICO: { velocidade: 0.15, spawn: 3500, nome: "Iniciante" },
  MEDIO: { velocidade: 0.35, spawn: 2200, nome: "Intermediário" },
  AVANCADO: { velocidade: 0.55, spawn: 1300, nome: "Mestre" }
};

const BANCO_DE_NIVEIS = [
  {
    id: 1,
    titulo: "NÍVEL 1: DOMÍNIO DA LINHA CENTRAL",
    instrucao: "Foco nos indicadores alcançando o centro (G e H).",
    fases: [
      { nome: "Extensão Central", texto: "fgf jhj asdfg hjklç" },
      { nome: "Simetria", texto: "gh gh gh asdfg hjklç" },
      { nome: "Palavras Base", texto: "fada gasta jaca sala hahah" }
    ]
  },
  {
    id: 2,
    titulo: "NÍVEL 2: TOPO À ESQUERDA (QWERT)",
    instrucao: "Mínimo no Q, anelar no W, médio no E, indicador no R/T.",
    fases: [
      { nome: "Sequência QWERT", texto: "qwert qwert qwert qwert" },
      { nome: "Alcance Vertical", texto: "aq sw de rf tg aq sw" },
      { nome: "Combinações", texto: "water trade treat queue war" }
    ]
  },
  {
    id: 3,
    titulo: "NÍVEL 3: TOPO À DIREITA (YUIOP)",
    instrucao: "Indicador no Y/U, médio no I, anelar no O, mínimo no P.",
    fases: [
      { nome: "Sequência YUIOP", texto: "yuiop yuiop yuiop yuiop" },
      { nome: "Alcance Vertical", texto: "jy hu ki lo pç jy hu" },
      { nome: "Combinações", texto: "pulo ioiô topo yuuki tipo" }
    ]
  },
  {
    id: 4,
    titulo: "NÍVEL 4: BASE À ESQUERDA (ZXCVB)",
    instrucao: "Mínimo no Z, anelar no X, médio no C, indicador no V/B.",
    fases: [
      { nome: "Sequência ZXCVB", texto: "zxcvb zxcvb zxcvb zxcvb" },
      { nome: "Alcance Inferior", texto: "az sx dc fv gb az sx" },
      { nome: "Combinações", texto: "vaca zebra caixa busca vibe" }
    ]
  },
  {
    id: 5,
    titulo: "NÍVEL 5: BASE À DIREITA (NM , . /)",
    instrucao: "Indicador no N/M, médio na vírgula, anelar no ponto.",
    fases: [
      { nome: "Sequência Inferior", texto: "nm ,. / nm ,. / nm ,. /" },
      { nome: "Alcance Inferior", texto: "jn jm k, l. ç/ jn jm" },
      { nome: "Combinações", texto: "mão nem mim não moinho" }
    ]
  },
  {
    id: 6,
    titulo: "NÍVEL 6: INTEGRAÇÃO ALFABÉTICA",
    instrucao: "O alfabeto completo. Sem olhar para o teclado.",
    fases: [
      { nome: "Ziguezague", texto: "qaz wsx edc rfv tgb yhn ujm" },
      { nome: "Pangrama Neutro", texto: "gazeta brique xexeu vovô" },
      { nome: "Fluxo Contínuo", texto: "quem faz boxing ajuda vovó" }
    ]
  },
  {
    id: 7,
    titulo: "NÍVEL 7: LINHA NUMÉRICA",
    instrucao: "Extensão para a linha superior de números.",
    fases: [
      { nome: "Esquerda 1-5", texto: "1q 2w 3e 4r 5t 12345" },
      { nome: "Direita 6-0", texto: "6y 7u 8i 9o 0p 67890" },
      { nome: "Séries", texto: "1020 3040 5060 7080 9000" }
    ]
  },
  {
    id: 8,
    titulo: "NÍVEL 8: SÍMBOLOS E SHIFT",
    instrucao: "Uso de maiúsculas e caracteres especiais.",
    fases: [
      { nome: "Símbolos", texto: "! @ # $ % & * ( ) _ +" },
      { nome: "Dados", texto: "ID: 987-X | Total: 1.500,00" },
      { nome: "Texto Caps", texto: "ALTA PERFORMANCE E PRECISÃO" }
    ]
  },
  {
    id: 9,
    titulo: "NÍVEL 9: SINTAXE TÉCNICA",
    instrucao: "Chaves, colchetes e operadores lógicos.",
    fases: [
      { nome: "Estruturas", texto: "if (x > 0) { return y; }" },
      { nome: "Tags", texto: "<div> </div> <span> </span>" },
      { nome: "Lógica", texto: "const data = [1, 2, 3];" }
    ]
  },
  {
    id: 10,
    titulo: "NÍVEL 10: MAESTRIA DE VELOCIDADE",
    instrucao: "O teste final de resistência e agilidade.",
    fases: [
      { nome: "Técnico", texto: "Sistema operacional: 100% ativo." },
      { nome: "Complexo", texto: "Hardware & Software: integração total." },
      { nome: "Final", texto: "A constância gera resultados reais." }
    ]
  }
];

const DICIONARIO_JOGO = ["Casa", "Brasil", "Sucesso", "1992", "Foco!", "Teclado", "R$ 50", "Admin@123", "2026", "Guerreiro", "Maestria", "Café", "Fé", "Constância", "Petrobras", "Estudo", "Disciplina", "Forte", "Mentalidade", "Evolução"];

function App() {
  const [nivelDesbloqueado, setNivelDesbloqueado] = useState(() => {
    const salvo = localStorage.getItem('nivel_progresso');
    return salvo ? parseInt(salvo) : 1;
  });

  const [tela, setTela] = useState<'hub' | 'treino' | 'vitoria' | 'jogo'>('hub');
  const [nivelAtualIdx, setNivelAtualIdx] = useState(0);
  const [faseAtualIdx, setFaseAtualIdx] = useState(0);
  const [tempoConfigurado, setTempoConfigurado] = useState(15);
  const [dificuldadeJogo, setDificuldadeJogo] = useState<'BASICO' | 'MEDIO' | 'AVANCADO'>('BASICO');
  const [indiceNaFrase, setIndiceNaFrase] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(15);
  const [status, setStatus] = useState<'aguardando' | 'rodando' | 'falha'>('aguardando');

  const [palavrasJogo, setPalavrasJogo] = useState<{id: number, texto: string, x: number, y: number}[]>([]);
  const [inputJogo, setInputJogo] = useState("");
  const [pontos, setPontos] = useState(0);
  const finalizadoRef = useRef(false);

  const nivelDados = BANCO_DE_NIVEIS[nivelAtualIdx];
  const textoAlvo = nivelDados?.fases[faseAtualIdx]?.texto || "";

  useEffect(() => {
    localStorage.setItem('nivel_progresso', nivelDesbloqueado.toString());
  }, [nivelDesbloqueado]);

  // MOTOR DO CRONÔMETRO (TREINO)
  useEffect(() => {
    let cronometro: any;
    if (status === 'rodando' && tempoRestante > 0) {
      cronometro = setInterval(() => setTempoRestante(p => p - 1), 1000);
    } else if (tempoRestante === 0 && status === 'rodando') {
      setStatus('falha');
    }
    return () => clearInterval(cronometro);
  }, [status, tempoRestante]);

  // JOGO: GRAVIDADE
  useEffect(() => {
    let loop: any = null;
    if (tela === 'jogo') {
      finalizadoRef.current = false;
      loop = setInterval(() => {
        setPalavrasJogo(prev => {
          if (finalizadoRef.current) return [];
          const novas = prev.map(p => ({ ...p, y: p.y + NIVEIS_DIFICULDADE[dificuldadeJogo].velocidade }));
          if (novas.some(p => p.y > 90)) {
            finalizadoRef.current = true;
            clearInterval(loop);
            setTela('hub');
            setTimeout(() => { alert(`GAME OVER! Pontos: ${pontos}`); setPalavrasJogo([]); }, 50);
            return [];
          }
          return novas;
        });
      }, 30);
    }
    return () => { if (loop) clearInterval(loop); };
  }, [tela, pontos, dificuldadeJogo]);

  // JOGO: SPAWN
  useEffect(() => {
    let spawn: any = null;
    if (tela === 'jogo') {
      spawn = setInterval(() => {
        const nova = {
          id: Date.now(),
          texto: DICIONARIO_JOGO[Math.floor(Math.random() * DICIONARIO_JOGO.length)],
          x: Math.floor(Math.random() * 60) + 10,
          y: 0
        };
        setPalavrasJogo(prev => [...prev, nova]);
      }, NIVEIS_DIFICULDADE[dificuldadeJogo].spawn);
    }
    return () => { if (spawn) clearInterval(spawn); };
  }, [tela, dificuldadeJogo]);

  // TREINO: TECLADO COM TRAVA DE SEGURANÇA
useEffect(() => {
  const escutarTeclado = (e: KeyboardEvent) => {
    // 1. Tecla de emergência sempre funciona
    if (e.key === 'Escape') { setTela('hub'); return; }
    
    // 2. Só processa se estivermos na tela de treino
    if (tela !== 'treino') return;

    // 3. TRAVA DE SEGURANÇA: Se o status for 'falha' ou o tempo acabou, 
    // bloqueia TUDO, exceto o Enter para reiniciar.
    if (status === 'falha' || tempoRestante === 0) {
      if (e.key === 'Enter') {
        reiniciarFase();
      }
      return; // Impede que o código abaixo seja executado
    }

    // 4. Ignora teclas de comando (Shift, Alt, etc) para não dar erro falso
    if (e.key.length > 1) return;

    // 5. Inicia o cronômetro no primeiro toque
    if (status === 'aguardando') setStatus('rodando');

    // 6. VALIDAÇÃO DE PRECISÃO
    if (e.key === textoAlvo[indiceNaFrase]) {
      if (indiceNaFrase + 1 === textoAlvo.length) {
        avancarFase();
      } else {
        setIndiceNaFrase(prev => prev + 1);
      }
    } else {
      // ERRO DETECTADO: Bloqueio imediato do progresso
      setStatus('falha');
    }
  };

  window.addEventListener('keydown', escutarTeclado);
  return () => window.removeEventListener('keydown', escutarTeclado);
}, [indiceNaFrase, status, textoAlvo, tela, tempoRestante]); // Adicionado tempoRestante como dependência

  const avancarFase = () => {
    if (faseAtualIdx < nivelDados.fases.length - 1) {
      setFaseAtualIdx(p => p + 1);
      setIndiceNaFrase(0);
      setTempoRestante(tempoConfigurado);
      setStatus('aguardando');
    } else {
      if (nivelAtualIdx + 1 === nivelDesbloqueado && nivelDesbloqueado < BANCO_DE_NIVEIS.length) setNivelDesbloqueado(p => p + 1);
      setTela('vitoria');
    }
  };

  const reiniciarFase = () => { 
    setIndiceNaFrase(0); 
    setTempoRestante(tempoConfigurado);
    setStatus('aguardando'); 
  };

  if (tela === 'hub') {
    return (
      <div className="container-foco">
        <h1>SISTEMA DE TREINAMENTO</h1>
        <div className="seletor-tempo-container">
          <p>TEMPO POR FASE (TREINO):</p>
          <div className="grupo-botoes">
            {[15, 30, 45].map(t => (
              <button key={t} className={`btn-tempo ${tempoConfigurado === t ? 'ativo' : ''}`} onClick={() => setTempoConfigurado(t)}>{t}s</button>
            ))}
          </div>
        </div>
        <div className="seletor-dificuldade-jogo">
          <p>DIFICULDADE DO SURVIVAL:</p>
          <div className="grupo-botoes">
            {(Object.keys(NIVEIS_DIFICULDADE) as Array<keyof typeof NIVEIS_DIFICULDADE>).map(df => (
              <button key={df} className={`btn-tempo ${dificuldadeJogo === df ? 'ativo' : ''}`} onClick={() => setDificuldadeJogo(df)}>{NIVEIS_DIFICULDADE[df].nome}</button>
            ))}
          </div>
        </div>
        <button className="btn-jogo-liberado" onClick={() => { setTela('jogo'); setPontos(0); setPalavrasJogo([]); }}>⚡ SURVIVAL</button>
        <div className="grade-niveis">
          {BANCO_DE_NIVEIS.map((n, idx) => {
            const bloqueado = n.id > nivelDesbloqueado;
            return (
              <div key={n.id} className={`card-nivel ${bloqueado ? 'bloqueado' : 'liberado'}`} onClick={() => !bloqueado && (setNivelAtualIdx(idx), setFaseAtualIdx(0), setIndiceNaFrase(0), setTempoRestante(tempoConfigurado), setTela('treino'), setStatus('aguardando'))}>
                <h3>NÍVEL {n.id}</h3>
                <p>{n.titulo.split(':')[1]}</p>
                {bloqueado ? <span className="tag-bloqueio">BLOQUEADO</span> : <span className="tag-liberado">INICIAR</span>}
              </div>
            );
          })}
        </div>
        <button className="btn-reset" onClick={() => { if(window.confirm("Resetar progresso?")) { localStorage.clear(); window.location.reload(); }}}>LIMPAR TUDO</button>
      </div>
    );
  }

  if (tela === 'jogo') {
    return (
      <div className="container-foco">
        <div className="header-jogo"><span>PONTOS: {pontos}</span><button className="btn-esc" onClick={() => setTela('hub')}>SAIR</button></div>
        <div className="arena-jogo">
          {palavrasJogo.map(p => <div key={p.id} className="palavra-cadente" style={{ left: `${p.x}%`, top: `${p.y}%` }}>{p.texto}</div>)}
        </div>
        <input autoFocus className="input-jogo" value={inputJogo} onChange={(e) => {
          const val = e.target.value; setInputJogo(val);
          const alvo = palavrasJogo.find(p => p.texto === val);
          if (alvo) { setPalavrasJogo(prev => prev.filter(p => p.id !== alvo.id)); setPontos(pts => pts + 10); setInputJogo(""); }
        }} placeholder="Digite rápido..." />
      </div>
    );
  }

  if (tela === 'vitoria') {
    return (
      <div className="container-foco">
        <h1 style={{color: '#4caf50'}}>DOMINADO!</h1>
        <button className="btn-tempo ativo" onClick={() => setTela('hub')}>VOLTAR AO MENU</button>
      </div>
    );
  }

  return (
    <div className="container-foco">
      <div className="header-treino">
        <button className="btn-esc" onClick={() => setTela('hub')}>ESC - SAIR</button>
        <div>{nivelDados.titulo} - FASE {faseAtualIdx + 1}/{nivelDados.fases.length}</div>
      </div>
      {/* LINHA QUE VOLTOU: O RELÓGIO */}
      <div className="timer" style={{ color: status === 'falha' ? '#f44336' : '#ff9800', fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
        00:{tempoRestante.toString().padStart(2, '0')}
      </div>
      <div className="display-texto">
        {textoAlvo.split('').map((letra, index) => (
          <span key={index} style={{ color: index < indiceNaFrase ? '#4caf50' : index === indiceNaFrase ? '#fff' : '#222', borderBottom: index === indiceNaFrase ? '2px solid #ff9800' : 'none', fontSize: '2.5rem' }}>
            {letra === ' ' ? '␣' : letra}
          </span>
        ))}
      </div>
      {status === 'falha' && <div style={{color: '#f44336', marginTop: '30px', fontWeight: 'bold'}}>ERRO! APERTE [ENTER] PARA REINICIAR.</div>}
    </div>
  );
}

export default App;