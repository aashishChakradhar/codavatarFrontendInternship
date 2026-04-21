import {
  Currencies,
  convertAmount,
  getCurrencyRate,
} from "./currencyConverter.utils";

describe("currency converter", () => {
  test("returns 1 for unknown currency rate", () => {
    expect(getCurrencyRate("Unknown Currency")).toBe(1);
  });

  test("looks up a known currency rate", () => {
    expect(getCurrencyRate("Nepalese Rupee")).toBe(133.6);
  });

  test("converts USD to Nepalese Rupee", () => {
    const result = convertAmount(2, "American Dollar", "Nepalese Rupee");
    expect(result).toBeCloseTo(267.2, 5);
  });

  test("converts between non-USD currencies correctly", () => {
    const inr = getCurrencyRate("Indian Rupees");
    const yen = getCurrencyRate("Japanese Yen");
    const amount = 100;
    const result = convertAmount(amount, "Indian Rupees", "Japanese Yen");
    const expected = (amount * yen) / inr;

    expect(result).toBeCloseTo(expected, 10);
  });

  test("keeps value unchanged when from and to currency are same", () => {
    const result = convertAmount(45.5, "Euro", "Euro");
    expect(result).toBeCloseTo(45.5, 10);
  });

  test("currency list includes American Dollar", () => {
    const hasUsd = Currencies.some(
      (item) => item.currency === "American Dollar",
    );
    expect(hasUsd).toBe(true);
  });
});
