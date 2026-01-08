"use client";

import { useTranslations } from "next-intl";
import { Linkedin } from "lucide-react";

/**
 * Team member data structure for mapping translations to components.
 * Each member references their translation index.
 *
 * 4 Team Members (from PRD-04):
 * 1. Yonatan Levi - Founder & CEO
 * 2. Maya Cohen - Lead Developer
 * 3. David Amar - Business Automation Specialist
 * 4. Tamar Goldstein - Client Success Director
 */
const teamMembers: { id: string; index: number }[] = [
  { id: "member_1", index: 0 },
  { id: "member_2", index: 1 },
  { id: "member_3", index: 2 },
  { id: "member_4", index: 3 },
];

/**
 * Team Component (UI-04 / PRD-04)
 *
 * Displays team members with initials-based avatars, roles, bios, and social links
 * using glassmorphism card styling. Features staggered CSS fade-in animations
 * and supports prefers-reduced-motion.
 *
 * Layout:
 * - Mobile: 1 column grid
 * - Tablet: 2 columns
 * - Desktop: 4 columns (1x4 grid)
 *
 * Translation keys used:
 * - about.team.sectionTitle
 * - about.team.sectionSubtitle
 * - about.team.members[0-3].name
 * - about.team.members[0-3].role
 * - about.team.members[0-3].bio
 * - about.team.members[0-3].initials
 * - about.team.members[0-3].social.linkedin
 */
export function Team() {
  const t = useTranslations("about.team");

  return (
    <section
      id="team"
      className="w-full bg-brand-dark"
      aria-labelledby="team-title"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2
            id="team-title"
            className="text-3xl md:text-4xl lg:text-5xl font-display font-medium tracking-tight text-white animate-fade-in-up"
            style={{ animationDelay: "0s" }}
          >
            {t("sectionTitle")}
          </h2>
          <p
            className="text-base md:text-lg text-white/50 font-light tracking-tight max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {t("sectionSubtitle")}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, idx) => {
            const animationDelay = `${0.2 + idx * 0.1}s`;
            const linkedinUrl = t(`members.${member.index}.social.linkedin`);

            return (
              <article
                key={member.id}
                className="group relative p-6 md:p-8 rounded-xl border border-white/10 bg-[#111113]/80 backdrop-blur-md hover:border-white/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up flex flex-col items-center text-center"
                style={{ animationDelay }}
              >
                {/* Avatar with Initials */}
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-blue/10 border-2 border-white/10 flex items-center justify-center mb-4 md:mb-6"
                  aria-hidden="true"
                >
                  <span className="text-2xl md:text-3xl font-display font-semibold text-white">
                    {t(`members.${member.index}.initials`)}
                  </span>
                </div>

                {/* Member Name */}
                <h3 className="text-xl md:text-2xl font-semibold text-white text-center mb-1">
                  {t(`members.${member.index}.name`)}
                </h3>

                {/* Member Role */}
                <p className="text-sm md:text-base text-accent-blue font-medium text-center mb-3">
                  {t(`members.${member.index}.role`)}
                </p>

                {/* Member Bio */}
                <p className="text-sm text-neutral-400 text-center leading-relaxed mb-4 flex-grow">
                  {t(`members.${member.index}.bio`)}
                </p>

                {/* Social Links */}
                {linkedinUrl && (
                  <div className="mt-auto">
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Connect with ${t(`members.${member.index}.name`)} on LinkedIn`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white/40 hover:text-accent-blue transition-colors"
                    >
                      <Linkedin className="w-5 h-5" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Team;
