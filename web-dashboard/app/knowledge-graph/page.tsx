'use client';

import { useEffect, useRef, useState } from 'react';

interface GraphNode {
  id: string;
  label: string;
  group: string;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  detail?: string[];
}

interface GraphEdge {
  source: string;
  target: string;
}

const COLORS: Record<string, string> = {
  core: '#06b6d4',
  role: '#10b981',
  system: '#f59e0b',
  skill: '#8b5cf6',
  project: '#ec4899',
  cert: '#64748b',
  research: '#ef4444',
  search: '#3b82f6',
};

function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Center node
  nodes.push({ id: 'ganesh', label: 'Ganesh Mamidipalli', group: 'core', size: 36, x: 0, y: 0, vx: 0, vy: 0, detail: ['AI Engineer | 7+ years', 'Wichita, KS', 'GCP-primary, AWS cross-platform', 'Aviation | Finance | Healthcare | AgTech'] });

  // Roles
  const roles = [
    { id: 'niar', label: 'NIAR', detail: ['AI Engineer | Jan 2025 -- Present', 'Multi-agent aviation compliance', 'Google ADK + A2A + MCP', 'Fine-tuned Gemini (QLoRA, GRPO)', '58% latency reduction', '99.7% compliance accuracy'] },
    { id: 'knowmadics', label: 'Knowmadics', detail: ['AI Engineer | Jul 2024 -- Jan 2025', 'Financial RAG over 2M+ docs', 'Multi-model routing (Claude/GPT-4/Llama)', '25% accuracy, 40% precision, 58% latency'] },
    { id: 'waycool', label: 'WayCool', detail: ['Sr. Data Scientist | Jan 2021 -- Jan 2024', '40 hospital clients, FHIR/HL7/HIPAA', 'Kubeflow V1 to V2 migration', 'Custom ML library (scikit-learn APIs)'] },
    { id: 'sagacious', label: 'Sagacious', detail: ['Data Scientist | Jun 2019 -- Dec 2020', '22% accuracy improvement (churn)', 'Spark, Kafka, Airflow pipelines'] },
  ];
  roles.forEach((r) => {
    nodes.push({ ...r, group: 'role', size: 24, x: 0, y: 0, vx: 0, vy: 0 });
    edges.push({ source: 'ganesh', target: r.id });
  });

  // Systems (connected to roles)
  const systems = [
    { id: 'niar-pipeline', label: '5-Agent Pipeline', parent: 'niar', detail: ['Classification → NER → Risk → Report → Critic', 'LangGraph conditional loop-back', 'Hallucinations: 14% → 1.3%', 'Throughput: 3,000 docs/day'] },
    { id: 'niar-mcp', label: 'MCP Governed Access', parent: 'niar', detail: ['No agent holds DB credentials', 'Aurora audit trail', 'Pool exhaustion fix: 10→50 connections', 'p99: 120ms → 180ms stable'] },
    { id: 'niar-am', label: 'AM Research', parent: 'niar', detail: ['AIM-4AM (America Makes)', 'WGAN + PINNs + Bayesian', '100+ → ~30 test coupons', 'Inconel 625/718, Ti64, M789'] },
    { id: 'know-rag', label: 'Financial RAG', parent: 'knowmadics', detail: ['2M+ docs, <4min index lag', '3-layer chunking (Textract→semantic→parent-child)', '4-stage retrieval (decompose→hybrid→rerank→expand)', 'P50: 3.8s → 180ms'] },
    { id: 'know-routing', label: 'Multi-Model Routing', parent: 'knowmadics', detail: ['Claude 3 (20%, complex reasoning)', 'GPT-4 (20%, table extraction)', 'Llama 3 (60%, zero token cost)', '~60% cost reduction'] },
  ];
  systems.forEach((s) => {
    nodes.push({ id: s.id, label: s.label, group: 'system', size: 18, x: 0, y: 0, vx: 0, vy: 0, detail: s.detail });
    edges.push({ source: s.parent, target: s.id });
  });

  // Skills clusters
  const skillGroups = [
    { id: 'sk-genai', label: 'GenAI / LLMs', detail: ['QLoRA, GRPO, RLHF, SFT', 'MCP, A2A, ADK, LangGraph', 'RAG, NER, guardrails', 'Gemini, GPT-4o, Llama 3, Claude'] },
    { id: 'sk-mlops', label: 'MLOps / LLMOps', detail: ['Kubeflow, MLflow, Langfuse', 'Terraform, Docker, K8s', 'Drift detection, canary deploys', 'SRE principles'] },
    { id: 'sk-cloud', label: 'Cloud', detail: ['GCP: Vertex AI, BigQuery, Cloud Run', 'AWS: SageMaker, Bedrock, EKS', 'Azure: ML Studio, Databricks'] },
    { id: 'sk-ml', label: 'ML / DL', detail: ['PyTorch, TensorFlow, JAX', 'XGBoost, LightGBM, SHAP', 'CNNs, Transformers, GANs, PINNs', 'RL, causal inference, A/B testing'] },
    { id: 'sk-domain', label: 'Domain', detail: ['Aviation: FAA ADs, CFR, MRO, CMH-17', 'Additive manufacturing: LPBF, DED', 'Healthcare: FHIR, HL7, HIPAA', 'Federal procurement'] },
  ];
  skillGroups.forEach((s) => {
    nodes.push({ ...s, group: 'skill', size: 20, x: 0, y: 0, vx: 0, vy: 0 });
    edges.push({ source: 'ganesh', target: s.id });
  });

  // Projects
  const projects = [
    { id: 'openclaw', label: 'OpenClaw AI', detail: ['Multi-agent reasoning platform', 'Planner→Executor→Critic→Arbiter via MCP', 'Dynamic inter-agent trust scoring', '94% task completion accuracy'] },
    { id: 'portfolio', label: 'Portfolio + Voice AI', detail: ['ganeshmamidipalli.com', 'RAG chatbot + voice clone "Gani"', 'Next.js, Cartesia, Faster Whisper'] },
    { id: 'wsdm', label: 'WSDM Cup 2024', detail: ['Top 10% globally', 'LLM evaluation track', 'LightGBM + Universal Sentence Encoder'] },
    { id: 'rl-env', label: 'RL Environment', detail: ['Stealth startup take-home', 'RAG failure mode as RL environment', 'Rewards: applicability precision'] },
  ];
  projects.forEach((p) => {
    nodes.push({ ...p, group: 'project', size: 16, x: 0, y: 0, vx: 0, vy: 0 });
    edges.push({ source: 'ganesh', target: p.id });
  });

  // Research
  nodes.push({ id: 'research', label: 'LLM Determinism', group: 'research', size: 20, x: 0, y: 0, vx: 0, vy: 0, detail: ['Active research (ongoing)', 'Temperature/sampling control', 'Seed-based reproducibility', 'GBNF/Lark grammar-constrained decoding', 'Benchmark: 100+ runs on Gemini/GPT-4o/Llama 3'] });
  edges.push({ source: 'ganesh', target: 'research' });

  // Certs
  nodes.push({ id: 'certs', label: 'Certifications', group: 'cert', size: 18, x: 0, y: 0, vx: 0, vy: 0, detail: ['Anthropic Academy: 13 courses', 'Claude Certified Architect (CCA)', 'Dell/NVIDIA Certified Data Scientist', 'WSDM Cup 2024: Top 10%', '$10K Garvey Scholarship'] });
  edges.push({ source: 'ganesh', target: 'certs' });

  // Job search
  nodes.push({ id: 'jobsearch', label: 'Job Search', group: 'search', size: 18, x: 0, y: 0, vx: 0, vy: 0, detail: ['Target: Sr AI/ML, Platform, MLOps', 'Pipeline: stealth startup, Evidently, UST', 'NIAR conversion (visa blocked)', 'Requires: H1B or OPT extension'] });
  edges.push({ source: 'ganesh', target: 'jobsearch' });

  return { nodes, edges };
}

function forceSimulation(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;

  // Initialize positions in a circle around center
  const nonCenter = nodes.filter((n) => n.id !== 'ganesh');
  nonCenter.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nonCenter.length;
    const radius = Math.min(width, height) * 0.32;
    node.x = cx + radius * Math.cos(angle);
    node.y = cy + radius * Math.sin(angle);
  });
  const center = nodes.find((n) => n.id === 'ganesh');
  if (center) { center.x = cx; center.y = cy; }

  // Run force simulation
  for (let iter = 0; iter < 200; iter++) {
    const alpha = 1 - iter / 200;
    const strength = alpha * 0.3;

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = (nodes[i].size + nodes[j].size) * 2.5;
        if (dist < minDist) {
          const force = ((minDist - dist) / dist) * strength * 2;
          nodes[i].x -= dx * force;
          nodes[i].y -= dy * force;
          nodes[j].x += dx * force;
          nodes[j].y += dy * force;
        }
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (!source || !target) continue;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const idealDist = 140;
      const force = ((dist - idealDist) / dist) * strength * 0.1;
      source.x += dx * force;
      source.y += dy * force;
      target.x -= dx * force;
      target.y -= dy * force;
    }

    // Center gravity
    for (const node of nodes) {
      if (node.id === 'ganesh') {
        node.x = cx;
        node.y = cy;
        continue;
      }
      node.x += (cx - node.x) * strength * 0.01;
      node.y += (cy - node.y) * strength * 0.01;
    }

    // Keep in bounds
    const pad = 60;
    for (const node of nodes) {
      node.x = Math.max(pad, Math.min(width - pad, node.x));
      node.y = Math.max(pad, Math.min(height - pad, node.y));
    }
  }
}

export default function KnowledgeGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const graphRef = useRef<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const graph = buildGraph();
    forceSimulation(graph.nodes, graph.edges, width, height);
    graphRef.current = graph;

    function draw(time: number) {
      if (!ctx) return;
      timeRef.current = time;
      ctx.clearRect(0, 0, width, height);

      // Draw edges
      for (const edge of graph.edges) {
        const source = graph.nodes.find((n) => n.id === edge.source);
        const target = graph.nodes.find((n) => n.id === edge.target);
        if (!source || !target) continue;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Animated pulse along edge
        const pulseT = ((time / 3000) + graph.edges.indexOf(edge) * 0.1) % 1;
        const px = source.x + (target.x - source.x) * pulseT;
        const py = source.y + (target.y - source.y) * pulseT;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[target.group] || '#64748b';
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw nodes
      for (const node of graph.nodes) {
        const color = COLORS[node.group] || '#64748b';
        const isHovered = hoveredNode?.id === node.id;
        const breathe = 1 + Math.sin(time / 1000 + graph.nodes.indexOf(node)) * 0.04;
        const r = node.size * breathe * (isHovered ? 1.3 : 1) / 2;

        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2.5);
        gradient.addColorStop(0, color + '30');
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color + (isHovered ? 'ff' : 'cc');
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = isHovered ? 3 : 1.5;
        ctx.stroke();

        // Label
        ctx.font = `${isHovered ? 'bold ' : ''}${node.id === 'ganesh' ? 14 : 11}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(node.label, node.x, node.y + r + 16);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [hoveredNode]);

  const findNode = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !graphRef.current) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    for (const node of graphRef.current.nodes) {
      const dx = mx - node.x;
      const dy = my - node.y;
      // Larger hit area on mobile
      const hitSize = node.size * 1.2;
      if (dx * dx + dy * dy < hitSize * hitSize) return node;
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const found = findNode(e.clientX, e.clientY);
    setHoveredNode(found);
    setTooltipPos({ x: e.clientX, y: e.clientY });
    if (canvasRef.current) canvasRef.current.style.cursor = found ? 'pointer' : 'default';
  };

  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) { setHoveredNode(null); return; }
    const found = findNode(touch.clientX, touch.clientY);
    setHoveredNode(found);
    setTooltipPos({ x: touch.clientX, y: touch.clientY - 80 });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Knowledge Graph</h1>
        <p className="text-gray-400 mt-1 text-sm">Interactive map of skills, systems, and experience</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-400 capitalize">{key}</span>
          </div>
        ))}
      </div>

      <div className="relative bg-surface rounded-xl border border-surface-light/30 overflow-hidden" style={{ height: 'calc(60vh)' }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          onTouchEnd={() => setHoveredNode(null)}
          className="w-full h-full touch-none"
        />

        {/* Tooltip */}
        {hoveredNode && hoveredNode.detail && (
          <div
            className="fixed z-50 pointer-events-none bg-surface border border-surface-light/50 rounded-lg p-3 shadow-xl max-w-xs"
            style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 8 }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: COLORS[hoveredNode.group] }}>
              {hoveredNode.label}
            </div>
            {hoveredNode.detail.map((line, i) => (
              <div key={i} className="text-xs text-gray-300 leading-relaxed">{line}</div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Hover over nodes to see details. Data sourced from ganesh-wiki.md
      </p>
    </div>
  );
}
