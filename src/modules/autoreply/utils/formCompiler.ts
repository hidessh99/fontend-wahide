// ==============================================================================
// Wahide Frontend - Linear Form to DAG Flow Compiler & Decompiler
// Compiles simple question-by-question linear forms into Flow Canvas DAG graphs
// ==============================================================================

import {
  CreateFlowInput,
  FlowDefinition,
  FlowNode,
  FlowEdge,
  CanvasGraph,
} from "../types/flow.types";
import {
  LinearSubmissionFormInput,
  FormQuestionItem,
  FormQuestionType,
} from "../types/submission.types";

/**
 * Compiles a LinearSubmissionFormInput into a standard CreateFlowInput DAG graph
 * compatible with the backend Flow Engine and Ring-Buffer Batch Flusher.
 */
export function compileLinearFormToFlow(
  input: LinearSubmissionFormInput,
): CreateFlowInput {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  let stepIndex = 0;
  const startX = 80;
  const stepX = 260;
  const fixedY = 160;

  // 1. Start Trigger Node
  const startNodeId = "node_start";
  nodes.push({
    id: startNodeId,
    type: "start",
    position: { x: startX, y: fixedY },
    data: {
      label: "Mulai (Start)",
    },
  });

  let prevNodeId = startNodeId;

  // 2. Optional Welcome Message Node
  if (input.welcome_message && input.welcome_message.trim().length > 0) {
    stepIndex++;
    const welcomeNodeId = `node_welcome_${Date.now()}`;
    nodes.push({
      id: welcomeNodeId,
      type: "message",
      position: { x: startX + stepIndex * stepX, y: fixedY },
      data: {
        label: "Pesan Sambutan",
        message: input.welcome_message.trim(),
      },
    });

    edges.push({
      id: `edge_${prevNodeId}_${welcomeNodeId}`,
      source: prevNodeId,
      target: welcomeNodeId,
    });
    prevNodeId = welcomeNodeId;
  }

  // 3. Question Nodes in Sequential Chain
  input.questions.forEach((q, idx) => {
    stepIndex++;
    const questionNodeId = `node_q_${idx + 1}_${Date.now()}`;
    const validationType =
      q.type === "email"
        ? "email"
        : q.type === "number"
          ? "number"
          : q.type === "phone"
            ? "phone"
            : "any";

    nodes.push({
      id: questionNodeId,
      type: "question",
      position: { x: startX + stepIndex * stepX, y: fixedY },
      data: {
        label: q.variableName ? `Tanya: ${q.variableName}` : `Pertanyaan ${idx + 1}`,
        message: q.question,
        variableName: q.variableName || `jawaban_${idx + 1}`,
        validationType,
      },
    });

    edges.push({
      id: `edge_${prevNodeId}_${questionNodeId}`,
      source: prevNodeId,
      target: questionNodeId,
    });
    prevNodeId = questionNodeId;
  });

  // 4. End Node with Completion Message
  stepIndex++;
  const endNodeId = "node_end";
  nodes.push({
    id: endNodeId,
    type: "end",
    position: { x: startX + stepIndex * stepX, y: fixedY },
    data: {
      label: "Selesai (End)",
      message:
        input.completion_message.trim() ||
        "Terima kasih! Formulir Anda telah berhasil kami terima.",
    },
  });

  edges.push({
    id: `edge_${prevNodeId}_${endNodeId}`,
    source: prevNodeId,
    target: endNodeId,
  });

  const canvas_graph: CanvasGraph = {
    nodes,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 },
  };

  return {
    name: input.name,
    description:
      input.description ||
      `Formulir WhatsApp Otomatis: ${input.questions.length} Pertanyaan`,
    trigger_type: "KEYWORD",
    trigger_keywords: input.trigger_keywords,
    canvas_graph,
    is_active: input.is_active ?? true,
  };
}

/**
 * Attempts to decompile a FlowDefinition DAG into a LinearSubmissionFormInput.
 * Returns null if the flow has complex branching (conditions, multiple outgoing edges)
 * that cannot be safely edited in a simple linear form builder.
 */
export function decompileFlowToLinearForm(
  flow: FlowDefinition,
): LinearSubmissionFormInput | null {
  const { nodes = [], edges = [] } = flow.canvas_graph || {};
  if (nodes.length < 2) return null;

  const startNode = nodes.find((n) => n.type === "start");
  if (!startNode) return null;

  // Build outgoing adjacency list
  const outgoing: Record<string, string[]> = {};
  edges.forEach((e) => {
    if (!outgoing[e.source]) outgoing[e.source] = [];
    outgoing[e.source].push(e.target);
  });

  // Verify pure linear topology: each node must have at most 1 outgoing edge
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  let currId: string | undefined = startNode.id;
  const orderedNodes: FlowNode[] = [];
  const visited = new Set<string>();

  while (currId) {
    if (visited.has(currId)) return null; // cycle detected
    visited.add(currId);

    const node = nodeMap.get(currId);
    if (!node) return null;
    orderedNodes.push(node);

    const nextList: string[] = outgoing[currId] ?? [];
    if (nextList.length > 1) return null; // branching detected
    currId = nextList[0];
  }

  // Extract components
  let welcomeMessage = "";
  const questions: FormQuestionItem[] = [];
  let completionMessage = "";

  for (const node of orderedNodes) {
    if (node.type === "start") continue;

    if (node.type === "message") {
      if (questions.length === 0 && !welcomeMessage) {
        welcomeMessage = (node.data.message as string) || "";
      }
    } else if (node.type === "question") {
      const valType = (node.data.validationType as string) || "any";
      const qType: FormQuestionType =
        valType === "email"
          ? "email"
          : valType === "number"
            ? "number"
            : valType === "phone"
              ? "phone"
              : "text";

      questions.push({
        id: node.id,
        question: (node.data.message as string) || "",
        variableName: (node.data.variableName as string) || "",
        type: qType,
      });
    } else if (node.type === "end") {
      completionMessage = (node.data.message as string) || "";
    } else {
      // Contains unsupported node for linear form (e.g. condition, delay, api_call)
      return null;
    }
  }

  if (questions.length === 0) return null;

  return {
    id: flow.id,
    name: flow.name,
    description: flow.description,
    trigger_keywords: flow.trigger_keywords || [],
    welcome_message: welcomeMessage,
    questions,
    completion_message: completionMessage,
    is_active: flow.is_active,
  };
}
