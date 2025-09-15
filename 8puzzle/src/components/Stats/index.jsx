export default function Stats({ metrics, pathLen }){
  return (
    <div className="stack">
      <div className="label">Métricas</div>
      <div className="row" style={{gap:8, flexWrap:"wrap"}}>
        <span className="badge">Caminho: <b style={{marginLeft:6}}>{pathLen||0}</b></span>
        <span className="badge">Tempo: <b style={{marginLeft:6}}>{metrics?.millis ?? 0} ms</b></span>
        <span className="badge">Visitados: <b style={{marginLeft:6}}>{metrics?.visited ?? 0}</b></span>
        <span className="badge">Profundidade: <b style={{marginLeft:6}}>{metrics?.depth ?? 0}</b></span>
        {metrics?.cost != null && <span className="badge">Custo g(n): <b style={{marginLeft:6}}>{metrics.cost}</b></span>}
      </div>
    </div>
  );
}
