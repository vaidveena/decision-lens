import test from "node:test";
import assert from "node:assert/strict";
import { analyzeNotes, briefToMarkdown } from "../decision-utils.js";

const notes = `Decision: Should we launch broadly or run a pilot?
Context: Authentication is ready, but reporting is untested.
Options:
- Launch broadly for faster reach.
- Pilot with ten customers to learn first.
Risks:
- Support could be overwhelmed.
Owner: Product lead
Deadline: October 18`;

test("extracts structured fields from labeled notes", () => {
  const brief = analyzeNotes(notes);
  assert.equal(brief.decision, "Should we launch broadly or run a pilot?");
  assert.equal(brief.options.length, 2);
  assert.equal(brief.owner, "Product lead");
  assert.equal(brief.deadline, "October 18");
  assert.match(brief.risks, /Support could be overwhelmed/);
});

test("provides honest placeholders for incomplete notes", () => {
  const brief = analyzeNotes("We need to decide how to launch.");
  assert.equal(brief.options.length, 2);
  assert.equal(brief.owner, "TBD");
  assert.equal(brief.deadline, "TBD");
});

test("exports an editable brief as Markdown", () => {
  const markdown = briefToMarkdown(analyzeNotes(notes));
  assert.match(markdown, /^# Decision Brief/);
  assert.match(markdown, /## Options and tradeoffs/);
  assert.match(markdown, /\*\*Owner:\*\* Product lead/);
  assert.match(markdown, /Review and validate/);
});
