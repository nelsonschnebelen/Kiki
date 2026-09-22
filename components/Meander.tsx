/** A short run of the wheel's Greek key, used as a section divider. */
export default function Meander({ className = "", units = 9 }: { className?: string; units?: number }) {
  const w = units * 40;
  return (
    <svg viewBox={`0 0 ${w} 16`} width={w} height={16} className={`text-cobalt ${className}`} aria-hidden focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="miter" strokeLinecap="square">
        {Array.from({ length: units }, (_, i) => (
          <path key={i} d="M0 14 H7 V2 H33 V10 H13 V6 H27 M33 14 H40" transform={`translate(${i * 40} 0)`} />
        ))}
      </g>
    </svg>
  );
}
