import type { ConverterRenderProps } from "./converterContainer.component";

type ConverterPresentationProps = ConverterRenderProps;

export default function ConverterPresentation({
  currencies,
  fromAmount,
  toAmount,
  fromCurrency,
  toCurrency,
  onFromAmountChange,
  onToAmountChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  onSwap,
}: ConverterPresentationProps) {
  return (
    <div>
      <div>
        <label htmlFor="fromCurrency">From</label>
        <select
          id="fromCurrency"
          name="fromCurrency"
          value={fromCurrency}
          onChange={onFromCurrencyChange}
        >
          {currencies.map((currency, index) => (
            <option key={index} value={currency.currency}>
              {currency.currency}
            </option>
          ))}
        </select>
        <input
          type="number"
          id="fromAmount"
          name="fromAmount"
          value={fromAmount}
          onChange={onFromAmountChange}
        />
      </div>

      <div>
        <button type="button" onClick={onSwap}>
          Swap
        </button>
      </div>

      <div>
        <label htmlFor="toCurrency">To</label>
        <select
          id="toCurrency"
          name="toCurrency"
          value={toCurrency}
          onChange={onToCurrencyChange}
        >
          {currencies.map((currency, index) => (
            <option key={index} value={currency.currency}>
              {currency.currency}
            </option>
          ))}
        </select>
        <input
          type="number"
          id="toAmount"
          name="toAmount"
          value={toAmount}
          onChange={onToAmountChange}
        />
      </div>
    </div>
  );
}
