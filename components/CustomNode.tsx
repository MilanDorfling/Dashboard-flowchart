"use client";
import { Handle, Position, NodeProps } from "@xyflow/react";

export type NodeData = {
  label: string;
  status: string;
  description?: string;
  codeType?: "function" | "element";
};

const STATUS_CONFIG: Record<string, { accent: string; glow: string; bg: string; icon: string }> = {
  planning:  { accent: "#ffd60a", glow: "rgba(255,214,10,0.25)",  bg: "rgba(255,214,10,0.07)",  icon: "◈"   },
  coding:    { accent: "#00f5d4", glow: "rgba(0,245,212,0.25)",   bg: "rgba(0,245,212,0.07)",   icon: "⟨/⟩" },
  testing:   { accent: "#f72585", glow: "rgba(247,37,133,0.25)",  bg: "rgba(247,37,133,0.07)",  icon: "⚡"  },
  review:    { accent: "#7b2fff", glow: "rgba(123,47,255,0.25)",  bg: "rgba(123,47,255,0.07)",  icon: "◎"   },
  deploying: { accent: "#ff6b35", glow: "rgba(255,107,53,0.25)",  bg: "rgba(255,107,53,0.07)",  icon: "▲"   },
  done:      { accent: "#4caf50", glow: "rgba(76,175,80,0.25)",   bg: "rgba(76,175,80,0.07)",   icon: "✦"   },
  // Logic gates
  and: { accent: "#ffb300", glow: "rgba(255,179,0,0.25)", bg: "rgba(255,179,0,0.07)", icon: "∧" },
  or: { accent: "#1976d2", glow: "rgba(25,118,210,0.25)", bg: "rgba(25,118,210,0.07)", icon: "≥1" },
  not: { accent: "#d32f2f", glow: "rgba(211,47,47,0.25)", bg: "rgba(211,47,47,0.07)", icon: "¬" },
  xor: { accent: "#7b1fa2", glow: "rgba(123,31,162,0.25)", bg: "rgba(123,31,162,0.07)", icon: "⊕" },
};


function LogicGateSVG({ type }: { type: string }) {
  switch (type) {
    case "and":
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" stroke="#222" strokeWidth="2">
          <path d="M8 8 v16 h16 a8 8 0 0 0 0-16 z" fill="#fff" />
          <line x1="0" y1="8" x2="8" y2="8" />
          <line x1="0" y1="24" x2="8" y2="24" />
          <line x1="32" y1="16" x2="48" y2="16" />
        </svg>
      );
    case "or":
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" stroke="#222" strokeWidth="2">
          <path d="M8 8 Q20 16 8 24 Q20 16 40 16 Q32 8 8 8" fill="#fff" />
          <line x1="0" y1="8" x2="8" y2="8" />
          <line x1="0" y1="24" x2="8" y2="24" />
          <line x1="40" y1="16" x2="48" y2="16" />
        </svg>
      );
    case "not":
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" stroke="#222" strokeWidth="2">
          <polygon points="8,8 8,24 32,16" fill="#fff" />
          <circle cx="36" cy="16" r="3" fill="#fff" stroke="#222" />
          <line x1="0" y1="16" x2="8" y2="16" />
          <line x1="39" y1="16" x2="48" y2="16" />
        </svg>
      );
    case "xor":
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" stroke="#222" strokeWidth="2">
          <path d="M10 8 Q22 16 10 24 Q22 16 40 16 Q32 8 10 8" fill="#fff" />
          <path d="M4 8 Q16 16 4 24" fill="none" />
          <line x1="0" y1="8" x2="10" y2="8" />
          <line x1="0" y1="24" x2="10" y2="24" />
          <line x1="40" y1="16" x2="48" y2="16" />
        </svg>
      );
    default:
      return null;
  }
}

export default function CustomNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const cfg = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.coding;

  const isLogicGate = ["and", "or", "not", "xor"].includes(d.status);

  return (
    <div style={{
      background: cfg.bg,
      border: `1.5px solid ${selected ? cfg.accent : "rgba(255,255,255,0.08)"}`,
      boxShadow: selected ? `0 0 0 2px ${cfg.accent}, 0 0 24px ${cfg.glow}` : `0 0 16px ${cfg.glow}`,
      borderRadius: "12px",
      minWidth: "200px",
      fontFamily: "'Space Mono', monospace",
      transition: "all 0.2s",
      cursor: "pointer",
    }}>
      <Handle type="target" position={Position.Left} style={{ background: cfg.accent, borderColor: "#0a0a0f" }} />

      {/* Header */}
      <div style={{ background: cfg.accent, borderRadius: "10px 10px 0 0", padding: "6px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
        {isLogicGate ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 32 }}>
            <LogicGateSVG type={d.status} />
          </span>
        ) : (
          <span style={{ fontSize: "13px", color: "#0a0a0f", fontWeight: 700 }}>{cfg.icon}</span>
        )}
        <span style={{ fontSize: "10px", fontWeight: 700, color: "#0a0a0f", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {d.status}
        </span>
        {d.status === "coding" && d.codeType && (
          <span style={{
            marginLeft: "auto",
            fontSize: "9px",
            fontWeight: 700,
            background: "rgba(0,0,0,0.2)",
            color: "#0a0a0f",
            padding: "2px 7px",
            borderRadius: "20px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            {d.codeType === "function" ? "fn()" : "<El />"}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#f0f0ff", marginBottom: d.description ? "6px" : 0 }}>
          {d.label}
        </div>
        {d.description && (
          <div style={{ fontSize: "10px", color: "#6b6b8a", lineHeight: 1.5 }}>
            {d.description}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} style={{ background: cfg.accent, borderColor: "#0a0a0f" }} />
    </div>
  );
}