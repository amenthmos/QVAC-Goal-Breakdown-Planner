// QVAC Goal Breakdown Planner — core logic.
// Given a big goal, breaks it into 3-5 smaller concrete milestones.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function parseMilestones(text) {
  return text
    .split("\n")
    .map((l) => l.replace(/^[\s\-*\d.)]+/, "").trim())
    .filter((l) => l.length > 3);
}

function fallbackMilestones(goal) {
  return [
    `Clarify exactly what "done" looks like for: ${goal}.`,
    "Break the work into the first few concrete tasks you can start this week.",
    "Identify what resources, skills, or help you'll need along the way.",
    "Set a rough checkpoint partway through to review progress and adjust.",
    `Define the final step that completes: ${goal}.`,
  ];
}

export async function breakdownGoal(modelId, body) {
  const goal = (body.goal || "").trim();
  if (!goal) {
    const err = new Error("Please enter a goal first.");
    err.statusCode = 400;
    throw err;
  }

  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You break big goals into smaller concrete milestones. Given a goal, " +
          "reply with 3-5 short milestone lines, one per line, each a concrete, " +
          "achievable step toward the goal, in a sensible order. No preamble, " +
          "no explanations, just the milestones.",
      },
      { role: "user", content: "Goal: Run a marathon" },
      {
        role: "assistant",
        content:
          "Build a consistent running base of 3-4 runs per week for a month.\n" +
          "Complete a half-marathon distance run to test endurance.\n" +
          "Follow a structured 12-16 week marathon training plan.\n" +
          "Do a final long run of 20+ miles a few weeks before race day.\n" +
          "Taper training in the final two weeks and run the marathon.",
      },
      { role: "user", content: `Goal: ${goal}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.6, maxTokens: 260 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = text.trim().replace(/^here'?s[^:\n]*:\s*/i, "").trim();

  let milestones = looksUnusable(text) ? [] : parseMilestones(text);
  if (milestones.length < 2) milestones = fallbackMilestones(goal);
  milestones = milestones.slice(0, 5);

  return { goal, milestones };
}
