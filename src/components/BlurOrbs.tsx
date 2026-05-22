export function BlurOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="orb"
        style={{
          width: 520,
          height: 520,
          background: "oklch(0.74 0.13 200 / 35%)",
          top: -120,
          left: -120,
        }}
      />
      <div
        className="orb"
        style={{
          width: 460,
          height: 460,
          background: "oklch(0.55 0.18 260 / 35%)",
          top: 120,
          right: -120,
          animationDelay: "-6s",
        }}
      />
      <div
        className="orb"
        style={{
          width: 380,
          height: 380,
          background: "oklch(0.7 0.18 320 / 25%)",
          bottom: -160,
          left: "30%",
          animationDelay: "-3s",
        }}
      />
    </div>
  );
}
