const headings = ["decision", "context", "options", "option", "constraints", "risks", "risk", "assumptions", "owner", "deadline", "date"];

function clean(value = "") {
  return value.trim().replace(/^[-*•]\s*/, "").replace(/\s+/g, " ");
}

function sectionize(notes) {
  const sections = { general: [] };
  let current = "general";
  notes.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;
    const match = line.match(/^([A-Za-z ]+):\s*(.*)$/);
    if (match) {
      const candidate = match[1].trim().toLowerCase();
      const heading = headings.find((item) => candidate === item || candidate === `${item}s`);
      if (heading) {
        current = heading;
        sections[current] ??= [];
        if (match[2]) sections[current].push(clean(match[2]));
        return;
      }
    }
    sections[current] ??= [];
    sections[current].push(clean(line));
  });
  return sections;
}

function firstSentence(value) {
  return clean(value).split(/(?<=[.!?])\s+/)[0] || "TBD";
}

export function analyzeNotes(notes) {
  const sections = sectionize(notes);
  const general = sections.general.join(" ");
  const decision = firstSentence((sections.decision || []).join(" ") || general);
  const contextParts = [...(sections.context || []), ...(sections.constraints || [])];
  const context = clean(contextParts.join(" ") || general || "Context needs to be added.");
  const rawOptions = [...(sections.options || []), ...(sections.option || [])];
  const options = rawOptions.length
    ? rawOptions.map((text, index) => ({ title: `Option ${index + 1}`, detail: clean(text) }))
    : [
        { title: "Option 1", detail: "Describe the lowest-risk path and its tradeoffs." },
        { title: "Option 2", detail: "Describe the alternative path and its tradeoffs." },
      ];
  const riskLines = [...(sections.risks || []), ...(sections.risk || []), ...(sections.assumptions || [])];
  const risks = riskLines.length ? riskLines.map((item) => `• ${clean(item)}`).join("\n") : "• Validate the assumptions behind each option.\n• Identify the cost of delaying the decision.";
  const owner = clean((sections.owner || [])[0] || "TBD");
  const deadline = clean((sections.deadline || sections.date || [])[0] || "TBD");
  const recommendation = options.length > 1
    ? `Validate the tradeoffs with the decision owner before selecting ${options[0].title} or ${options[1].title}.`
    : `Validate the tradeoffs with the decision owner before proceeding with ${options[0].title}.`;
  return { decision, context, options, recommendation, risks, owner, deadline };
}

export function briefToMarkdown(brief) {
  const lines = [
    "# Decision Brief",
    "",
    "## Decision to make",
    brief.decision || "TBD",
    "",
    "## Context",
    brief.context || "TBD",
    "",
    "## Options and tradeoffs",
    ...brief.options.flatMap((option) => [`### ${option.title || "Option"}`, option.detail || "TBD", ""]),
    "## Working recommendation",
    brief.recommendation || "TBD",
    "",
    "## Risks and assumptions",
    brief.risks || "TBD",
    "",
    `**Owner:** ${brief.owner || "TBD"}`,
    `**Decision deadline:** ${brief.deadline || "TBD"}`,
    "",
    "---",
    "Generated with Decision Lens. Review and validate before making a decision.",
    "",
  ];
  return lines.join("\n");
}
