import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  tag: string;
};

export const FeatureCard = ({
  icon,
  title,
  description,
  tag,
}: FeatureCardProps) => {
  return (
    <div className="relative group p-6 rounded-sm bg-[#08080a] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-0 end-0 text-[9px] font-mono text-neutral-500 uppercase border border-white/10 px-1 py-0.5 rounded-sm">
        {tag}
      </div>

      <div className="relative z-10">
        <div className="w-10 h-10 mb-5 flex items-center justify-center rounded-sm bg-white/5 border border-white/5 group-hover:border-blue-500/40 group-hover:text-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500">
          {icon}
        </div>

        <h3 className="text-sm font-semibold text-white tracking-tight mb-2 group-hover:text-blue-100 transition-colors duration-500">
          {title}
        </h3>

        <p className="text-xs text-neutral-500 leading-relaxed font-mono">
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
};
