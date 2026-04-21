import type { ChangeEvent } from "react";
import type { CurrencyProp } from "./currencyConverter.utils";
import "../../styles/currencyConverter/currencyConverter.css";
import { NavLink } from "react-router-dom";

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
    <div className="container">
      <NavLink to="/">Form</NavLink>
      <section className="displayContainer">
        <h2>Currency Converter</h2>
        <section>
          <h3>From:</h3>
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
        </section>
        <section>
          <h3>To:</h3>
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
        </section>
        <button onClick={onConvert} hidden={true}>
          Convert
        </button>
      </section>
    </div>
  );
}
