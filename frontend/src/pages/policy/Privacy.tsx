import type { CSSProperties } from "react";

// ── Styles ────────────────────────────────────────────────────────────────────
//
// Static properties live in `styles` (applied via the `style` prop); rules
// that need :hover, a responsive breakpoint, or sibling spacing (space-y)
// stay in POLICY_CSS and are applied via className.

const styles: Record<string, CSSProperties> = {
  page: { background: "#fff", minHeight: "100vh" },

  header: { background: "#0f172a", padding: "2.5rem 0" },
  headerInner: {
    maxWidth: "56rem",
    margin: "0 auto",
    padding: "0 1rem",
    textAlign: "center",
  },
  subtitle: { color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.5rem" },

  content: {
    maxWidth: "48rem",
    margin: "0 auto",
    padding: "3rem 1rem",
    fontSize: "0.875rem",
    color: "#475569",
    lineHeight: "1.75rem",
  },

  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: "0.5rem",
  },
  paragraphMt2: { marginTop: "0.5rem" },
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

.policy-ul {
  list-style: disc;
  padding-left: 1.25rem;
}
.policy-ul > li + li {
  margin-top: 0.25rem;
}

.policy-link {
  color: #ea580c;
}
.policy-link:hover {
  text-decoration: underline;
}
`;

function Privacy() {
  return (
    <div style={styles.page}>
      <style>{POLICY_CSS}</style>

      <div style={styles.header}>
        <div style={styles.headerInner}>
          <h1 className="policy-title">Privacy Policy</h1>
          <p style={styles.subtitle}>Last updated: June 01, 2023</p>
        </div>
      </div>

      <div style={styles.content} className="policy-content">
        <p>
          Welcome to ServCrust (www.servcrust.com). By using our platform you
          agree to this Privacy Policy.
        </p>

        <section>
          <h2 style={styles.sectionTitle}>I. Introduction</h2>
          <p>For the purposes of this Privacy Policy:</p>
          <ul className="policy-ul" style={styles.paragraphMt2}>
            <li>"Act" means the Information Technology Act, 2000.</li>
            <li>
              "Personal Information (PI)" has the same meaning as under Rule
              2(i) of the IT Rules, 2011.
            </li>
            <li>
              "Sensitive Personal Data (SPDI)" has the same meaning as under
              Rule 3 of the IT Rules, 2011.
            </li>
            <li>
              "User" means any person who views, browses, accesses or uses our
              Platform.
            </li>
          </ul>
          <p style={styles.paragraphMt2}>
            By providing us with your Personal Information you expressly consent
            to us processing it in accordance with this Policy.
          </p>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>II. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use
            of the platform after changes constitutes acceptance of the updated
            policy.
          </p>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>III. Data We Collect</h2>
          <p>
            We collect registration information, usage data, device data, and
            communication records as described in our full policy at
            www.servcrust.com/privacypolicy.
          </p>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>XIII. Contacting Us</h2>
          <ul className="policy-ul">
            <li>
              Questions or feedback:{" "}
              <a href="mailto:wecare@servcrust.com" className="policy-link">
                wecare@servcrust.com
              </a>
            </li>
            <li>
              Grievance Officer: wecare@servcrust.com — Flat No 207, Aparna
              Green, Gachibowli, Hyderabad 500032.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
