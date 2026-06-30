import q1 from '../Images/Scan/dr1.webp';
import { BsQrCodeScan } from 'react-icons/bs';

const steps = [
  {
    number: '01',
    title:  'Scan & Say Hi',
    desc:   'Scan the QR code to open our WhatsApp. Send "Hi" along with your GPS location to browse products available near you.',
  },
  {
    number: '02',
    title:  'Choose & Confirm',
    desc:   'Browse the product catalogue, select the type and quantity of aggregate you need, and confirm your order via chat.',
  },
  {
    number: '03',
    title:  'Pay & Receive',
    desc:   'Pay via UPI or choose Pay-on-Delivery (PoD). Your order is delivered to your site within 24 hours.',
  },
];

function Qr() {
  return (
    <div className="bg-white min-h-screen">

      {/* Page header */}
      <div className="bg-slate-900 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Quick Order</span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">Order via WhatsApp</h1>
          <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Scan the code below to connect with ServCrust on WhatsApp and place your order in minutes.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* QR Card */}
          <div className="flex flex-col items-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg w-full max-w-sm mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-5">
                <BsQrCodeScan className="text-orange-500" size={22} />
                <h2 className="font-bold text-slate-900 text-lg">Scan to Order</h2>
              </div>
              <div className="rounded-2xl overflow-hidden border-4 border-orange-100 shadow-inner bg-white p-2">
                <img src={q1} alt="ServCrust WhatsApp QR Code" className="w-full object-contain" />
              </div>
              <div className="mt-5 bg-orange-50 border border-orange-100 rounded-xl py-2.5 px-4">
                <p className="text-xs text-orange-700 font-medium">Point your phone camera at this code</p>
                <p className="text-xs text-orange-500 mt-0.5">Opens WhatsApp instantly — no app needed</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-slate-900">How to connect with ServCrust</h2>
            {steps.map(({ number, title, desc }) => (
              <div key={number} className="flex gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-orange-200 transition-colors">
                <span className="text-2xl font-extrabold text-orange-200 shrink-0 leading-none">{number}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mt-2">
              <p className="text-xs font-semibold text-orange-700 mb-1">Available 7 days a week</p>
              <p className="text-xs text-orange-600">Our team is available Monday–Sunday, 8 AM – 8 PM IST to help with your orders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Qr;
