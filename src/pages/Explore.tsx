export default function Explore() {
  return (
    <div className="min-h-screen bg-[#060A10] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-3xl font-black">Explore Mauritius</h2>
        <p className="text-white/70 mt-2">
          Next phase: show beaches, hotels, and pickup suggestions (map +
          recommended routes).
        </p>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { t: "North", d: "Grand Baie • Pereybère • Cap Malheureux" },
            { t: "West", d: "Flic en Flac • Tamarin • Le Morne" },
            { t: "South & East", d: "Blue Bay • Mahebourg • Belle Mare" },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="font-extrabold">{x.t}</div>
              <div className="text-white/70 text-sm mt-1">{x.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}