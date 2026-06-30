function Refund() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Refund Policy</h1>
          <p className="text-slate-400 text-sm mt-2">Our commitment to fair and transparent refunds.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-sm text-slate-600 leading-7">

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Customer Cancellation</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>The order cannot be cancelled by the buyer after the order is placed.</li>
            <li>Optional cancellation authorisation can be obtained upon request with proper justification.</li>
            <li>ServCrust reserves the right to deny any refund based on the buyer's previous cancellation history.</li>
            <li>If the buyer cancels before dispatch, a 10% cancellation fee is charged on the final invoice amount.</li>
            <li>Once the order is dispatched, the buyer is not eligible for any refund.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Non-Customer Cancellation</h2>
          <p className="mb-2">ServCrust may cancel orders for reasons including:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Incorrect or out-of-zone delivery address provided by buyer.</li>
            <li>Failure to contact buyer at time of delivery.</li>
            <li>Lack of information or authorisation from buyer at time of delivery.</li>
            <li>Item unavailability — in this case, buyer is entitled to a full refund.</li>
          </ol>
          <p className="mt-3">Where cancellation is attributable to ServCrust, no penalty will be collected from the Buyer.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Refunds</h2>
          <ol className="list-decimal pl-5 space-y-2">
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
