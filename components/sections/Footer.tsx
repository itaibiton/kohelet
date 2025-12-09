export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 bg-[#010101] text-[10px] uppercase tracking-widest text-neutral-600 font-mono">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-600 rotate-45 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
          <span className="text-neutral-300 font-semibold">KOHELET SYSTEMS</span>
        </div>

        {/* Links */}
        <div className="flex gap-10">
          <a href="#solutions" className="hover:text-blue-400 transition-colors">Services</a>
          <a href="#process" className="hover:text-blue-400 transition-colors">Methodology</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
        </div>

        {/* Copyright */}
        <div className="text-right">
          <div className="mb-1">&copy; {new Date().getFullYear()} DIGITAL ARCHITECTURE</div>
          <div className="text-[8px] text-neutral-700">ENCRYPTED CONNECTION SECURE</div>
        </div>
      </div>
    </footer>
  );
}
