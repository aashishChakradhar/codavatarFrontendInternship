export interface CurrencyProp {
  currency: string;
  value: number;
}

export const Currencies: CurrencyProp[] = [
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

export const getCurrencyRate = (currencyName: string) => {
  const currency = Currencies.find((item) => item.currency === currencyName);
  return currency ? currency.value : 1;
};

export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
) => {
  const fromRate = getCurrencyRate(fromCurrency);
  const toRate = getCurrencyRate(toCurrency);
  return (amount * toRate) / fromRate;
};
