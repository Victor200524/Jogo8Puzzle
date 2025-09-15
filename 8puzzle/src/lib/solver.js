// utilidades do 8-puzzle no cliente (sem backend)
const MOVES = [
  [1,3],[0,2,4],[1,5],
  [0,4,6],[1,3,5,7],[2,4,8],
  [3,7],[4,6,8],[5,7]
];

export function isSolvable(arr){
  let inv=0;
  for(let i=0;i<9;i++) for(let j=i+1;j<9;j++)
    if(arr[i]!==0 && arr[j]!==0 && arr[i]>arr[j]) inv++;
  return inv%2===0;
}

// embaralha mantendo solucionável (random walk a partir da goal)
export function shuffleSolvable(goal=[1,2,3,4,5,6,7,8,0], steps=200){
  let arr = [...goal];
  for(let i=0;i<steps;i++){
    const z = arr.indexOf(0);
    const choices = MOVES[z];
    const pick = choices[Math.floor(Math.random()*choices.length)];
    [arr[z], arr[pick]] = [arr[pick], arr[z]];
  }
  return arr;
}

const hMisplaced = (a, goal) => a.reduce((c,v,i)=> c + (v!==0 && v!==goal[i] ? 1:0), 0);
const hManhattan = (a, goal) => {
  const pos = new Array(9);
  for(let i=0;i<9;i++) pos[goal[i]] = i;
  let s=0;
  for(let i=0;i<9;i++){
    const v=a[i]; if(v===0) continue;
    const g = pos[v];
    s += Math.abs(Math.floor(i/3)-Math.floor(g/3)) + Math.abs((i%3)-(g%3));
  }
  return s;
};
const H = (name) => name==="MISPLACED" ? hMisplaced : hManhattan;

const key = (arr)=>arr.join(",");
const neighbors = (tiles)=>{
  const z = tiles.indexOf(0);
  return MOVES[z].map(m=>{
    const next = tiles.slice();
    next[z] = next[m]; next[m] = 0;
    return next;
  });
};

/**
 * solveClient - A* ou Greedy Best-First
 * @returns { path: number[][], visited: number, depth: number, cost: number }
 */
export function solveClient(initial, goal, algorithm="ASTAR", heuristic="MANHATTAN"){
  if(!isSolvable(initial)) throw new Error("Estado inicial não é solucionável");
  const h = H(heuristic);

  const cmp = (a,b)=>a.f-b.f;
  const open = []; // min-heap simples
  const push = (n)=>{ open.push(n); open.sort(cmp); };
  const pop  = ()=> open.shift();

  const start = { tiles: initial, g:0, f:(algorithm==="ASTAR" ? h(initial,goal) : h(initial,goal)), parent:null };
  push(start);

  const visitedSet = new Set();
  const bestG = new Map(); bestG.set(key(initial), 0);
  let visited=0;

  while(open.length){
    const cur = pop();
    const curKey = key(cur.tiles);
    if(visitedSet.has(curKey)) continue;
    visitedSet.add(curKey); visited++;

    if(curKey === key(goal)){
      const path = [];
      let p = cur;
      while(p){ path.unshift(p.tiles); p = p.parent; }
      return { path, visited, depth: path.length-1, cost: cur.g };
    }

    for(const nb of neighbors(cur.tiles)){
      const nbKey = key(nb);
      const g = cur.g + 1;
      if(algorithm==="ASTAR"){
        if(bestG.has(nbKey) && g >= bestG.get(nbKey)) continue;
        bestG.set(nbKey, g);
        const node = { tiles: nb, g, f: g + h(nb,goal), parent: cur };
        push(node);
      } else { // GREEDY
        if(visitedSet.has(nbKey)) continue;
        const node = { tiles: nb, g, f: h(nb,goal), parent: cur };
        push(node);
      }
    }
  }
  throw new Error("Solução não encontrada");
}

const onSolve = async () => {
  resetPlayback();
  setBusy(true);
  try {
    const res = await fetch("http://localhost:8080/api/solve", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ initial: state, goal, algorithm: algo, heuristic: heur })
    });
    const data = await res.json();
    setPath((data.path||[]).slice(1));
    setMetrics(data.metrics || null);
    setCursor(0); setPlaying(true);
  } finally { setBusy(false); }
};
