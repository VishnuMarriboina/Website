import type { CSSProperties } from "react";

// ── Styles ────────────────────────────────────────────────────────────────────
//
// Static properties live in `styles` (applied via the `style` prop); rules
// that need :hover, a responsive breakpoint, or sibling spacing (space-y)
// stay in POLICY_CSS and are applied via className.

const styles: Record<string, CSSProperties> = {
  page: { background: "#fff", minHeight: "100vh" },

  header: { background: "#0f172a", padding: "2.5rem 0" },
  headerInner: { maxWidth: "56rem", margin: "0 auto", padding: "0 1rem", textAlign: "center" },
  subtitle: { color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.5rem" },

  content: {
    maxWidth: "48rem",
    margin: "0 auto",
    padding: "3rem 1rem",
    fontSize: "0.875rem",
    color: "#475569",
    lineHeight: "1.75rem",
  },

  sectionTitle: { fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: "0.75rem" },
  paragraphMb2: { marginBottom: "0.5rem" },
  paragraphMt3: { marginTop: "0.75rem" },
};

const POLICY_CSS = `
.policy-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}
@media (min-width: 768px) {
  .policy-title { font-size: 1.875rem; }
}

.policy-content > * + * {
  margin-top: 2rem;
}

.policy-ol {
  list-style: decimal;
  padding-left: 1.25rem;
}
.policy-ol > li + li {
  margin-top: 0.5rem;
}
`;

function Refund() {
  return (
    <div style={styles.page}>
      <style>{POLICY_CSS}</style>

      <div style={styles.header}>
        <div style={styles.headerInner}>
          <h1 className="policy-title">Refund Policy</h1>
          <p style={styles.subtitle}>Our commitment to fair and transparent refunds.</p>
        </div>
      </div>

      <div style={styles.content} className="policy-content">

        <section>
          <h2 style={styles.sectionTitle}>Customer Cancellation</h2>
          <ol className="policy-ol">
            <li>The order cannot be cancelled by the buyer after the order is placed.</li>
            <li>Optional cancellation authorisation can be obtained upon request with proper justification.</li>
            <li>ServCrust reserves the right to deny any refund based on the buyer's previous cancellation history.</li>
            <li>If the buyer cancels before dispatch, a 10% cancellation fee is charged on the final invoice amount.</li>
            <li>Once the order is dispatched, the buyer is not eligible for any refund.</li>
          </ol>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Non-Customer Cancellation</h2>
          <p style={styles.paragraphMb2}>ServCrust may cancel orders for reasons including:</p>
          <ol className="policy-ol">
            <li>Incorrect or out-of-zone delivery address provided by buyer.</li>
            <li>Failure to contact buyer at time of delivery.</li>
            <li>Lack of information or authorisation from buyer at time of delivery.</li>
            <li>Item unavailability — in this case, buyer is entitled to a full refund.</li>
          </ol>
          <p style={styles.paragraphMt3}>Where cancellation is attributable to ServCrust, no penalty will be collected from the Buyer.</p>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Refunds</h2>
          <ol className="policy-ol">
            <li>Buyer may be entitled to a refund for prepaid orders, net of any applicable penalty.</li>
            <li>ServCrust's decision on refunds shall be final and binding.</li>
            <li>For wrong orders on delivery, buyer must notify ServCrust before the order is marked delivered.</li>
            <li>Refund amounts are credited to the buyer's account within the timelines of the chosen payment mechanism.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}

export default Refund;
