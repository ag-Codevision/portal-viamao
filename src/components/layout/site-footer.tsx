import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="site-footer container">
      <div>
        <Link
          href="/"
          className="footer-brand"
          aria-label="Portal TV Viamão, início"
        >
          <img
            src="/logo.png"
            alt="Portal TV Viamão"
            className="footer-logo-img"
          />
        </Link>
        <p>
          Histórias que aproximam.
          <br />
          Uma cidade, muitos olhares.
        </p>
      </div>
      <nav aria-label="Links institucionais">
        {[
          ["sobre", "Sobre o portal"],
          ["contato", "Contato"],
          ["privacidade", "Privacidade"],
          ["termos", "Termos"],
          ["acessibilidade", "Acessibilidade"],
        ].map(([slug, label]) => (
          <Link href={`/${slug}`} key={slug}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="footer-bottom">
        <span>© 2026 • Viamão, Rio Grande do Sul</span>
        <span>
          Protótipo · TV local demonstrativa · Fontes externas oficiais
        </span>
      </div>
    </footer>
  );
}
