import { BRAND_GEOMETRY } from "@/lib/brand-geometry";

interface BrandMarkProps {
  /** Ink colour. The wordmark PNG is used as an alpha mask so any colour works. */
  color?: "cobalt" | "white";
  /** Size it with a height utility, e.g. "h-10". Width follows the wordmark's aspect ratio. */
  className?: string;
}

/** The "KIKI on the Miami River" wordmark, rendered from the supplied PNG as a mask. */
export default function BrandMark({ color = "cobalt", className = "" }: BrandMarkProps) {
  const { src, width, height } = BRAND_GEOMETRY.wordmark;
  return (
    <span
      role="img"
      aria-label="KIKI on the Miami River"
      className={`inline-block ${className}`}
      style={{
        aspectRatio: `${width} / ${height}`,
        backgroundColor: color === "cobalt" ? "#1238B8" : "#FFFFFF",
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
