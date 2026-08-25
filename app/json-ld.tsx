const organization = {
  "@type": "Organization",
  "@id": "https://buildkind.tech/#organization",
  name: "BuildKind Tech",
  legalName: "BuildKind Tech LLC",
  url: "https://buildkind.tech",
  email: "info@buildkind.tech",
  telephone: "+1-469-613-2763",
  logo: "https://buildkind.tech/assets/buildkind-logo.svg",
  description:
    "BuildKind builds modern websites and SimpleFrame POS for custom frame shops — including a merchant fee guarantee to beat the card-processing fees you currently pay.",
};

const simpleFrame = {
  "@type": "SoftwareApplication",
  name: "SimpleFrame",
  url: "https://simpleframe.app",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Cloud POS for custom frame shops — pricing, vendor catalogs, live frame preview, work orders, customers, invoices, and integrated merchant processing.",
  offers: {
    "@type": "Offer",
    price: "69",
    priceCurrency: "USD",
  },
  provider: { "@id": "https://buildkind.tech/#organization" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [organization, simpleFrame],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
