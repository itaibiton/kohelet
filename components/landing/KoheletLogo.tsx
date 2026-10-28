/**
 * Kohelet stacked mark (from public/logo-vertical-no-digital.svg) inlined so it
 * takes `currentColor` and can be sliced horizontally like the 360i hero:
 * `part="top"` shows the upper half of the glyphs, `part="bottom"` the lower half.
 */

const VIEW_W = 122;
const VIEW_H = 122;
/** y where the stacked mark (קה over לת) is cut into its two halves. */
const CUT_Y = 61;

const PATHS = [
  "M46.998 59.89V26.998q0-4.138-2.15-6.143-2.108-2.005-6.495-2.005h-20.99V8.824h21.893q9.936 0 15.312 4.906 5.377 4.864 5.377 13.865V59.89zm-29.764 0V42.4q0-5.205 1.118-7.594 1.119-2.431 1.893-3.37h10.323q-.388 1.665-.603 4.01-.215 2.346-.215 5.589V59.89zm71.024 10.937V60.805q5.603-.219 8.692-3.414 3.132-3.238 3.133-9.41V28.726H69.196V18.441h44.212v29.322q0 7.22-3.045 12.298-3.044 5.033-8.692 7.79-5.604 2.713-13.414 2.976",
  "M69.726 38.008v46.968H82.52V36.651q0-3.327.221-5.733.264-2.407.662-4.114H72.77q-.75.963-1.897 3.457t-1.147 7.747M92.384 77.93h25.327v13.173h-14.958v24.77H92.384zm1.897 42.539-44.343-17.55v-13.96l52.815 21.531v9.979z",
  "M32.087 67.339q10.369 0 15.664 4.989 5.338 4.989 5.338 14.88v32.517H39.852l-.088-33.611q0-4.29-1.897-6.39-1.854-2.1-5.736-2.1h-6.883q-.795 2.406-1.192 5.382a43 43 0 0 0-.397 5.646v15.274q0 7.921-4.192 12.254-4.147 4.289-11.648 4.289-1.81 0-3.31-.175-1.5-.131-3.22-.394v-10.197l1.456.087H4.2q3.22 0 4.853-1.662 1.633-1.663 1.633-5.209V89.834q0-2.757.75-6.259.75-3.501 2.383-5.952H5.392V67.34zM71.97 7.883c-1.649-.533-3.396-1.593-4.943-3.109-1.493-1.463-2.56-3.115-3.134-4.693-.526 1.664-1.607 3.435-3.166 5-1.58 1.588-3.38 2.69-5.073 3.224 1.609.547 3.301 1.589 4.806 3.063 1.56 1.528 2.654 3.263 3.207 4.904.507-1.71 1.606-3.545 3.215-5.16 1.585-1.593 3.392-2.697 5.089-3.23",
];

const VIEWBOX = {
  full: `0 0 ${VIEW_W} ${VIEW_H}`,
  top: `0 0 ${VIEW_W} ${CUT_Y}`,
  bottom: `0 ${CUT_Y} ${VIEW_W} ${VIEW_H - CUT_Y}`,
};

/** Ratio of bottom-slice height to top-slice height, so both render at the same scale. */
export const LOGO_BOTTOM_TO_TOP = (VIEW_H - CUT_Y) / CUT_Y;

export function KoheletLogo({
  part = "full",
  className,
  title,
}: {
  part?: "full" | "top" | "bottom";
  className?: string;
  title?: string;
}) {
  const decorative = !title;
  return (
    <svg
      viewBox={VIEWBOX[part]}
      preserveAspectRatio={part === "top" ? "xMidYMax meet" : part === "bottom" ? "xMidYMin meet" : "xMidYMid meet"}
      fill="currentColor"
      className={className}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
