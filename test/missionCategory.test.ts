import test from "node:test";
import assert from "node:assert/strict";
import { resolveMissionCategory, groupMissionCategories } from "../src/lib/missionCategory.ts";
import type { MissionCategory } from "../src/types.ts";
const all: MissionCategory = { id: "all", label: "Whole map", difficulty: "hardest", description: "Server description" };
const animals: MissionCategory = { id: "animals", label: "Animals", difficulty: "easy", description: "Creatures" };
const challenge: MissionCategory = { id: "challenge", label: "Challenge", difficulty: "hardest", description: "Another broad pool" };

test("category selection uses server metadata and safely defaults when a reconnect removes the selected topic", () => {
  assert.equal(resolveMissionCategory([all, animals], "animals"), animals);
  assert.equal(resolveMissionCategory([all], "animals"), all);
  assert.equal(resolveMissionCategory([all, animals], "all"), all);
  assert.equal(resolveMissionCategory([], "animals").id, "all");
  assert.equal(resolveMissionCategory([], "all").difficulty, "hardest");
});
test("chooser includes every advertised difficulty without empty groups or duplicating All words", () => {
  const groups = groupMissionCategories([all, animals, challenge]);
  assert.deepEqual(groups.map(group => group.label), ["Easy", "Hardest"]);
  assert.deepEqual(groups.flatMap(group => group.categories.map(category => category.id)), ["animals", "challenge"]);
  assert.deepEqual(groupMissionCategories([]), []);
});
