# Decision Lens

Decision Lens turns messy project notes into a clear, editable decision brief. This MVP deliberately uses transparent, deterministic browser logic to simulate the future AI experience—no API key, hidden model, or data collection required.

## Why this exists

Important project decisions are often scattered across meeting notes and chat threads. Teams may debate solutions before agreeing on the decision, constraints, options, risks, owner, or deadline. Decision Lens makes that structure visible and reviewable.

## Features

- Parse labeled notes into a structured decision brief
- Capture context, options, tradeoffs, recommendation, risks, owner, and deadline
- Edit every generated field
- Add or remove options
- Copy or export the brief as Markdown
- Load a realistic example
- Keep all data in the browser
- Clearly distinguish simulated analysis from real AI

## Try it locally

No package installation is required:

```bash
python3 -m http.server 8002
```

Visit `http://localhost:8002`. Run tests with:

```bash
npm test
```

## How the simulation works

The parser recognizes optional headings such as `Decision:`, `Context:`, `Options:`, `Risks:`, `Owner:`, and `Deadline:`. It structures those sections and supplies explicit placeholders when information is missing. It does not infer facts or call an AI model.

This is a product-prototyping choice: validate whether the workflow is useful before adding model cost, privacy considerations, prompt evaluation, and backend infrastructure.

## Responsible AI path

A future AI-powered version should:

1. Send requests through a server-side function so API keys never reach the browser.
2. Request schema-constrained structured output.
3. Distinguish extracted evidence from generated recommendations.
4. Preserve source-note references for important claims.
5. Evaluate the model against realistic decision notes before release.
6. Retain human editing and approval before export.

## Roadmap

- [ ] Save multiple decision records locally
- [ ] Highlight missing decision inputs before generation
- [ ] Add a comparison view for options
- [ ] Add secure, optional AI analysis
- [ ] Create an evaluation set for extraction accuracy

## License

[MIT](LICENSE)
