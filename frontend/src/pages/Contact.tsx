import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useCreateRecord } from '../hooks/useServiceB';
import type { ContactFormState } from './types';

// ── Styles ────────────────────────────────────────────────────────────────────
//
// Static properties live in `styles` (applied via the `style` prop); rules
// that need :hover, :focus, :disabled, or a responsive breakpoint stay in
// CONTACT_STYLES and are applied via className.

const styles: Record<string, CSSProperties> = {
  page: { background: '#fff', minHeight: '100vh' },

  header: { background: '#0f172a', padding: '2.5rem 0' },
  headerInner: { maxWidth: '72rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' },
  eyebrow: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fb923c', textTransform: 'uppercase' },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    marginTop: '0.75rem',
    maxWidth: '36rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  mainWrap: { maxWidth: '64rem', margin: '0 auto', padding: '3rem 1rem' },

  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    background: '#f8fafc',
    border: '1px solid #f1f5f9',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  infoIconWrap: {
    width: '3rem',
    height: '3rem',
    background: '#f97316',
    color: '#fff',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.75rem',
  },
  infoLabel: { fontWeight: 600, color: '#1e293b', fontSize: '0.875rem', marginBottom: '0.25rem' },
  infoLine: { color: '#64748b', fontSize: '0.75rem' },

  formCard: {
    maxWidth: '42rem',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    border: '1px solid #f1f5f9',
    padding: '2rem',
  },
  formTitle: { fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' },
  formSubtitle: { fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.5rem' },

  successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' },
  successTitle: { fontSize: '1.125rem', fontWeight: 600, color: '#15803d' },
  successText: { color: '#16a34a', fontSize: '0.875rem', marginTop: '0.25rem' },

  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' },

  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.75rem' },

  ctaSection: { background: '#0f172a', padding: '3rem 0' },
  ctaInner: { maxWidth: '42rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' },
  ctaSubtitle: { color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' },
};

const CONTACT_STYLES = `
.contact-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-top: 0.5rem;
}
@media (min-width: 768px) {
  .contact-title { font-size: 1.875rem; }
}

.contact-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 3rem;
}
@media (min-width: 640px) {
  .contact-info-grid { grid-template-columns: repeat(3, 1fr); }
}

.contact-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}
.contact-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #fb923c;
}

.contact-success-btn {
  margin-top: 1rem;
  background: #0f172a;
  color: #fff;
  font-size: 0.875rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.contact-success-btn:hover { background: #334155; }

.contact-submit-btn {
  width: 100%;
  background: #f97316;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.625rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}
.contact-submit-btn:hover:not(:disabled) { background: #ea580c; }
.contact-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.contact-cta-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}
@media (min-width: 768px) {
  .contact-cta-title { font-size: 1.5rem; }
}

.contact-cta-btn {
  display: inline-block;
  margin-top: 1.25rem;
  background: #f97316;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.15s ease;
}
.contact-cta-btn:hover { background: #ea580c; }
`;

function Contact() {
  const [form, setForm]           = useState<ContactFormState>({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { mutateAsync: createRecord, isPending: isLoading, error } = useCreateRecord();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createRecord({
        title:   form.name.trim(),
        content: form.message.trim(),
        status:  'pending',
        refId:   form.email.trim(),
      });
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch { /* error state surfaced via React Query `error` */ }
  };

  return (
    <div style={styles.page}>
      <style>{CONTACT_STYLES}</style>

      {/* Page header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>Get in Touch</span>
          <h1 className="contact-title">Contact Us</h1>
          <p style={styles.headerSubtitle}>
            We align leaders around a shared purpose and strategic story that catalyses their business and brand to take action.
          </p>
        </div>
      </div>

      <div style={styles.mainWrap}>

        {/* Info cards */}
        <div className="contact-info-grid">
          {[
            {
              icon:  <FaMapMarkerAlt size={20} />,
              label: 'Address',
              lines: ['Aparna Green Homes, Flat-207,', 'Hyderabad, TG 500032'],
            },
            {
              icon:  <FaEnvelope size={20} />,
              label: 'Email',
              lines: ['connect@servcrust.com', 'support@servcrust.com'],
            },
            {
              icon:  <FaPhoneAlt size={20} />,
              label: 'Phone',
              lines: ['+91 88 11 88 1111', '+1 (234) 987-654'],
            },
          ].map(({ icon, label, lines }) => (
            <div key={label} style={styles.infoCard}>
              <span style={styles.infoIconWrap}>
                {icon}
              </span>
              <h3 style={styles.infoLabel}>{label}</h3>
              {lines.map((line) => (
                <p key={line} style={styles.infoLine}>{line}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Send an Inquiry</h2>
          <p style={styles.formSubtitle}>We'll get back to you within 24 hours.</p>

          {submitted ? (
            <div style={styles.successBox}>
              <p style={styles.successTitle}>Inquiry sent!</p>
              <p style={styles.successText}>Our team will reach out to you shortly.</p>
              <button
                className="contact-success-btn"
                onClick={() => setSubmitted(false)}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-fields">
              <div>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="e.g. Ravi Kumar"
                  className="contact-input"
                />
              </div>
              <div>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="contact-input"
                />
              </div>
              <div>
                <label style={styles.label}>Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required rows={4}
                  placeholder="Tell us about your requirement…"
                  className="contact-input"
                  style={{ resize: 'none' }}
                />
              </div>

              {error && (
                <div style={styles.errorBox}>
                  {error instanceof Error
                    ? error.message
                    : (error as { message?: string })?.message ?? 'Failed to send inquiry. Please try again.'}
                </div>
              )}

              <button
                type="submit" disabled={isLoading}
                className="contact-submit-btn"
              >
                {isLoading ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* CTA banner */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <h2 className="contact-cta-title">Join us and be part of a better tomorrow</h2>
          <p style={styles.ctaSubtitle}>
            We are here to support — offering a wide network of ServCrust services with expert knowledge.
          </p>
          <Link to="/services" className="contact-cta-btn">
            See Open Roles
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Contact;
