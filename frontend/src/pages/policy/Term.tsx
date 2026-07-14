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

  sectionTitle: { fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem" },
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

.policy-link {
  color: #ea580c;
}
.policy-link:hover {
  text-decoration: underline;
}
`;

function Term() {
  return (
    <div style={styles.page}>
      <style>{POLICY_CSS}</style>

      <div style={styles.header}>
        <div style={styles.headerInner}>
          <h1 className="policy-title">Terms &amp; Conditions</h1>
          <p style={styles.subtitle}>Please read these terms carefully before using our platform.</p>
        </div>
      </div>

      <div style={styles.content} className="policy-content">
        <p>
          This document is an electronic record in terms of the Information Technology Act, 2000. These Terms and Conditions ("Terms") govern your usage of www.servcrust.com (the "Website"), our mobile application (the "App"), and other channels maintained by ServCrust Private Limited ("ServCrust").
        </p>
        <p>
          Please read these Terms carefully. By installing, downloading or using the Platform you signify your acceptance of these Terms and other ServCrust policies.
        </p>
        <p>
          The Platform is owned and operated by ServCrust Private Limited, registered at Flat No 207, Aparna Green, Nanakramguda X Road, Gachibowli, Hyderabad - 500032, Telangana.
        </p>

        <section>
          <h2 style={styles.sectionTitle}>General Terms &amp; Conditions</h2>
          <p>These General Terms and Conditions govern your access and use of the Platform. By accessing any part of the Platform, you agree to be bound by these terms. These terms form a legal and binding agreement between you and ServCrust pursuant to the Information Technology Act, 2000.</p>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Amendment</h2>
          <p>ServCrust reserves the right to change, modify, add, or remove portions of these Terms at any time without prior notice. Your continued use of the Platform constitutes acceptance of any changes.</p>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Jurisdiction and Dispute Resolution</h2>
          <p>These Terms shall be governed by Indian law. Disputes shall be first settled through negotiation; failing which, by arbitration under the Indian Arbitration and Conciliation Act, 1996, with venue in Hyderabad. The Courts of Hyderabad shall have exclusive jurisdiction.</p>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Grievances</h2>
          <p>
            You can reach ServCrust at{' '}
            <a href="mailto:wecare@servcrust.com" className="policy-link">wecare@servcrust.com</a>.
            {' '}Grievance Officer: Mr. Kiran Kumar — wecare@servcrust.com, Flat No 207, Aparna Green Apartments, Nanakramguda, Gachibowli, Hyderabad - 500032.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Term;
