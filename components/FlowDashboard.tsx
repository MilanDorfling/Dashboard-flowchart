"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import dagre from "dagre";
import { Position } from "@xyflow/react"; // Import Position enum
// Layout helper
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 220;
const nodeHeight = 80;
function getLayoutedElements(nodes: Node[], edges: Edge[], direction: "LR" | "TB") {
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);
  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 },
      sourcePosition: direction === "TB" ? Position.Bottom : Position.Right,
      targetPosition: direction === "TB" ? Position.Top : Position.Left,
    };
  });
}
import {
  ReactFlow, Background, Controls, MiniMap, BackgroundVariant,
  addEdge, useNodesState, useEdgesState,
  type Node, type Edge, type Connection, MarkerType,
} from "@xyflow/react";

import CustomNode, { NodeData } from "./CustomNode";
import Toolbar from "./Toolbar";
import SidePanel from "./SidePanel";

const nodeTypes = { custom: CustomNode };

const STATUS_COLORS: Record<string, string> = {
  planning: "#ffd60a", coding: "#00f5d4", testing: "#f72585",
  review: "#7b2fff", deploying: "#ff6b35", done: "#06ffa5",
};

const LOCAL_NODES_KEY = "flow-nodes";
const LOCAL_EDGES_KEY = "flow-edges";

const INITIAL_NODES: Node[] = [
  { id: "1", type: "custom", position: { x: 80, y: 180 }, data: { label: "Plan Feature", status: "planning", description: "Define scope, write tickets" } },
  { id: "2", type: "custom", position: { x: 340, y: 100 }, data: { label: "Build Auth API", status: "coding", description: "JWT + refresh tokens", codeType: "function" } },
  { id: "3", type: "custom", position: { x: 340, y: 280 }, data: { label: "Build UI", status: "coding", description: "React components", codeType: "element" } },
  { id: "4", type: "custom", position: { x: 600, y: 180 }, data: { label: "Write Tests", status: "testing", description: "Unit + integration tests" } },
  { id: "5", type: "custom", position: { x: 860, y: 180 }, data: { label: "Code Review", status: "review", description: "PR review + feedback" } },
  { id: "6", type: "custom", position: { x: 1120, y: 100 }, data: { label: "Deploy to Staging", status: "deploying", description: "Vercel preview deploy" } },
  { id: "7", type: "custom", position: { x: 1120, y: 260 }, data: { label: "Ship It!", status: "done", description: "Production deploy ✦" } },
];

const INITIAL_EDGES: Edge[] = [
  { id: "1-2", source: "1", target: "2", style: { stroke: "#ffd60a", strokeWidth: 2, opacity: 0.6 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ffd60a" } },
  { id: "1-3", source: "1", target: "3", style: { stroke: "#ffd60a", strokeWidth: 2, opacity: 0.6 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ffd60a" } },
  { id: "2-4", source: "2", target: "4", style: { stroke: "#00f5d4", strokeWidth: 2, opacity: 0.6 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#00f5d4" } },
  { id: "3-4", source: "3", target: "4", style: { stroke: "#00f5d4", strokeWidth: 2, opacity: 0.6 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#00f5d4" } },
  { id: "4-5", source: "4", target: "5", style: { stroke: "#f72585", strokeWidth: 2, opacity: 0.6 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f72585" } },
  { id: "5-6", source: "5", target: "6", style: { stroke: "#7b2fff", strokeWidth: 2, opacity: 0.6 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#7b2fff" } },
  { id: "5-7", source: "5", target: "7", style: { stroke: "#7b2fff", strokeWidth: 2, opacity: 0.6 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#7b2fff" } },
];

export default function FlowDashboard() {

  // Load from localStorage if available
  const getInitialNodes = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_NODES_KEY);
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_NODES;
  };
  const getInitialEdges = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_EDGES_KEY);
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_EDGES;
  };
  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges());
    // Persist nodes and edges to localStorage on change
    useEffect(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_NODES_KEY, JSON.stringify(nodes));
      }
    }, [nodes]);
    useEffect(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_EDGES_KEY, JSON.stringify(edges));
      }
    }, [edges]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [layoutDirection, setLayoutDirection] = useState<"LR" | "TB">("LR");
  const idRef = useRef(20);
  const isDark = theme === "dark";
  // Layout toggle handler
  const handleToggleLayout = useCallback(() => {
    setNodes(nds => getLayoutedElements(nds, edges, layoutDirection === "LR" ? "TB" : "LR"));
    setLayoutDirection(dir => (dir === "LR" ? "TB" : "LR"));
  }, [edges, layoutDirection, setNodes]);

  const onConnect = useCallback((params: Connection) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    const status = (sourceNode?.data as NodeData)?.status ?? "coding";
    const color = STATUS_COLORS[status] ?? "#00f5d4";
    setEdges(eds => addEdge({
      ...params,
      style: { stroke: color, strokeWidth: 2, opacity: 0.6 },
      markerEnd: { type: MarkerType.ArrowClosed, color },
    }, eds));
  }, [nodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => setSelectedNode(node), []);
  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const handleAddNode = useCallback((status: string) => {
    const id = String(++idRef.current);
    const labels: Record<string, string> = {
      function: "Function", element: "Element", testing: "New Tests",
      review: "New Review", deploying: "New Deploy", done: "Completed",
      and: "AND Gate", or: "OR Gate", not: "NOT Gate", xor: "XOR Gate"
    };
    setNodes(nds => [...nds, {
      id, type: "custom",
      position: { x: 200 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: { label: labels[status] ?? "New Node", status, description: "" },
    }]);
  }, [setNodes]);

  const handleUpdateNode = useCallback((id: string, data: Partial<NodeData>) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n));
    setSelectedNode(prev => prev?.id === id ? { ...prev, data: { ...prev.data, ...data } } : prev);
  }, [setNodes]);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const bgColor = isDark ? "#0a0a0f" : "#f4f4ff";

  // Export handlers
  const flowWrapperRef = useRef<HTMLDivElement>(null);

  const handleExportImage = async () => {
    const node = flowWrapperRef.current;
    if (!node) return;
    try {
      const dataUrl = await htmlToImage.toPng(node, { cacheBust: true });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "devflow-diagram.png";
      link.click();
    } catch (err) {
      alert("Export failed: " + err);
    }
  };

  const handleExportPDF = async () => {
    const node = flowWrapperRef.current;
    if (!node) return;
    try {
      const dataUrl = await htmlToImage.toPng(node, { cacheBust: true });
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("devflow-diagram.pdf");
    } catch (err) {
      alert("Export failed: " + err);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: bgColor, transition: "background 0.3s" }}>
      <Toolbar
        onAddNode={handleAddNode}
        nodeCount={nodes.length}
        edgeCount={edges.length}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")}
        onExportImage={handleExportImage}
        onExportPDF={handleExportPDF}
        layoutDirection={layoutDirection}
        onToggleLayout={handleToggleLayout}
      />

      <div ref={flowWrapperRef} style={{ position: "absolute", inset: 0, top: "60px" }}>
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect} onNodeClick={onNodeClick} onPaneClick={onPaneClick}
          nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }}
          style={{ background: bgColor }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color={isDark ? "#2a2a3d" : "#c8c8df"} />
          <Controls style={{ bottom: 24, left: 24 }} />
          <MiniMap
            nodeColor={n => STATUS_COLORS[(n.data as NodeData)?.status] ?? "#6b6b8a"}
            style={{ bottom: 24, right: selectedNode ? 300 : 24 }}
          />
        </ReactFlow>
      </div>

      <SidePanel
        node={selectedNode}
        onUpdate={handleUpdateNode}
        onDelete={handleDeleteNode}
        onClose={() => setSelectedNode(null)}
        theme={theme}
      />

      {!selectedNode && (
        <div style={{
          position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: isDark ? "rgba(18,18,26,0.85)" : "rgba(255,255,255,0.85)",
          border: `1px solid ${isDark ? "#2a2a3d" : "#e2e2ef"}`,
          borderRadius: "20px", padding: "8px 18px",
          fontSize: "11px", color: isDark ? "#6b6b8a" : "#9090aa",
          fontFamily: "'Space Mono', monospace",
          backdropFilter: "blur(8px)", pointerEvents: "none",
          transition: "all 0.3s",
        }}>
          Click a node to edit · Drag to connect · Add nodes from toolbar
        </div>
      )}
    </div>
  );
};
