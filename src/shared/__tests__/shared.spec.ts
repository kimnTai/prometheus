import { checkValidator } from "@/shared";
import { describe, expect, test } from "vitest";

describe("測試 checkValidator", () => {
  test("如果名稱字段的長度不是至少 2 個字符，則應該拋出錯誤", () => {
    expect(() =>
      checkValidator({
        name: "a",
      })
    ).to.throw("name 至少 2 個字元以上");
  });

  test("如果電子郵件字段不是有效的電子郵件格式，應該拋出錯誤", () => {
    expect(() =>
      checkValidator({
        email: "invalid-email",
      })
    ).to.throw("Email 格式不正確");
  });

  test("如果密碼字段長度少於 8 個字符，應該拋出錯誤", () => {
    expect(() =>
      checkValidator({
        password: "Abc123",
      })
    ).to.throw("密碼需至少 8 碼以上");
  });

  test("如果密碼字段只包含字母，應該拋出錯誤", () => {
    expect(() =>
      checkValidator({
        password: "abcdefgh",
      })
    ).to.throw("密碼不能只有英文");
  });

  test("如果密碼字段只包含數字應該拋出錯誤", () => {
    expect(() =>
      checkValidator({
        password: "12345678",
      })
    ).to.throw("密碼不能只有數字");
  });

  test("當圖像 URL 不是 HTTPS 時應該拋出錯誤", () => {
    expect(() =>
      checkValidator({ image: "http://example.com/image.jpg" })
    ).toThrowError("image 格式不正確");
    expect(() =>
      checkValidator({ avatar: "http://example.com/image.jpg" })
    ).toThrowError("avatar 格式不正確");
  });

  test("當所有字段都有效時不應拋出錯誤", () => {
    expect(() =>
      checkValidator({
        name: "John Doe",
        sex: "male",
        email: "john.doe@example.com",
        password: "Abc12345",
        image: "https://example.com/image.jpg",
      })
    ).not.toThrow();
  });

  test("如果顏色不是有效的十六進制顏色，應該拋出錯誤", () => {
    expect(() =>
      checkValidator({
        color: "not_a_hex_color",
      })
    ).toThrow("color 必須為十六進制顏色");

    expect(() =>
      checkValidator({
        color: "#fff",
      })
    ).not.toThrow();
  });

  test("position 測試", () => {
    expect(() =>
      checkValidator({
        position: 123,
      })
    ).not.toThrow();

    expect(() =>
      checkValidator({
        position: "456",
      })
    ).not.toThrow();

    expect(() =>
      checkValidator({
        position: "abc",
      })
    ).toThrow("position 必須為數字");

    expect(() =>
      checkValidator({
        position: -1,
      })
    ).toThrow("position 必須大於 0");
  });
});
