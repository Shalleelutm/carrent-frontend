export default function MapEmbed() {
  // Replace with your real Google Maps embed link later
  const embed =
    "https://www.google.com/maps?q=Sir%20Seewoosagur%20Ramgoolam%20International%20Airport&output=embed";

  return (
    <section className="py-16 bg-black/[0.02]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-sm font-black text-[#0057ff]">Find us</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-black">
                Airport delivery ready.
              </h2>
              <p className="mt-2 text-black/60 max-w-2xl">
                Customers trust websites that show location + real support channels.
              </p>
            </div>

            <div className="rounded-full bg-black px-5 py-3 text-white font-black">
              AM Thirty Eight • Mauritius
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-black/10">
            <iframe
              title="AM38 Map"
              src={embed}
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}