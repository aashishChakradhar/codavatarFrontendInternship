import { useState, type ChangeEvent } from "react";

export interface CurrencyRate {
  currency: string;
  value: number;
}

export const CURRENCIES: CurrencyRate[] = [
  { currency: "Indian Rupees", value: 83.5 },
  { currency: "Euro", value: 0.92 },
  { currency: "British Pound", value: 0.79 },
  { currency: "Japanese Yen", value: 151.8 },
  { currency: "Chinese Yuan", value: 7.24 },
  { currency: "Canadian Dollar", value: 1.36 },
  { currency: "Australian Dollar", value: 1.52 },
  { currency: "Swiss Franc", value: 0.9 },
  { currency: "Singapore Dollar", value: 1.35 },
  { currency: "UAE Dirham", value: 3.67 },
  { currency: "Saudi Riyal", value: 3.75 },
  { currency: "Qatari Riyal", value: 3.64 },
  { currency: "Kuwaiti Dinar", value: 0.31 },
  { currency: "Bahraini Dinar", value: 0.38 },
  { currency: "Omani Rial", value: 0.38 },
  { currency: "South Korean Won", value: 1348 },
  { currency: "Thai Baht", value: 36.1 },
  { currency: "Malaysian Ringgit", value: 4.73 },
  { currency: "Indonesian Rupiah", value: 15840 },
  { currency: "Pakistani Rupee", value: 278 },
  { currency: "Nepalese Rupee", value: 133.6 },
];

export interface ConverterRenderProps {
  currencies: CurrencyRate[];
  fromAmount: number;
  toAmount: number;
  fromCurrency: string;
  toCurrency: string;
  onFromAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onToAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFromCurrencyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onToCurrencyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSwap: () => void;
}

interface ConverterContainerProps {
  render: (props: ConverterRenderProps) => React.ReactNode;
}

export default function ConverterContainer({
  render,
}: ConverterContainerProps) {
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0.92);
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0].currency);
  const [toCurrency, setToCurrency] = useState(CURRENCIES[1].currency);

  const getRate = (currencyName: string) => {
    const found = CURRENCIES.find((item) => item.currency === currencyName);
    return found ? found.value : 1;
  };

  const convert = (
    amount: number,
    sourceCurrency: string,
    targetCurrency: string,
  ) => {
    const sourceRate = getRate(sourceCurrency);
    const targetRate = getRate(targetCurrency);
    return (amount * targetRate) / sourceRate;
  };

  const parseAmount = (rawValue: string) => {
    const numericValue = Number(rawValue);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };

  const onFromAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextAmount = parseAmount(event.target.value);
    setFromAmount(nextAmount);
    setToAmount(convert(nextAmount, fromCurrency, toCurrency));
  };

  const onToAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextAmount = parseAmount(event.target.value);
    setToAmount(nextAmount);
    setFromAmount(convert(nextAmount, toCurrency, fromCurrency));
  };

  const onFromCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextCurrency = event.target.value;
    setFromCurrency(nextCurrency);
    setToAmount(convert(fromAmount, nextCurrency, toCurrency));
  };

  const onToCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextCurrency = event.target.value;
    setToCurrency(nextCurrency);
    setToAmount(convert(fromAmount, fromCurrency, nextCurrency));
  };

  const onSwap = () => {
    const nextFromCurrency = toCurrency;
    const nextToCurrency = fromCurrency;
    const nextFromAmount = toAmount;
    const nextToAmount = fromAmount;

    setFromCurrency(nextFromCurrency);
    setToCurrency(nextToCurrency);
    setFromAmount(nextFromAmount);
    setToAmount(nextToAmount);
  };

  return (
    <>
      {render({
        currencies: CURRENCIES,
        fromAmount,
        toAmount,
        fromCurrency,
        toCurrency,
        onFromAmountChange,
        onToAmountChange,
        onFromCurrencyChange,
        onToCurrencyChange,
        onSwap,
      })}
    </>
  );
}
