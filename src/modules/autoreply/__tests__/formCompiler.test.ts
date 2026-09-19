// ==============================================================================
// Wahide Frontend - Unit Test: Linear Form to DAG Flow Compiler
// Executed natively via Bun Test Runner (bun test)
// Relocated to dedicated module test directory: src/modules/autoreply/__tests__/
// ==============================================================================

import { describe, it, expect } from "bun:test";
import {
  compileLinearFormToFlow,
  decompileFlowToLinearForm,
} from "../utils/formCompiler";
import { LinearSubmissionFormInput } from "../types/submission.types";
import { FlowDefinition } from "../types/flow.types";

describe("formCompiler Unit Tests", () => {
  const sampleLinearForm: LinearSubmissionFormInput = {
    name: "Formulir Pendaftaran Reseller",
    description: "Kualifikasi calon agen baru",
    trigger_keywords: ["DAFTAR", "JOIN"],
    welcome_message: "Halo! Selamat datang di pendaftaran reseller.",
    questions: [
      {
        id: "q1",
        question: "Siapa nama lengkap Anda?",
        variableName: "nama_lengkap",
        type: "text",
      },
      {
        id: "q2",
        question: "Berapa nomor WhatsApp aktif Anda?",
        variableName: "nomor_telepon",
        type: "phone",
      },
      {
        id: "q3",
        question: "Apa alamat email Anda?",
        variableName: "email",
        type: "email",
      },
    ],
    completion_message: "Terima kasih! Tim kami akan menghubungi Anda.",
    is_active: true,
  };

  it("should compile a linear form into a valid DAG Flow graph", () => {
    const compiled = compileLinearFormToFlow(sampleLinearForm);

    expect(compiled.name).toBe("Formulir Pendaftaran Reseller");
    expect(compiled.trigger_type).toBe("KEYWORD");
    expect(compiled.trigger_keywords).toEqual(["DAFTAR", "JOIN"]);
    expect(compiled.is_active).toBe(true);

    const { nodes, edges } = compiled.canvas_graph;

    // Expected nodes: start + welcome + 3 questions + end = 6 nodes
    expect(nodes.length).toBe(6);
    expect(nodes[0].type).toBe("start");
    expect(nodes[1].type).toBe("message");
    expect(nodes[1].data.message).toBe("Halo! Selamat datang di pendaftaran reseller.");
    expect(nodes[2].type).toBe("question");
    expect(nodes[2].data.variableName).toBe("nama_lengkap");
    expect(nodes[3].type).toBe("question");
    expect(nodes[3].data.validationType).toBe("phone");
    expect(nodes[4].type).toBe("question");
    expect(nodes[4].data.validationType).toBe("email");
    expect(nodes[5].type).toBe("end");
    expect(nodes[5].data.message).toBe("Terima kasih! Tim kami akan menghubungi Anda.");

    // Expected edges: 5 sequential edges connecting 6 nodes
    expect(edges.length).toBe(5);
    expect(edges[0].source).toBe(nodes[0].id);
    expect(edges[0].target).toBe(nodes[1].id);
    expect(edges[1].source).toBe(nodes[1].id);
    expect(edges[1].target).toBe(nodes[2].id);
    expect(edges[2].source).toBe(nodes[2].id);
    expect(edges[2].target).toBe(nodes[3].id);
    expect(edges[3].source).toBe(nodes[3].id);
    expect(edges[3].target).toBe(nodes[4].id);
    expect(edges[4].source).toBe(nodes[4].id);
    expect(edges[4].target).toBe(nodes[5].id);
  });

  it("should compile a linear form without welcome message correctly", () => {
    const minimalForm: LinearSubmissionFormInput = {
      name: "Survey Cepat",
      trigger_keywords: ["SURVEY"],
      questions: [
        {
          id: "q1",
          question: "Berapa rating kepuasan Anda (1-5)?",
          variableName: "rating",
          type: "number",
        },
      ],
      completion_message: "Terima kasih atas rating Anda!",
    };

    const compiled = compileLinearFormToFlow(minimalForm);
    const { nodes, edges } = compiled.canvas_graph;

    // Expected nodes: start + 1 question + end = 3 nodes
    expect(nodes.length).toBe(3);
    expect(nodes[0].type).toBe("start");
    expect(nodes[1].type).toBe("question");
    expect(nodes[1].data.validationType).toBe("number");
    expect(nodes[2].type).toBe("end");

    // Expected edges: 2 sequential edges
    expect(edges.length).toBe(2);
  });

  it("should decompile a pure linear DAG flow back into linear form", () => {
    const compiled = compileLinearFormToFlow(sampleLinearForm);

    const mockFlow: FlowDefinition = {
      id: "flow_123",
      tenant_id: "tenant_abc",
      name: compiled.name,
      description: compiled.description,
      trigger_type: compiled.trigger_type,
      trigger_keywords: compiled.trigger_keywords,
      canvas_graph: compiled.canvas_graph,
      is_active: compiled.is_active ?? true,
      execution_count: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const decompiled = decompileFlowToLinearForm(mockFlow);

    expect(decompiled).not.toBeNull();
    expect(decompiled?.name).toBe("Formulir Pendaftaran Reseller");
    expect(decompiled?.trigger_keywords).toEqual(["DAFTAR", "JOIN"]);
    expect(decompiled?.welcome_message).toBe("Halo! Selamat datang di pendaftaran reseller.");
    expect(decompiled?.questions.length).toBe(3);
    expect(decompiled?.questions[0].variableName).toBe("nama_lengkap");
    expect(decompiled?.questions[1].type).toBe("phone");
    expect(decompiled?.questions[2].type).toBe("email");
    expect(decompiled?.completion_message).toBe("Terima kasih! Tim kami akan menghubungi Anda.");
  });

  it("should return null when decompiling a complex DAG flow with branching", () => {
    const complexFlow: FlowDefinition = {
      id: "flow_complex",
      tenant_id: "tenant_abc",
      name: "Complex Branching Flow",
      trigger_type: "KEYWORD",
      canvas_graph: {
        nodes: [
          { id: "n1", type: "start", position: { x: 0, y: 0 }, data: {} },
          { id: "n2", type: "condition", position: { x: 200, y: 0 }, data: {} },
          { id: "n3", type: "message", position: { x: 400, y: -100 }, data: {} },
          { id: "n4", type: "message", position: { x: 400, y: 100 }, data: {} },
        ],
        edges: [
          { id: "e1", source: "n1", target: "n2" },
          { id: "e2", source: "n2", target: "n3" },
          { id: "e3", source: "n2", target: "n4" }, // 2 outgoing edges = branching!
        ],
      },
      is_active: true,
      execution_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const decompiled = decompileFlowToLinearForm(complexFlow);
    expect(decompiled).toBeNull();
  });
});
