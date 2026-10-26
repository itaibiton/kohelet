/**
 * The four letters of the stacked Kohelet mark (public/logo-vertical-no-digital.svg),
 * each as its own SVG so the hero can really split the logo per character.
 * `box` is the letter's bounding box inside the original 122×122 viewBox, used to
 * reassemble the whole mark before the entrance animation.
 */

export type GlyphName = "kuf" | "he" | "lamed" | "tav";

export interface Glyph {
  /** [x, y, width, height] inside the 122×122 logo space */
  box: [number, number, number, number];
  paths: string[];
}

export const GLYPHS: Record<GlyphName, Glyph> = {
  kuf: {
    box: [55.7, 0.1, 57.7, 84.9],
    paths: [
      "M88.258 70.827V60.805q5.603 -0.219 8.692 -3.414q3.132 -3.238 3.133 -9.41V28.726H69.196V18.441h44.212v29.322q0 7.22 -3.045 12.298q-3.044 5.033 -8.692 7.79q-5.604 2.713 -13.414 2.976",
      "M69.726 38.008v46.968H82.52V36.651q0 -3.327 0.221 -5.733q0.264 -2.407 0.662 -4.114H72.77q-0.75 0.963 -1.897 3.457t-1.147 7.747",
      "M71.970 7.883c-1.649 -0.533 -3.396 -1.593 -4.943 -3.109c-1.493 -1.463 -2.56 -3.115 -3.134 -4.693c-0.526 1.664 -1.607 3.435 -3.166 5c-1.58 1.588 -3.38 2.69 -5.073 3.224c1.609 0.547 3.301 1.589 4.806 3.063c1.56 1.528 2.654 3.263 3.207 4.904c0.507 -1.71 1.606 -3.545 3.215 -5.16c1.585 -1.593 3.392 -2.697 5.089 -3.23",
    ],
  },
  he: {
    box: [17.2, 8.8, 42.8, 51.1],
    paths: [
      "M46.998 59.890V26.998q0 -4.138 -2.15 -6.143q-2.108 -2.005 -6.495 -2.005h-20.99V8.824h21.893q9.936 0 15.312 4.906q5.377 4.864 5.377 13.865V59.89z",
      "M17.234 59.890V42.4q0 -5.205 1.118 -7.594q1.119 -2.431 1.893 -3.37h10.323q-0.388 1.665 -0.603 4.01q-0.215 2.346 -0.215 5.589V59.89z",
    ],
  },
  lamed: {
    box: [49.9, 77.9, 67.8, 42.6],
    paths: [
      "M92.384 77.930h25.327v13.173h-14.958v24.77H92.384z",
      "M94.281 120.469l-44.343 -17.55v-13.96l52.815 21.531v9.979z",
    ],
  },
  tav: {
    box: [1.3, 67.3, 51.8, 53.1],
    paths: [
      "M32.087 67.339q10.369 0 15.664 4.989q5.338 4.989 5.338 14.88v32.517H39.852l-0.088 -33.611q0 -4.29 -1.897 -6.39q-1.854 -2.1 -5.736 -2.1h-6.883q-0.795 2.406 -1.192 5.382a43 43 0 0 0 -0.397 5.646v15.274q0 7.921 -4.192 12.254q-4.147 4.289 -11.648 4.289q-1.81 0 -3.31 -0.175q-1.5 -0.131 -3.22 -0.394v-10.197l1.456 0.087H4.2q3.22 0 4.853 -1.662q1.633 -1.663 1.633 -5.209V89.834q0 -2.757 0.75 -6.259q0.75 -3.501 2.383 -5.952H5.392V67.34z",
    ],
  },
};

/** Order of the letters in the mark: top row ק ה (right to left), bottom row ל ת. */
export const GLYPH_ORDER: GlyphName[] = ["kuf", "he", "lamed", "tav"];

export function KoheletGlyph({ name, className }: { name: GlyphName; className?: string }) {
  const g = GLYPHS[name];
  const [x, y, w, h] = g.box;
  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      className={className}
      data-box={g.box.join(",")}
      aria-hidden="true"
      focusable="false"
    >
      {g.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
