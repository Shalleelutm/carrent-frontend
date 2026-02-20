export default function Footer() {
  return (
    <footer className="border-t border-white/10 glass">
      <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="font-extrabold">
            AM <span className="text-[color:var(--gold2)]">Thirty Eight</span>
          </div>
          <div className="text-sm text-white/60">
            Premium car rental experience — fast, safe, and beautiful.
          </div>
        </div>

        <div className="text-sm text-white/60">
          © {new Date().getFullYear()} AM Thirty Eight • All rights reserved
        </div>
      </div>
    </footer>
  );
}