import type { ChangeEvent } from "react";
import type { CurrencyProp } from "./currencyConverter.utils";
import "../../styles/currencyConverter/currencyConverter.styles.css";

export interface ConverterViewProps {
  currencies: CurrencyProp[];
  fromValue: number;
  toValue: number;
  fromCurrency: string;
  toCurrency: string;
  onFromCurrencyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onToCurrencyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onFromValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onToValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onConvert: () => void;
}

export default function ConverterView({
  currencies,
  fromValue,
  toValue,
  fromCurrency,
  toCurrency,
  onFromCurrencyChange,
  onToCurrencyChange,
  onFromValueChange,
  onToValueChange,
  onConvert,
}: ConverterViewProps) {
  return (
    <main className="mainContainer">
      <div className="displayContainer">
        <div className="sectionContainer">
          <span>From:</span>
          <select
            name="fromCurrency"
            id="fromCurrency"
            value={fromCurrency}
            onChange={onFromCurrencyChange}
          >
            {currencies.map((country, index) => (
              <option key={index} value={country.currency}>
                {country.currency}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="fromValue"
            value={fromValue}
            onChange={onFromValueChange}
          />
        </div>
        <div className="sectionContainer">
          <span>To:</span>
          <select
            name="toCurrency"
            id="toCurrency"
            value={toCurrency}
            onChange={onToCurrencyChange}
          >
            {currencies.map((country, index) => (
              <option key={index} value={country.currency}>
                {country.currency}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="toValue"
            value={toValue}
            onChange={onToValueChange}
          />
        </div>
        <button onClick={onConvert} hidden={true}>
          Convert
        </button>
      </div>
    </main>
  );
}
