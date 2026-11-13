export const integerFormatConfig: {
  locale: string | string[];
  options: Intl.NumberFormatOptions;
} = {
  locale: 'ru',
  options: { maximumFractionDigits: 0 },
};

export const integerFormatter = new Intl.NumberFormat(
  integerFormatConfig.locale,
  integerFormatConfig.options
);

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}
