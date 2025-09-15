export default function Header(){
  return (
    <div className="row" style={{justifyContent:"space-between"}}>
      <div>
        <h1 className="h1">8-Puzzle Solver</h1>
        <div className="sub">A* e Greedy • Heurísticas: Misplaced / Manhattan</div>
      </div>
      <span className="badge"><span className="kbd">0</span> = vazio</span>
    </div>
  );
}
