export default function Board({ state, onClickTile }){
  return (
    <div className="grid">
      {state.map((n, i) => (
        <button
          key={i}
          className={`tile ${n===0?"zero":"num"} btn`}
          onClick={() => n!==0 && onClickTile(i)}
          aria-label={n===0?"vazio":`mover ${n}`}
        >
          {n!==0 ? n : ""}
        </button>
      ))}
    </div>
  );
}
