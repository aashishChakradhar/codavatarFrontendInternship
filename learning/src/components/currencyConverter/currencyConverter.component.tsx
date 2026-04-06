import React from "react";

export interface CurrencyProp {
  currency: string;
  value: number;
}

const Currencies: CurrencyProp[] = [
  {
    currency: "American Dollar",
    value: 1,
  },
  {
    currency: "Nepalese Rupee",
    value: 133.6,
  },
  {
    currency: "Indian Rupees",
    value: 83.5,
  },
  {
    currency: "Euro",
    value: 0.92,
  },
  {
    currency: "British Pound",
    value: 0.79,
  },
  {
    currency: "Japanese Yen",
    value: 151.8,
  },
  {
    currency: "Chinese Yuan",
    value: 7.24,
  },
  {
    currency: "Canadian Dollar",
    value: 1.36,
  },
  {
    currency: "Australian Dollar",
    value: 1.52,
  },
  {
    currency: "Swiss Franc",
    value: 0.9,
  },
  {
    currency: "Singapore Dollar",
    value: 1.35,
  },
  {
    currency: "UAE Dirham",
    value: 3.67,
  },
  {
    currency: "Saudi Riyal",
    value: 3.75,
  },
  {
    currency: "Qatari Riyal",
    value: 3.64,
  },
  {
    currency: "Kuwaiti Dinar",
    value: 0.31,
  },
  {
    currency: "Bahraini Dinar",
    value: 0.38,
  },
  {
    currency: "Omani Rial",
    value: 0.38,
  },
  {
    currency: "South Korean Won",
    value: 1348,
  },
  {
    currency: "Thai Baht",
    value: 36.1,
  },
  {
    currency: "Malaysian Ringgit",
    value: 4.73,
  },
  {
    currency: "Indonesian Rupiah",
    value: 15840,
  },
  {
    currency: "Pakistani Rupee",
    value: 278,
  },
];

interface ConverterState {
  fromValue: number;
  toValue: number;
  fromCurrency: string;
  toCurrency: string;
}

export default class ConverterClass extends React.Component<
  {},
  ConverterState
> {
  state: ConverterState = {
    fromValue: 1,
    toValue: 0,
    fromCurrency: Currencies[0].currency,
    toCurrency: Currencies[1].currency,
  };

  getCurrencyRate = (currencyName: string) => {
    const currency = Currencies.find((item) => item.currency === currencyName);
    return currency ? currency.value : 1;
  };

  convertAmount = (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ) => {
    const fromRate = this.getCurrencyRate(fromCurrency);
    const toRate = this.getCurrencyRate(toCurrency);
    return (amount * toRate) / fromRate;
  };

  handleFromCurrency = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value;
    this.setState((prevState) => ({
      fromCurrency: selectedCurrency,
      toValue: this.convertAmount(
        prevState.fromValue,
        selectedCurrency,
        prevState.toCurrency,
      ),
    }));
  };

  handleToCurrency = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value;
    this.setState((prevState) => ({
      toCurrency: selectedCurrency,
      toValue: this.convertAmount(
        prevState.fromValue,
        prevState.fromCurrency,
        selectedCurrency,
      ),
    }));
  };

  handleFromValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(event.target.value);
    const safeAmount = Number.isFinite(amount) ? amount : 0;

    this.setState((prevState) => ({
      fromValue: safeAmount,
      toValue: this.convertAmount(
        safeAmount,
        prevState.fromCurrency,
        prevState.toCurrency,
      ),
    }));
  };

  handleToValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(event.target.value);
    const safeAmount = Number.isFinite(amount) ? amount : 0;

    this.setState((prevState) => ({
      toValue: safeAmount,
      fromValue: this.convertAmount(
        safeAmount,
        prevState.toCurrency,
        prevState.fromCurrency,
      ),
    }));
  };

  handleClick = () => {
    this.setState((prevState) => ({
      toValue: this.convertAmount(
        prevState.fromValue,
        prevState.fromCurrency,
        prevState.toCurrency,
      ),
    }));
  };

  componentDidMount() {
    this.setState((prevState) => ({
      toValue: this.convertAmount(
        prevState.fromValue,
        prevState.fromCurrency,
        prevState.toCurrency,
      ),
    }));
  }

  render() {
    const { fromValue, toValue, fromCurrency, toCurrency } = this.state;

    return (
      <div>
        <div>
          From
          <select
            name="fromCurrency"
            id="fromCurrency"
            value={fromCurrency}
            onChange={this.handleFromCurrency}
          >
            {Currencies.map((country, index) => (
              <option key={index} value={country.currency}>
                {country.currency}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="fromValue"
            value={fromValue}
            onChange={this.handleFromValue}
          />
        </div>

        <div>
          To:
          <select
            name="toCurrency"
            id="toCurrency"
            value={toCurrency}
            onChange={this.handleToCurrency}
          >
            {Currencies.map((country, index) => (
              <option key={index} value={country.currency}>
                {country.currency}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="toValue"
            value={toValue}
            onChange={this.handleToValue}
          />
        </div>

        <button onClick={this.handleClick}>Convert</button>
      </div>
    );
  }
}
