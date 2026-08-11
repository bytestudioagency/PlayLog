const INK = "#191313";
const RED = "#d92c2c";
const RED_HOT = "#e8483f";
const RED_DEEP = "#5c1f1f";
const FG = "#f4ecea";
const MUT = "#b9a8a5";

export const OG_SIZE = { width: 1200, height: 630 };

export function OgImageElement() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        background: INK,
        overflow: "hidden",
        padding: "80px 90px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -260,
          width: 720,
          height: 720,
          background: RED_DEEP,
          transform: "rotate(45deg)",
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: RED,
          color: FG,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          padding: "10px 20px",
          marginBottom: 28,
        }}
      >
        Your personal game tracker
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontWeight: 900,
          textTransform: "uppercase",
          lineHeight: 0.98,
          letterSpacing: -2,
        }}
      >
        <div style={{ display: "flex", fontSize: 104, color: FG }}>
          Track every
        </div>
        <div style={{ display: "flex", fontSize: 104 }}>
          <div style={{ display: "flex", color: RED_HOT }}>game</div>
          <div style={{ display: "flex", color: FG, marginLeft: 28 }}>
            you play
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 32,
          color: MUT,
          maxWidth: 820,
        }}
      >
        Hours, ratings, platforms, backlog: one library for everything
        you&apos;ve played.
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 64,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", width: 22, height: 22, background: RED }} />
        <div
          style={{
            display: "flex",
            marginLeft: 14,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: FG,
          }}
        >
          PlayLog
        </div>
      </div>
    </div>
  );
}
