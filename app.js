import { analyzeNotes, briefToMarkdown } from "./decision-utils.js";

const $ = (id) => document.getElementById(id);
const example = `Decision: Should we launch the new customer portal to all customers or begin with a limited pilot?

Context: Leadership wants visible progress this quarter. Authentication is complete, but reporting has only been tested with internal users.
Constraints: The support team can onboard no more than 15 customers per week. The public launch date is November 15.

Options:
- Launch to all customers on November 15; fastest reach, but the highest support and reliability exposure.
- Pilot with 10 customers for three weeks; slower reach, but creates evidence before scaling.
- Delay until reporting automation is complete; lowest operational risk, but misses the announced date.

Risks:
- A broad launch could overwhelm customer support.
- Pilot feedback may require reporting changes.
- Delaying may reduce leadership confidence.

Owner: Product lead
Deadline: October 18`;

let optionCounter = 0;

function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2000);
}

function optionRow(option = { title: "New option", detail: "" }) {
  optionCounter += 1;
  const row = document.createElement("article");
  row.className = "option-row";
  row.innerHTML = `<span class="option-number">${String(optionCounter).padStart(2, "0")}</span><div><input class="option-title" aria-label="Option title" /><textarea class="option-detail" rows="2" aria-label="Option tradeoffs"></textarea></div><button type="button" class="remove-option" aria-label="Remove option">×</button>`;
  row.querySelector(".option-title").value = option.title;
  row.querySelector(".option-detail").value = option.detail;
  row.querySelector(".remove-option").addEventListener("click", () => row.remove());
  return row;
}

function renderBrief(brief) {
  $("decision").value = brief.decision;
  $("context").value = brief.context;
  $("recommendation").value = brief.recommendation;
  $("risks").value = brief.risks;
  $("owner").value = brief.owner;
  $("deadline").value = brief.deadline;
  optionCounter = 0;
  $("options").replaceChildren(...brief.options.map(optionRow));
  $("empty-state").classList.add("is-hidden");
  $("brief").classList.remove("is-hidden");
  $("output-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function currentBrief() {
  return {
    decision: $("decision").value.trim(),
    context: $("context").value.trim(),
    options: [...document.querySelectorAll(".option-row")].map((row) => ({ title: row.querySelector(".option-title").value.trim(), detail: row.querySelector(".option-detail").value.trim() })),
    recommendation: $("recommendation").value.trim(),
    risks: $("risks").value.trim(),
    owner: $("owner").value.trim(),
    deadline: $("deadline").value.trim(),
  };
}

$("notes").addEventListener("input", (event) => { $("character-count").textContent = `${event.target.value.length.toLocaleString()} characters`; });
$("load-example").addEventListener("click", () => { $("notes").value = example; $("notes").dispatchEvent(new Event("input")); $("notes").focus(); });
$("notes-form").addEventListener("submit", (event) => { event.preventDefault(); renderBrief(analyzeNotes($("notes").value)); showToast("Draft brief generated"); });
$("add-option").addEventListener("click", () => $("options").append(optionRow()));
$("start-over").addEventListener("click", () => { $("notes-form").reset(); $("character-count").textContent = "0 characters"; $("brief").classList.add("is-hidden"); $("empty-state").classList.remove("is-hidden"); window.scrollTo({ top: 0, behavior: "smooth" }); });
$("copy-markdown").addEventListener("click", async () => { await navigator.clipboard.writeText(briefToMarkdown(currentBrief())); showToast("Markdown copied"); });
$("export-markdown").addEventListener("click", () => { const url = URL.createObjectURL(new Blob([briefToMarkdown(currentBrief())], { type: "text/markdown" })); const link = document.createElement("a"); link.href = url; link.download = "decision-brief.md"; link.click(); URL.revokeObjectURL(url); showToast("Decision brief exported"); });
