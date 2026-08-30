"use client";

import { useState, useCallback } from "react";

export function parseSpintaxString(
  template: string,
  variables: Record<string, string> = { name: "Budi Santoso", phone: "6281234567890" }
): string {
  if (!template) return "";

  let result = template;

  // Replace variable tags like {name}, {phone}
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`\\{${key}\\}`, "gi");
    result = result.replace(regex, variables[key]);
  });

  // Regex to match nested or simple spintax {option1|option2|option3}
  const spintaxRegex = /\{([^{}]+)\}/g;

  while (spintaxRegex.test(result)) {
    result = result.replace(spintaxRegex, (_, match) => {
      const choices = match.split("|");
      const randomIndex = Math.floor(Math.random() * choices.length);
      return choices[randomIndex] || "";
    });
  }

  return result;
}

export function useSpintax(initialTemplate: string = "") {
  const [template, setTemplate] = useState(initialTemplate);
  const [preview, setPreview] = useState(() => parseSpintaxString(initialTemplate));

  const randomize = useCallback(
    (customTemplate?: string) => {
      const target = customTemplate !== undefined ? customTemplate : template;
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
