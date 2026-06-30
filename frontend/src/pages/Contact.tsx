import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useCreateRecord } from '../hooks/useServiceB';
import type { ContactFormState } from './types';

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
    <div className="bg-white min-h-screen">

      {/* Page header */}
      <div className="bg-slate-900 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Get in Touch</span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">Contact Us</h1>
          <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
            We align leaders around a shared purpose and strategic story that catalyses their business and brand to take action.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
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
            <div key={label} className="flex flex-col items-center text-center bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <span className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mb-3">
                {icon}
              </span>
              <h3 className="font-semibold text-slate-800 text-sm mb-1">{label}</h3>
              {lines.map((line) => (
                <p key={line} className="text-slate-500 text-xs">{line}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Send an Inquiry</h2>
          <p className="text-xs text-slate-400 mb-6">We'll get back to you within 24 hours.</p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-lg font-semibold text-green-700">Inquiry sent!</p>
              <p className="text-green-600 text-sm mt-1">Our team will reach out to you shortly.</p>
              <button
                className="mt-4 bg-slate-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                onClick={() => setSubmitted(false)}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="e.g. Ravi Kumar"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required rows={4}
                  placeholder="Tell us about your requirement…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-xs">
                  {error instanceof Error
                    ? error.message
                    : (error as { message?: string })?.message ?? 'Failed to send inquiry. Please try again.'}
                </div>
              )}

              <button
                type="submit" disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                {isLoading ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* CTA banner */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">Join us and be part of a better tomorrow</h2>
          <p className="text-slate-400 text-sm mt-2">
            We are here to support — offering a wide network of ServCrust services with expert knowledge.
          </p>
          <Link to="/services"
            className="inline-block mt-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            See Open Roles
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Contact;
