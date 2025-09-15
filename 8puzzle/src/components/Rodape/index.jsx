export default function Rodape() {
  const year = new Date().getFullYear();

  return (
    <footer className="panel" style={{ marginTop: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div className="sub">
          © {year} • Desenvolvido por <b>Victor Hugo</b>
        </div>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <a className="badge" aria-label="Contato por e-mail">
            victor.donaire@hotmail.com
          </a>
          <a className="badge" href="https://www.linkedin.com/in/victor-donaire-31b778165/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="badge" href="https://github.com/Victor200524" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span className="badge">v1.0</span>
        </div>
      </div>
    </footer>
  );
}
