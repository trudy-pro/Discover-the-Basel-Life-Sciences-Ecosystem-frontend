const SWISS_NETWORK = ["Novartis Campus Hub", "Roche Innovation Center", "Biozentrum University Basel", "Switzerland Innovation Park"];
const COMPLIANCE = ["Swissmedic Integrated", "BSL-1 to BSL-4 Registry", "FADP / GDPR Compliant", "Cluster Node v4.0.8-CH"];

/** Desktop footer (from the Stitch desktop design). On smaller screens the bottom nav replaces it. */
export function SiteFooter() {
  return (
    <footer className="no-print hidden bg-canvas-low py-10 lg:block">
      <div className="mx-auto max-w-7xl px-12">
        <div className="mb-10 grid grid-cols-4 gap-6">
          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded bg-primary text-label-sm font-bold text-white">
                CH
              </span>
              <span className="text-headline-sm font-bold tracking-tight text-ink">Ariadne</span>
            </div>
            <p className="max-w-md text-body-sm text-stitch-on-surface-variant">
              Precision bio-intelligence infrastructure connecting Basel-Stadt, Basel-Landschaft, Jura, and international
              life sciences clusters with next-generation automated navigation.
            </p>
          </div>
          <FooterList title="Swiss Network" items={SWISS_NETWORK} />
          <FooterList title="Compliance & Node" items={COMPLIANCE} />
        </div>
        <div className="border-t border-stitch-surface-highest pt-4">
          <p className="text-label-sm text-stitch-on-surface-variant">© 2026 Ariadne</p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="mb-2 text-label-md font-bold uppercase tracking-wider text-ink">{title}</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-body-sm text-stitch-on-surface-variant">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
