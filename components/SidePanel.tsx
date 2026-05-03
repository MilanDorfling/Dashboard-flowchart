"use client";
import { Node } from "@xyflow/react";
import { NodeData } from "./CustomNode";

const STATUS_COLORS: Record<string, string> = {
  planning: "#ffd60a", coding: "#00f5d4", testing: "#f72585",
  review: "#7b2fff", deploying: "#ff6b35", done: "#06ffa5",
};

type Props = {
  node: Node | null;
  onUpdate: (id: string, data: Partial<NodeData>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  theme: "dark" | "light";
};

export default function SidePanel({ node, onUpdate, onDelete, onClose, theme }: Props) {
  if (!node) return null;
  const d = node.data as NodeData;
  const color = STATUS_COLORS[d.status] ?? "#00f5d4";
  const isDark = theme === "dark";
  const surface = isDark ? "rgba(18,18,26,0.97)" : "rgba(250,250,255,0.97)";
  const borderColor = isDark ? "#2a2a3d" : "#e2e2ef";
  const textColor = isDark ? "#f0f0ff" : "#0a0a0f";
  const mutedColor = isDark ? "#6b6b8a" : "#9090aa";
  const inputBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";

  const inputStyle: React.CSSProperties = {
    width: "100%", background: inputBg,
    border: `1px solid ${color}30`, borderRadius: "8px",
    padding: "10px 12px", color: textColor,
    fontFamily: "'Space Mono', monospace", fontSize: "12px", outline: "none",
  };

  return (
    <div style={{
      position: "absolute", right: 0, top: "60px", bottom: 0, width: "280px",
      background: surface, backdropFilter: "blur(16px)",
      borderLeft: `1px solid ${color}40`, zIndex: 10,
      display: "flex", flexDirection: "column",
      fontFamily: "'Space Mono', monospace",
      transition: "background 0.3s",
    }}>
      {/* Header */}
      <div style={{ padding: "20px", borderBottom: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "10px", color: mutedColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Node Editor</div>
          <div style={{ width: "32px", height: "3px", background: color, borderRadius: "2px", boxShadow: `0 0 8px ${color}` }} />
        </div>
        <button onClick={onClose} style={{
          background: "transparent", border: `1px solid ${borderColor}`,
          color: mutedColor, borderRadius: "6px", width: "28px", height: "28px",
          cursor: "pointer", fontSize: "12px",
        }}>✕</button>
      </div>

      {/* Fields */}
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>

        <Field label="Label" muted={mutedColor}>
          <input key={node.id + "-label"} type="text" defaultValue={d.label}
            onChange={e => onUpdate(node.id, { label: e.target.value })}
            style={inputStyle} />
        </Field>

        <Field label="Status" muted={mutedColor}>
          <select key={node.id + "-status"} defaultValue={d.status}
            onChange={e => onUpdate(node.id, { status: e.target.value })}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {Object.keys(STATUS_COLORS).map(s => (
              <option key={s} value={s} style={{ background: isDark ? "#12121a" : "#fff" }}>{s}</option>
            ))}
          </select>
        </Field>

        {/* Code type — only shows when status is coding */}
        {d.status === "coding" && (
          <Field label="Code Type" muted={mutedColor}>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["function", "element"] as const).map(type => (
                <button key={type} onClick={() => onUpdate(node.id, { codeType: type })} style={{
                  flex: 1, padding: "9px", borderRadius: "8px", cursor: "pointer",
                  fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700,
                  border: `1px solid ${d.codeType === type ? color : borderColor}`,
                  background: d.codeType === type ? `${color}20` : "transparent",
                  color: d.codeType === type ? color : mutedColor,
                  transition: "all 0.15s",
                }}>
                  {type === "function" ? "fn()" : "<El />"}
                </button>
              ))}
            </div>
          </Field>
        )}

        <Field label="Description" muted={mutedColor}>
          <textarea key={node.id + "-desc"} defaultValue={d.description ?? ""}
            onChange={e => onUpdate(node.id, { description: e.target.value })}
            rows={4} style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }} />
        </Field>

        <div>
          <div style={{ fontSize: "9px", color: mutedColor, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Node ID</div>
          <div style={{ fontSize: "11px", color: mutedColor, opacity: 0.6 }}>{node.id}</div>
        </div>
      </div>

      {/* Delete */}
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${borderColor}` }}>
        <button onClick={() => onDelete(node.id)} style={{
          width: "100%", padding: "10px",
          background: "rgba(247,37,133,0.08)", border: "1px solid rgba(247,37,133,0.3)",
          color: "#f72585", borderRadius: "8px", cursor: "pointer",
          fontFamily: "'Space Mono', monospace", fontSize: "11px",
          fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
        }}>✕ Delete Node</button>
      </div>
    </div>
  );
}

function Field({ label, children, muted }: { label: string; children: React.ReactNode; muted: string }) {
  return (
    <div>
      <div style={{ fontSize: "9px", color: muted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
      {children}
    </div>
  );
}