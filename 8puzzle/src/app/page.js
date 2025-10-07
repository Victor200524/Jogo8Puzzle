"use client";
import Header from "@/components/Header";
import Board from "@/components/Board";
import Controls from "@/components/Controls";
import Stats from "@/components/Stats";
import { useEffect, useState } from "react";
import Rodape from "@/components/Rodape";

const GOAL_DEFAULT = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export default function Home() {
  const [state, setState] = useState([]); // Inicia vazio, pois buscará do backend
  const [goal, setGoal] = useState(GOAL_DEFAULT); // Estado objetivo
  const [algo, setAlgo] = useState("ASTAR"); // Algoritmo padrão
  const [heur, setHeur] = useState("MANHATTAN"); // Heurística padrão
  const [speed, setSpeed] = useState(600); // Velocidade padrão de reprodução em ms
  const [playing, setPlaying] = useState(false); // Se está reproduzindo o caminho
  const [path, setPath] = useState([]); // Caminho de estados a serem reproduzidos
  const [cursor, setCursor] = useState(0); // Posição atual no caminho
  const [metrics, setMetrics] = useState(null); // Métricas retornadas pelo backend
  const [busy, setBusy] = useState(false); // Se está aguardando resposta do backend

  // Busca um tabuleiro inicial do backend quando o componente é montado
  useEffect(() => {
    const fetchInitialBoard = async () => {
      setBusy(true);
      try {
        const response = await fetch("http://localhost:8080/api/shuffle");
        const initialBoard = await response.json();
        setState(initialBoard);
      } catch (e) {
        alert("Não foi possível conectar ao backend para buscar o tabuleiro inicial.");
        setState([1, 2, 3, 4, 5, 6, 7, 8, 0]); // Estado padrão em caso de erro
      } finally {
        setBusy(false);
      }
    };
    fetchInitialBoard();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // A função 'move' agora chama o backend
  const move = async (idx) => {
    if (playing || busy || path.length) return;
    setBusy(true);
    try {
      const response = await fetch("http://localhost:8080/api/move", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentState: state, tileIndex: idx })
      });
      const newState = await response.json();
      setState(newState);
    } catch (e) {
      alert("Erro ao tentar mover a peça. Verifique se o backend está rodando.");
    } finally {
      setBusy(false);
    }
  };

  // A função 'onShuffle' agora chama o backend
  const onShuffle = async () => {
    resetPlayback();
    setBusy(true);
    try {
      const response = await fetch("http://localhost:8080/api/shuffle");
      const newBoard = await response.json();
      setState(newBoard);
    } catch (e) {
      alert("Erro ao embaralhar. Verifique se o backend está rodando.");
    } finally {
      setBusy(false);
    }
  };
  
  // A função 'onSolve' com fetch, que já estava correta
  const onSolve = async () => {
    resetPlayback();
    setBusy(true);
    try {
      const response = await fetch("http://localhost:8080/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initial: state,
          goal,
          algorithm: algo,
          heuristic: heur,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPath((data.path || []).slice(1));
      setMetrics(data.metrics || null);
      setCursor(0);
      setPlaying(true);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };
  
  // Repordução do caminho
  useEffect(() => {
    if (!playing || cursor >= path.length) return;
    const id = setTimeout(() => {
      setState(path[cursor]);
      setCursor(c => c + 1);
    }, speed);
    return () => clearTimeout(id);
  }, [playing, cursor, path, speed]);

  const resetPlayback = () => { 
    setPath([]); 
    setCursor(0); 
    setPlaying(false); 
    setMetrics(null); 
  }; // Reseta o playback e métricas

  return (
    <>
      <main className="container">
        <section className="panel">
          <Header />
          <div className="sub">Clique nas peças adjacentes ao vazio para mover. Embaralhe e use o solver para encontrar o caminho.</div>
          <div style={{margin:"16px 0"}} />
          <Board state={state} onClickTile={move} />
        </section>
        <aside className="panel stack">
          <Controls
            algo={algo} setAlgo={setAlgo}
            heur={heur} setHeur={setHeur}
            speed={speed} setSpeed={setSpeed}
            goal={goal} setGoal={setGoal}
            onShuffle={onShuffle}
            onSolve={onSolve}
            playing={playing} setPlaying={setPlaying}
            canPlay={path.length>0 && cursor<path.length}
            busy={busy}
            onReset={()=>{ setState(goal); resetPlayback(); }}
            onStep={()=>{ if(cursor<path.length){ setState(path[cursor]); setCursor(cursor+1);} }}
          />
          <hr className="hr" />
          <Stats metrics={metrics} pathLen={path.length} />
        </aside>
      </main>
      <div className="container">
        <Rodape />
      </div>
    </>
  );
}