# QVAC Goal Breakdown Planner

Enter a big goal, and an on-device AI breaks it into 3-5 smaller concrete milestones. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32017

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

## Example

Input: `{"goal":"launch a small online store"}`

Output (from a real run):
```json
{"goal":"launch a small online store","milestones":[
  "Create and design a functional online store with a simple user interface.",
  "Develop a comprehensive product catalog of 50+ digital products.",
  "Build a seamless checkout process with payment gateway integration.",
  "Set up an email marketing system and create a welcome email sequence.",
  "Implement a content management system for product descriptions, images, and reviews."
]}
```

## License

MIT
