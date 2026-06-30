function Term() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Terms &amp; Conditions</h1>
          <p className="text-slate-400 text-sm mt-2">Please read these terms carefully before using our platform.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-sm text-slate-600 leading-7">
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
          <h2 className="text-base font-semibold text-slate-900 mb-2">General Terms &amp; Conditions</h2>
          <p>These General Terms and Conditions govern your access and use of the Platform. By accessing any part of the Platform, you agree to be bound by these terms. These terms form a legal and binding agreement between you and ServCrust pursuant to the Information Technology Act, 2000.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Amendment</h2>
          <p>ServCrust reserves the right to change, modify, add, or remove portions of these Terms at any time without prior notice. Your continued use of the Platform constitutes acceptance of any changes.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Jurisdiction and Dispute Resolution</h2>
          <p>These Terms shall be governed by Indian law. Disputes shall be first settled through negotiation; failing which, by arbitration under the Indian Arbitration and Conciliation Act, 1996, with venue in Hyderabad. The Courts of Hyderabad shall have exclusive jurisdiction.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Grievances</h2>
          <p>
            You can reach ServCrust at{' '}
            <a href="mailto:wecare@servcrust.com" className="text-orange-600 hover:underline">wecare@servcrust.com</a>.
            {' '}Grievance Officer: Mr. Kiran Kumar — wecare@servcrust.com, Flat No 207, Aparna Green Apartments, Nanakramguda, Gachibowli, Hyderabad - 500032.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Term;
