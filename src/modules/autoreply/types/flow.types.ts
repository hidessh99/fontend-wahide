// ==============================================================================
// Wahide Frontend - Conversational Flow DAG Types
// Matching React Flow / DAG structure and Go backend CanvasGraphDTO
// ==============================================================================

export type FlowNodeType =
  | "start"
  | "message"
  | "question"
  | "condition"
  | "delay"
  | "api_call"
  | "end";

export type FlowTriggerType = "KEYWORD" | "NEW_CHAT" | "ALL_MESSAGES" | "MANUAL";

export interface FlowNodePosition {
  x: number;
  y: number;
}

export interface FlowNodeData {
  label?: string;
  message?: string;
  variableName?: string;
  validationType?: "any" | "email" | "number" | "phone";
  conditionVariable?: string;
  conditionOperator?: "==" | "!=" | ">" | "<" | "contains";
  conditionValue?: string;
  delaySeconds?: number;
  apiUrl?: string;
  apiMethod?: "GET" | "POST";
  [key: string]: unknown;
}

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  position: FlowNodePosition;
  data: FlowNodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
}

export interface CanvasGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport?: { x: number; y: number; zoom: number };
}

export interface FlowDefinition {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  trigger_type: FlowTriggerType;
  trigger_keywords?: string[];
  canvas_graph: CanvasGraph;
  is_active: boolean;
  execution_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFlowInput {
  name: string;
  description?: string;
  trigger_type: FlowTriggerType;
  trigger_keywords?: string[];
  canvas_graph: CanvasGraph;
  is_active?: boolean;
}

export interface UpdateFlowInput {
  name?: string;
  description?: string;
  trigger_type?: FlowTriggerType;
  trigger_keywords?: string[];
  canvas_graph?: CanvasGraph;
  is_active?: boolean;
}

export interface TestFlowSimulationInput {
  flow_id: string;
  input_text: string;
  current_node?: string;
  variables?: Record<string, unknown>;
}

export interface TestFlowSimulationResult {
  next_node_id: string;
  reply_text: string;
  variables: Record<string, unknown>;
  is_complete: boolean;
}
