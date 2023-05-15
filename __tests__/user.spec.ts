import { describe, expect, it, vi } from "vitest";
import UsersModel from "@/models/user";

// TODO:需要 mock server，DB
describe("測試 user", () => {
  it("test", async () => {
    vi.mock("@/models/user");
    const users = await UsersModel.find();
    expect(users).toBe(undefined);
  });
});
