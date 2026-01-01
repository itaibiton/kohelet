type StatItemProps = {
  value: string;
  unit: string;
  label: string;
  color?: string;
};

export const StatItem = ({
  value,
  unit,
  label,
  color = "text-white",
}: StatItemProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-2xl font-mono ${color}`}>{value}</span>
        <span className="text-xs font-mono text-neutral-500">{unit}</span>
      </div>
      <div className="text-[0.625rem] text-neutral-600 uppercase tracking-widest font-mono">
        {label}
      </div>
    </div>
  );
};
