import assert from "node:assert/strict";
import { flowScenarios, normalizeStep } from "../src/data/flow.ts";

assert.equal(flowScenarios.length, 3);
assert.equal(new Set(flowScenarios.map(({ id }) => id)).size, 3);
for (const scenario of flowScenarios) {
  assert.equal(normalizeStep(-1, scenario.steps.length), 0);
  assert.equal(
    normalizeStep(scenario.steps.length, scenario.steps.length),
    scenario.steps.length - 1,
  );
  scenario.steps.forEach((step, index) => {
    assert.equal(normalizeStep(index, scenario.steps.length), index);
    assert.ok(step.nodes.length > 0);
    step.reverseLinks?.forEach((link) => assert.ok(step.links.includes(link)));
    for (const locale of ["pt", "en"] as const) {
      assert.ok(step.title[locale] && step.description[locale]);
    }
  });
}
const retry = flowScenarios.find(({ id }) => id === "idempotency")!;
assert.equal(retry.steps[0].badge, "Idempotency-Key");
assert.equal(retry.steps[4].badge, retry.steps[0].badge);
assert.deepEqual(retry.steps.at(-1)!.nodes, ["api", "database"]);
assert.deepEqual(retry.steps[2].reverseLinks, ["session-api"]);
assert.deepEqual(retry.steps[3].reverseLinks, ["keychain-session"]);
const authenticated = flowScenarios.find(({ id }) => id === "authenticated")!;
assert.deepEqual(authenticated.steps.at(-1)!.reverseLinks, ["session-api", "client-session"]);
const refresh = flowScenarios.find(({ id }) => id === "refresh")!;
assert.deepEqual(refresh.steps[1].reverseLinks, ["session-api"]);
assert.deepEqual(refresh.steps[3].reverseLinks, ["keychain-session"]);
assert.deepEqual(refresh.steps.at(-1)!.reverseLinks, ["client-session"]);
console.log("Flow scenarios, navigation, retry key and response directions: passed.");
