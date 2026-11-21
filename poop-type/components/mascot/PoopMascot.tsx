import { PoopTypeCode } from "@/lib/types-data";

export type MascotMood =
  | "idle"
  | "excited"
  | "thinking"
  | "celebrating"
  | "shy";

interface PoopMascotProps {
  mood?: MascotMood;
  code?: PoopTypeCode;
  size?: number;
  className?: string;
  animated?: boolean;
  label?: string;
}

/**
 * Reusable inline-SVG cartoon poop mascot.
 * Generates 16 visually distinct variants from the 4-letter PoopTypeCode:
 *  - Axis 1 (Form):    P = tall tidy swirl | F = squished melty blob
 *  - Axis 2 (Outline): P = smooth contour  | R = wobbly/jagged contour
 *  - Axis 3 (Tone):    T = deep dark brown | L = warm golden brown
 *  - Axis 4 (Sheen):   O = glossy highlights | D = matte + sunglasses/cactus accessory
 */
export function PoopMascot({
  mood = "idle",
  code,
  size = 120,
  className = "",
  animated = true,
  label,
}: PoopMascotProps) {
  const form = code ? code[0] : "P";
  const outline = code ? code[1] : "P";
  const tone = code ? code[2] : "T";
  const sheen = code ? code[3] : "O";

  const isTall = form === "P";
  const isRagged = outline === "R";
  const isToasted = tone === "T";
  const isOily = sheen === "O";

  // Palette based on Tone (Axis 3)
  const bodyFill = isToasted ? "#744420" : "#C98C3D";
  const shadeFill = isToasted ? "#583114" : "#A66E24";
  const ridgeHighlight = isToasted ? "#8F5A2F" : "#E1A95A";

  // Four distinct silhouettes across Form (P/F) x Outline (P/R)
  let bodyPath: string;
  let shadePath: string;
  let faceOffsetY = 0;

  if (isTall && !isRagged) {
    // P + P: Tall, tidy, smooth 3-tier swirl
    bodyPath =
      "M72 16 C75 26 88 30 92 42 C96 52 104 54 106 66 C113 72 117 82 114 94 C111 106 96 112 70 112 C44 112 29 106 26 94 C23 82 27 72 34 66 C36 54 44 52 48 42 C52 31 64 26 67 16 C68 12 71 12 72 16 Z";
    shadePath =
      "M34 94 C42 103 56 106 70 106 C84 106 98 103 106 94 C109 102 95 109 70 109 C45 109 31 102 34 94 Z";
    faceOffsetY = 0;
  } else if (isTall && isRagged) {
    // P + R: Tall swirl with wobbly, jagged cartoon contour
    bodyPath =
      "M70 14 L77 25 L88 28 L87 38 L98 44 L96 54 L109 61 L106 71 L117 79 L111 89 L115 99 L102 108 L88 112 L70 109 L52 112 L38 108 L25 99 L29 89 L23 79 L34 71 L31 61 L44 54 L42 44 L53 38 L52 28 L63 25 Z";
    shadePath =
      "M36 96 L52 105 L70 102 L88 105 L104 96 L100 106 L70 109 L40 106 Z";
    faceOffsetY = 1;
  } else if (!isTall && !isRagged) {
    // F + P: Squished, wide, smooth melty blob
    bodyPath =
      "M70 40 C86 40 96 48 100 58 C114 62 124 74 124 88 C124 104 110 114 70 114 C30 114 16 104 16 88 C16 74 26 62 40 58 C44 48 54 40 70 40 Z";
    shadePath =
      "M25 95 C38 106 54 109 70 109 C86 109 102 106 115 95 C112 106 96 112 70 112 C44 112 28 106 25 95 Z";
    faceOffsetY = 9;
  } else {
    // F + R: Squished, wide, wobbly/jagged ragged puddle blob
    bodyPath =
      "M70 39 L82 44 L94 42 L99 54 L112 58 L113 69 L125 77 L120 88 L125 99 L112 109 L96 113 L82 110 L70 114 L58 110 L44 113 L28 109 L15 99 L20 88 L15 77 L27 69 L28 58 L41 54 L46 42 L58 44 Z";
    shadePath =
      "M26 98 L46 107 L70 105 L94 107 L114 98 L106 109 L70 112 L34 109 Z";
    faceOffsetY = 10;
  }

  const showSunglasses = !isOily && form === "P";
  const showCactus = !isOily && form === "F";

  const wrapperAnim =
    animated && (mood === "idle" || mood === "celebrating" || mood === "excited")
      ? "animate-mascot-bob"
      : "";

  const ariaProps = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-mascot-variant={code ?? "DEFAULT"}
      data-mascot-mood={mood}
      className={`shrink-0 overflow-visible select-none ${wrapperAnim} ${className}`}
      {...ariaProps}
    >
      {/* Ground sticker shadow */}
      <ellipse
        cx="70"
        cy="121"
        rx={isTall ? 40 : 48}
        ry="7"
        fill="#1B1B1F"
        opacity="0.16"
      />

      {/* Celebrating raised arms */}
      {mood === "celebrating" && (
        <g stroke="#1B1B1F" strokeWidth="4" strokeLinecap="round">
          <path d={`M32 ${76 + faceOffsetY} Q14 ${56 + faceOffsetY} 16 ${38 + faceOffsetY}`} />
          <path d={`M108 ${76 + faceOffsetY} Q126 ${56 + faceOffsetY} 124 ${38 + faceOffsetY}`} />
          <circle cx="16" cy={36 + faceOffsetY} r="4.5" fill={bodyFill} strokeWidth="3" />
          <circle cx="124" cy={36 + faceOffsetY} r="4.5" fill={bodyFill} strokeWidth="3" />
        </g>
      )}

      {/* Main cartoon poop body */}
      <path
        d={bodyPath}
        fill={bodyFill}
        stroke="#1B1B1F"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Subtle tier crease lines for swirl depth */}
      {isTall ? (
        <>
          <path
            d="M44 64 Q70 71 96 64"
            stroke={shadeFill}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M54 44 Q70 49 86 44"
            stroke={ridgeHighlight}
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.7"
          />
        </>
      ) : (
        <path
          d="M44 65 Q70 72 96 65"
          stroke={ridgeHighlight}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      )}

      {/* Bottom belly shading */}
      <path d={shadePath} fill={shadeFill} opacity="0.55" />

      {/* Axis 4 = O (Oily): glossy white specular shine highlights + sparkle */}
      {isOily && (
        <g>
          <path
            d={
              isTall
                ? "M44 75 C41 81 42 88 46 92"
                : "M34 78 C31 84 33 91 38 95"
            }
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle
            cx={isTall ? 53 : 45}
            cy={isTall ? 55 : 64}
            r="3.8"
            fill="#FFFFFF"
          />
          <path
            d={
              isTall
                ? "M93 74 C96 79 96 84 93 88"
                : "M104 78 C107 83 107 88 103 92"
            }
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Gloss sparkle star */}
          <path
            d="M114 34 L116.5 40 L122.5 42.5 L116.5 45 L114 51 L111.5 45 L105.5 42.5 L111.5 40 Z"
            fill="#FFD93D"
            stroke="#1B1B1F"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Face group */}
      <g transform={`translate(0, ${faceOffsetY})`}>
        {/* Blush cheeks */}
        <ellipse
          cx="46"
          cy="89"
          rx={mood === "shy" ? 8.5 : 6.5}
          ry={mood === "shy" ? 5 : 4}
          fill="#FF7AC6"
          opacity={mood === "shy" ? 0.95 : 0.85}
        />
        <ellipse
          cx="94"
          cy="89"
          rx={mood === "shy" ? 8.5 : 6.5}
          ry={mood === "shy" ? 5 : 4}
          fill="#FF7AC6"
          opacity={mood === "shy" ? 0.95 : 0.85}
        />

        {/* Eyes (or cool sunglasses for Packed + Dry!) */}
        {showSunglasses ? (
          <g>
            {/* Cool cartoon sunglasses */}
            <rect
              x="42"
              y="69"
              width="24"
              height="16"
              rx="5"
              fill="#1B1B1F"
              stroke="#1B1B1F"
              strokeWidth="2.5"
            />
            <rect
              x="74"
              y="69"
              width="24"
              height="16"
              rx="5"
              fill="#1B1B1F"
              stroke="#1B1B1F"
              strokeWidth="2.5"
            />
            <path
              d="M66 75 H74"
              stroke="#1B1B1F"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Lens shine */}
            <path
              d="M47 73 L53 73 L48 80"
              stroke="#5CC8FF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M79 73 L85 73 L80 80"
              stroke="#5CC8FF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ) : mood === "celebrating" ? (
          <g stroke="#1B1B1F" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M47 78 Q55 68 63 78" />
            <path d="M77 78 Q85 68 93 78" />
          </g>
        ) : (
          <g className={animated && mood === "idle" ? "animate-mascot-blink" : ""}>
            {/* Left eye */}
            <circle
              cx="55"
              cy="76"
              r={mood === "excited" ? 9.5 : 8.5}
              fill="#FFFFFF"
              stroke="#1B1B1F"
              strokeWidth="3"
            />
            <circle
              cx={mood === "shy" ? 58 : mood === "thinking" ? 57 : 56}
              cy={mood === "thinking" ? 73 : 76}
              r="4.5"
              fill="#1B1B1F"
            />
            <circle
              cx={mood === "shy" ? 59.5 : 58}
              cy={mood === "thinking" ? 71.5 : 73.5}
              r="2"
              fill="#FFFFFF"
            />

            {/* Right eye */}
            <circle
              cx="85"
              cy="76"
              r={mood === "excited" ? 9.5 : 8.5}
              fill="#FFFFFF"
              stroke="#1B1B1F"
              strokeWidth="3"
            />
            <circle
              cx={mood === "shy" ? 88 : mood === "thinking" ? 87 : 86}
              cy={mood === "thinking" ? 73 : 76}
              r="4.5"
              fill="#1B1B1F"
            />
            <circle
              cx={mood === "shy" ? 89.5 : 88}
              cy={mood === "thinking" ? 71.5 : 73.5}
              r="2"
              fill="#FFFFFF"
            />

            {/* Thinking eyebrow */}
            {mood === "thinking" && (
              <>
                <path
                  d="M46 64 Q55 61 62 64"
                  stroke="#1B1B1F"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M78 62 Q86 65 94 61"
                  stroke="#1B1B1F"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </>
            )}
          </g>
        )}

        {/* Mouth by mood */}
        {mood === "excited" || mood === "celebrating" ? (
          <path
            d="M58 88 Q70 104 82 88 Z"
            fill="#1B1B1F"
            stroke="#1B1B1F"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ) : mood === "thinking" ? (
          <path
            d="M63 93 Q70 89 77 93"
            stroke="#1B1B1F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === "shy" ? (
          <g>
            <path
              d="M65 92 Q70 95 75 92"
              stroke="#1B1B1F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cute bashful paws */}
            <circle
              cx="56"
              cy="97"
              r="6"
              fill={bodyFill}
              stroke="#1B1B1F"
              strokeWidth="3"
            />
            <circle
              cx="84"
              cy="97"
              r="6"
              fill={bodyFill}
              stroke="#1B1B1F"
              strokeWidth="3"
            />
          </g>
        ) : (
          <path
            d="M60 89 Q70 99 80 89"
            stroke="#1B1B1F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Cute pink tongue inside open happy mouth */}
        {(mood === "excited" || mood === "celebrating") && (
          <ellipse cx="70" cy="95" rx="5.5" ry="3.2" fill="#FF7AC6" />
        )}
      </g>

      {/* Axis 4 = D (Dry) + F (Free-flowing): tiny desert cactus buddy */}
      {showCactus && (
        <g transform="translate(99, 78)">
          {/* Terracotta pot */}
          <path
            d="M8 22 H26 L23 34 H11 Z"
            fill="#FF9F43"
            stroke="#1B1B1F"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Cactus stem & arms */}
          <path
            d="M14 22 V7 C14 4 20 4 20 7 V22"
            fill="#6BE3B5"
            stroke="#1B1B1F"
            strokeWidth="2.6"
          />
          <path
            d="M14 15 H9 C7.5 15 7.5 10 9 10 H11"
            stroke="#6BE3B5"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M14 15 H9 C7.5 15 7.5 10 9 10"
            stroke="#1B1B1F"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 13 H25 C26.5 13 26.5 8 25 8"
            stroke="#1B1B1F"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tiny flower on cactus */}
          <circle
            cx="17"
            cy="4"
            r="3"
            fill="#FF7AC6"
            stroke="#1B1B1F"
            strokeWidth="1.8"
          />
        </g>
      )}

      {/* Mood = thinking: blue sweat drop + orbiting magnifier */}
      {mood === "thinking" && (
        <g>
          <path
            d="M106 34 C112 43 112 49 106 49 C100 49 100 43 106 34 Z"
            fill="#5CC8FF"
            stroke="#1B1B1F"
            strokeWidth="2.6"
          />
          <g className={animated ? "animate-magnifier" : ""}>
            <line
              x1="115"
              y1="82"
              x2="128"
              y2="96"
              stroke="#1B1B1F"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle
              cx="106"
              cy="73"
              r="12"
              fill="#5CC8FF"
              fillOpacity="0.45"
              stroke="#1B1B1F"
              strokeWidth="3.2"
            />
            <path
              d="M101 69 Q104 66 108 67"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        </g>
      )}

      {/* Mood = excited: motion burst lines */}
      {mood === "excited" && (
        <g stroke="#1B1B1F" strokeWidth="3.2" strokeLinecap="round">
          <line x1="12" y1="54" x2="22" y2="58" />
          <line x1="8" y1="70" x2="19" y2="70" />
          <line x1="128" y1="54" x2="118" y2="58" />
          <line x1="132" y1="70" x2="121" y2="70" />
        </g>
      )}

      {/* Mood = celebrating: sparkles around head */}
      {mood === "celebrating" && (
        <g>
          <path
            d="M24 14 L26.5 21 L33.5 23.5 L26.5 26 L24 33 L21.5 26 L14.5 23.5 L21.5 21 Z"
            fill="#FFD93D"
            stroke="#1B1B1F"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M116 12 L118 18 L124 20 L118 22 L116 28 L114 22 L108 20 L114 18 Z"
            fill="#FF7AC6"
            stroke="#1B1B1F"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle
            cx="102"
            cy="14"
            r="4"
            fill="#6BE3B5"
            stroke="#1B1B1F"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
}
