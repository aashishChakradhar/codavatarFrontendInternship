import React from "react";
import {
  Currencies,
  convertAmount,
  getCurrencyRate,
} from "./currencyConverter.utils";
import ConverterView from "./currencyConverter.component";
import ErrorBoundary from "../errorBoundry/errorBoundry";

export interface ConverterState {
  fromValue: number;
  toValue: number;
  fromCurrency: string;
  toCurrency: string;
}

class CurrencyClass extends React.Component<{}, ConverterState> {
  state: ConverterState = {
    fromValue: 1,
    toValue: 0,
    fromCurrency: Currencies[0].currency,
    toCurrency: Currencies[1].currency,
  };

  getCurrencyRate = (currencyName: string) => getCurrencyRate(currencyName);

  convertAmount = (amount: number, fromCurrency: string, toCurrency: string) =>
    convertAmount(amount, fromCurrency, toCurrency);

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
      <ConverterView
        currencies={Currencies}
        fromValue={fromValue}
        toValue={toValue}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        onFromCurrencyChange={this.handleFromCurrency}
        onToCurrencyChange={this.handleToCurrency}
        onFromValueChange={this.handleFromValue}
        onToValueChange={this.handleToValue}
        onConvert={this.handleClick}
      />
    );
  }
}

const ConverterClassComponent = () => {
  return (
    <ErrorBoundary>
      <CurrencyClass />
    </ErrorBoundary>
  );
};

export default ConverterClassComponent;
