interface SkillBadgeProps {
  name: string;
  index?: number;
}

const COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200 ",
  "bg-indigo-100 text-indigo-800 border-indigo-200 ",
  "bg-violet-100 text-violet-800 border-violet-200 ",
  "bg-purple-100 text-purple-800 border-purple-200 ",
  "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 ",
];

export function SkillBadge({ name, index = 0 }: SkillBadgeProps) {
  const colorClass = COLORS[index % COLORS.length];
  
  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${colorClass}`}>
      {name}
    </span>
  );
}
