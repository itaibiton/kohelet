"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full py-12 px-6 md:px-12 bg-[#0f0f0f] border-t border-[#a0a0a0]/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-light text-[#fafafa] mb-2">
              Kohelet
            </h3>
            <p className="text-sm text-[#a0a0a0]">
              Crafting digital experiences that inspire.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <a
              href="#about"
              className="text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors duration-300"
            >
              About
            </a>
            <a
              href="#services"
              className="text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors duration-300"
            >
              Services
            </a>
            <a
              href="#approach"
              className="text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors duration-300"
            >
              Approach
            </a>
            <a
              href="#contact"
              className="text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#a0a0a0]/10 text-center">
          <p className="text-sm text-[#a0a0a0]">
            © {currentYear} Kohelet Digital Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
