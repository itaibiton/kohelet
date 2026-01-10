"use client";

import dynamic from "next/dynamic";
import { Mail, Phone } from "lucide-react";

/**
 * ContactWrapper Component
 *
 * Dynamically loads the Contact component to reduce initial bundle size:
 * - Uses dynamic import with ssr: false to defer loading
 * - Shows loading skeleton during import with glassmorphism aesthetic
 * - Matches Contact section's dark theme styling
 * - Supports RTL layout for Hebrew locale
 */

// Dynamically import Contact with no SSR
const Contact = dynamic(() => import("./Contact").then((mod) => mod.Contact), {
  ssr: false,
  loading: () => <ContactSkeleton />,
});

/**
 * Loading skeleton that matches Contact section's structure and styling
 * Uses glassmorphism with dark theme aesthetic
 */
function ContactSkeleton() {
  return (
    <section
      id="contact"
      className="w-full bg-[#030303] border-t border-white/5 py-24 px-6 relative z-10"
      aria-busy="true"
      aria-label="Loading contact form"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column Skeleton - Info */}
          <div>
            {/* Headline skeleton */}
            <div className="space-y-3 mb-6">
              <div className="h-12 w-3/4 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-12 w-2/3 bg-white/5 rounded-lg animate-pulse" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-8 max-w-sm">
              <div className="h-4 w-full bg-white/[0.03] rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-white/[0.03] rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-white/[0.03] rounded animate-pulse" />
            </div>

            {/* Contact Info skeleton */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent-blue/50 shrink-0" />
                <div className="h-4 w-48 bg-white/[0.03] rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent-blue/50 shrink-0" />
                <div className="h-4 w-40 bg-white/[0.03] rounded animate-pulse" />
              </div>
            </div>

            {/* Availability Badge skeleton */}
            <div className="mt-12 p-4 rounded-lg bg-white/5 border border-white/10 inline-flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue/30 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue/50"></span>
              </div>
              <div className="h-3 w-32 bg-white/[0.03] rounded animate-pulse" />
            </div>
          </div>

          {/* Right Column Skeleton - Form */}
          <div className="space-y-6">
            {/* Name & Email Row skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/[0.03] rounded animate-pulse" />
                <div className="h-11 w-full bg-white/[0.03] border border-white/10 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/[0.03] rounded animate-pulse" />
                <div className="h-11 w-full bg-white/[0.03] border border-white/10 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Phone skeleton */}
            <div className="space-y-2">
              <div className="h-3 w-20 bg-white/[0.03] rounded animate-pulse" />
              <div className="h-11 w-full bg-white/[0.03] border border-white/10 rounded-lg animate-pulse" />
            </div>

            {/* Service Select skeleton */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-white/[0.03] rounded animate-pulse" />
              <div className="h-11 w-full bg-white/[0.03] border border-white/10 rounded-lg animate-pulse" />
            </div>

            {/* Message skeleton */}
            <div className="space-y-2">
              <div className="h-3 w-20 bg-white/[0.03] rounded animate-pulse" />
              <div className="h-28 w-full bg-white/[0.03] border border-white/10 rounded-lg animate-pulse" />
            </div>

            {/* Submit Button skeleton */}
            <div className="h-12 w-full bg-accent-blue/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

interface ContactWrapperProps {
  className?: string;
}

export function ContactWrapper({ className }: ContactWrapperProps) {
  return <Contact />;
}

export default ContactWrapper;
