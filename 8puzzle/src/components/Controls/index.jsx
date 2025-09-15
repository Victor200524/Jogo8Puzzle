export default function Controls({
  algo, setAlgo, heur, setHeur, speed, setSpeed, goal, setGoal,
  onShuffle, onSolve, playing, setPlaying, canPlay, busy, onReset, onStep
}){
  const setGoalInput = (e)=>{
    const clean = e.target.value.replace(/[^0-9]/g,"");
    if(clean.length===9){
      const arr = clean.split("").map(x=>parseInt(x,10));
      const ok = new Set(arr);
      if(ok.size===9 && [...ok].every(v=>v>=0&&v<=8)){
        setGoal(arr);
      }
    }
  };
  return (
    <div className="stack">
      <div className="label">Estado final (9 dígitos, 0 = vazio)</div>
      <input className="input" placeholder="123456780" onChange={setGoalInput} />

      <div className="row">
        <div className="stack" style={{flex:1}}>
          <div className="label">Algoritmo</div>
          <select className="select" value={algo} onChange={e=>setAlgo(e.target.value)}>
            <option value="ASTAR">A*</option>
            <option value="GREEDY">Greedy Best-First</option>
          </select>
        </div>
        <div className="stack" style={{flex:1}}>
          <div className="label">Heurística</div>
          <select className="select" value={heur} onChange={e=>setHeur(e.target.value)}>
            <option value="MISPLACED">Peças fora do lugar</option>
            <option value="MANHATTAN">Distância Manhattan</option>
          </select>
        </div>
      </div>

      <div className="stack">
        <div className="label">Velocidade</div>
        <input className="input" type="range" min="200" max="1000" step="100"
               value={speed} onChange={e=>setSpeed(+e.target.value)} />
      </div>

      <div className="row">
        <button className="btn" onClick={onShuffle} disabled={busy}>Embaralhar</button>
        <button className="btn primary" onClick={onSolve} disabled={busy}>Resolver</button>
      </div>

      <div className="row">
        <button className="btn ghost" onClick={()=>setPlaying(p=>!p)} disabled={!canPlay}>
          {playing? "Pausar":"Reproduzir"}
        </button>
        <button className="btn ghost" onClick={onStep} disabled={!canPlay}>Passo</button>
        <button className="btn danger" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}
