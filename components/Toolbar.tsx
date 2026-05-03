"use client";

const NODE_TYPES = [
  { status: "planning",  label: "Plan",   icon: "◈",    color: "#ffd60a" },
  { status: "coding",    label: "Code",   icon: "⟨/⟩",  color: "#00f5d4" },
  { status: "testing",   label: "Test",   icon: "⚡",   color: "#f72585" },
  { status: "review",    label: "Review", icon: "◎",    color: "#7b2fff" },
  { status: "deploying", label: "Deploy", icon: "▲",    color: "#ff6b35" },
  { status: "done",      label: "Done",   icon: "✦",    color: "#06ffa5" },
];

type Props = {
  onAddNode: (status: string) => void;
  nodeCount: number;
  edgeCount: number;
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export default function Toolbar({ onAddNode, nodeCount, edgeCount, theme, onToggleTheme }: Props) {
  const isDark = theme === "dark";
  const surface = isDark ? "rgba(10,10,15,0.92)" : "rgba(255,255,255,0.92)";
  const borderColor = isDark ? "#2a2a3d" : "#e2e2ef";
  const textColor = isDark ? "#f0f0ff" : "#0a0a0f";
  const mutedColor = isDark ? "#6b6b8a" : "#9090aa";

  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
      display: "flex", alignItems: "center", gap: "0",
      background: surface, backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${borderColor}`,
      padding: "0 24px", height: "60px",
      transition: "background 0.3s, border-color 0.3s",
    }}>
      {/* Logo */}
      <div style={{ marginRight: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "linear-gradient(135deg, #00f5d4, #7b2fff)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
        }}>⟨/⟩</div>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "16px",
          background: "linear-gradient(90deg, #00f5d4, #7b2fff)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>DevFlow</span>
      </div>

      <div style={{ width: "1px", height: "28px", background: borderColor, marginRight: "24px" }} />

      <span style={{ fontSize: "10px", color: mutedColor, marginRight: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Add Node
      </span>

      <div style={{ display: "flex", gap: "8px", marginRight: "auto" }}>
        {NODE_TYPES.map(({ status, label, icon, color }) => (
          <button key={status} onClick={() => onAddNode(status)} style={{
            background: `${color}15`, border: `1px solid ${color}40`,
            color, borderRadius: "6px", padding: "5px 12px",
            fontSize: "11px", fontFamily: "'Space Mono', monospace",
            fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "5px",
            transition: "all 0.15s", letterSpacing: "0.05em",
          }}>
            <span>{icon}</span><span>{label}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center", marginRight: "20px" }}>
        {[{ label: "Nodes", value: nodeCount, color: "#00f5d4" }, { label: "Edges", value: edgeCount, color: "#7b2fff" }].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: "9px", color: mutedColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Theme toggle */}
      <button onClick={onToggleTheme} style={{
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        border: `1px solid ${borderColor}`,
        color: textColor, borderRadius: "8px",
        width: "36px", height: "36px", cursor: "pointer",
        fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {isDark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}