"use client";

import { useTranslations } from "next-intl";
import { Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-white/10 bg-black py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Copyright */}
        <div className="text-xs text-white/30 font-medium">
          {t("copyright")}
        </div>

        {/* Social Links */}
        <div className="flex gap-6">
          <a
            href="#"
            className="text-white/30 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="text-white/30 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="text-white/30 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
