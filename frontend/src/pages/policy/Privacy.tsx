function Privacy() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-slate-400 text-sm mt-2">Last updated: June 01, 2023</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-sm text-slate-600 leading-7">
        <p>
          Welcome to ServCrust (www.servcrust.com). By using our platform you agree to this Privacy Policy.
        </p>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">I. Introduction</h2>
          <p>For the purposes of this Privacy Policy:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>"Act" means the Information Technology Act, 2000.</li>
            <li>"Personal Information (PI)" has the same meaning as under Rule 2(i) of the IT Rules, 2011.</li>
            <li>"Sensitive Personal Data (SPDI)" has the same meaning as under Rule 3 of the IT Rules, 2011.</li>
            <li>"User" means any person who views, browses, accesses or uses our Platform.</li>
          </ul>
          <p className="mt-2">By providing us with your Personal Information you expressly consent to us processing it in accordance with this Policy.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">II. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">III. Data We Collect</h2>
          <p>We collect registration information, usage data, device data, and communication records as described in our full policy at www.servcrust.com/privacypolicy.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">XIII. Contacting Us</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Questions or feedback: <a href="mailto:wecare@servcrust.com" className="text-orange-600 hover:underline">wecare@servcrust.com</a></li>
            <li>Grievance Officer: wecare@servcrust.com — Flat No 207, Aparna Green, Gachibowli, Hyderabad 500032.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
