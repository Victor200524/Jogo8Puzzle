"use client";
import Header from "@/components/Header";
import Board from "@/components/Board";
import Controls from "@/components/Controls";
import Stats from "@/components/Stats";
import { useEffect, useState } from "react";
import { solveClient, shuffleSolvable } from "@/lib/solver";
import Rodape from "@/components/Rodape";

const GOAL_DEFAULT = [1,2,3,4,5,6,7,8,0]; // estado objetivo padrão

export default function Home() {
  const [state, setState] = useState([1,2,3,4,0,6,7,5,8]);
  const [goal, setGoal] = useState(GOAL_DEFAULT);
  const [algo, setAlgo] = useState("ASTAR");         // ASTAR | GREEDY é o outro possível valor aqui
  const [heur, setHeur] = useState("MANHATTAN");     // MANHATTAN | MISPLACED é o outro possível valor aqui 
  const [speed, setSpeed] = useState(600);           // ms entre cada passo na reprodução do caminho
  const [playing, setPlaying] = useState(false);
  const [path, setPath] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [busy, setBusy] = useState(false);

  const move = (idx) => {
    if (playing || busy || path.length) return;
    const zero = state.indexOf(0);
    const neighbors = {
      0:[1,3],1:[0,2,4],2:[1,5],
      3:[0,4,6],4:[1,3,5,7],5:[2,4,8],
      6:[3,7],7:[4,6,8],8:[5,7]
    };
    if (neighbors[zero].includes(idx)) {
      const next = [...state];
      [next[zero], next[idx]] = [next[idx], next[zero]];
      setState(next);
    }
  };

  // reprodução do caminho
  useEffect(() => {
    if (!playing || cursor >= path.length) return;
    const id = setTimeout(() => {
      setState(path[cursor]);
      setCursor(c => c + 1);
    }, speed);
    return () => clearTimeout(id);
  }, [playing, cursor, path, speed]);

  const resetPlayback = () => { setPath([]); setCursor(0); setPlaying(false); };

  const onShuffle = () => {
    resetPlayback();
    setState(shuffleSolvable(goal));
  };

  const onSolve = async () => {
    resetPlayback();
    setBusy(true);
    const t0 = performance.now();
    try {
      const { path, visited, depth, cost } = solveClient(state, goal, algo, heur);
      setPath(path.slice(1)); // primeiro estado já é o atual
      setMetrics({ millis: Math.round(performance.now() - t0), visited, depth, cost });
      setCursor(0);
      setPlaying(true);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <main className="container">
        {/* painel da esquerda */}
        <section className="panel">
          <Header />
          <div className="sub">Clique nas peças adjacentes ao vazio para mover. Embaralhe e use o solver para encontrar o caminho.</div>
          <div style={{margin:"16px 0"}} />
          <Board state={state} onClickTile={move} />
        </section>

        {/* painel da direita */}
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
