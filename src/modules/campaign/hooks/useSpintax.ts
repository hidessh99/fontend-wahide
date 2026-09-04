"use client";

import { useState, useCallback } from "react";

export function parseSpintaxString(
  template: unknown,
  variables: Record<string, string> = {
    nama: "Budi Santoso",
    name: "Budi Santoso",
    phone: "6281234567890",
    nomor: "6281234567890",
  }
): string {
  if (typeof template !== "string" || !template.trim()) return "";

  let result = template;

  // Replace variable tags like {nama}, {name}, {phone}, {nomor}
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`\\{${key}\\}`, "gi");
    result = result.replace(regex, variables[key]);
  });

  // Regex to match nested or simple spintax {option1|option2|option3}
  let iterations = 0;
  const maxIterations = 20; // safety ceiling against malformed infinite patterns
  while (/\{([^{}]+)\}/.test(result) && iterations < maxIterations) {
    result = result.replace(/\{([^{}]+)\}/g, (_, match) => {
      const choices = match.split("|");
      const randomIndex = Math.floor(Math.random() * choices.length);
      return choices[randomIndex] || "";
    });
    iterations++;
  }

  return result;
}

export function useSpintax(initialTemplate: string = "") {
  const [template, setTemplate] = useState(initialTemplate);
  const [preview, setPreview] = useState(() => parseSpintaxString(initialTemplate));

  const randomize = useCallback(
    (customTemplate?: unknown) => {
      // Defensively guard against React MouseEvent objects passed from onClick handlers
      const target = typeof customTemplate === "string" ? customTemplate : template;
      setPreview(parseSpintaxString(target));
    },
    [template]
  );

  const updateTemplate = useCallback((newTemplate: string) => {
    setTemplate(newTemplate);
    setPreview(parseSpintaxString(newTemplate));
  }, []);

  return {
    template,
    preview,
    setTemplate: updateTemplate,
    randomize,
    parseSpintax: parseSpintaxString,
  };
}
