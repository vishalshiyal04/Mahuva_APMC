import test from "node:test";
import assert from "node:assert/strict";
import express from "../server/node_modules/express/index.js";
import { Rate } from "../server/models/index.js";
import publicRoutes from "../server/routes/public.routes.js";
import trendsRoutes from "../server/routes/trends.routes.js";
import manageRoutes from "../server/routes/adminManage.routes.js";
import { indiaDay } from "../server/services/assistant.js";

const day = indiaDay();
const fixture = [
  { crop: "લાલ ડુંગળી", date: day, min: 100, max: 200 },
  { crop: "સફેદ ડુંગળી", date: day, min: 300, max: 400 },
  { crop: "ડુંગળી", date: day, min: 1, max: 2 },
  {
    crop: "મગફળી 24",
    date: day,
    min: 1000,
    max: 2000,
    unitKg: 100,
    unitLabel: "ક્વિન્ટલ",
  },
  {
    crop: "મગફળી 32",
    date: day,
    min: 500,
    max: 600,
    unitKg: 20,
    unitLabel: "મણ",
  },
];
const app = express();
app.use(express.json());
app.use("/api", publicRoutes, trendsRoutes, manageRoutes);
let server, origin, originalFind;
test.before(async () => {
  originalFind = Rate.find;
  Rate.find = () => ({ lean: async () => fixture });
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.after(async () => {
  Rate.find = originalFind;
  await new Promise((resolve) => server.close(resolve));
});
for (const [crop, min] of [
  ["લાલ ડુંગળી", 100],
  ["સફેદ ડુંગળી", 300],
  ["મગફળી 24", 200],
  ["મગફળી 32", 500],
  ["ડુંગળી", 1],
]) {
  test(`HTTP single trend separates ${crop}`, async () => {
    const r = await fetch(
      origin + "/api/rates/trend?crop=" + encodeURIComponent(crop),
    );
    assert.equal(r.status, 200);
    const rows = await r.json();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].min, min);
  });
}
test("single and all-trends APIs agree on units and values", async () => {
  const all = await (await fetch(origin + "/api/rates/trends")).json();
  const single = await (
    await fetch(
      origin + "/api/rates/trend?crop=" + encodeURIComponent("મગફળી 24"),
    )
  ).json();
  assert.equal(all.series["મગફળી 24"][day].min, single[0].min);
  assert.equal(all.series["ડુંગળી"][day].min, 1);
  assert.equal(all.days.at(-1), day);
});
test("empty/malformed graph selection returns a controlled error", async () => {
  assert.equal((await fetch(origin + "/api/rates/trend")).status, 400);
  assert.equal(
    (await fetch(origin + "/api/rates/trend?crop[]=bad")).status,
    400,
  );
});
test("removed user PUT and DELETE endpoints return 404", async () => {
  for (const method of ["PUT", "DELETE"])
    assert.equal(
      (await fetch(origin + "/api/admin/users/123", { method })).status,
      404,
    );
});
