import { formatNumber as formatNumberUtil } from '@parallel-mono/utils';
import BigNumber from 'bignumber.js';
import { truncate } from 'lodash';

export const MAXIMUM_BALANCE_DECIMALS = 4;
export const MIN_BALANCE_THRESHOLD = 0.0001;

const formatToCurrency = (
  number: number | BigNumber,
  {
    decimal = 2,
    average = true,
    min = 10 ** -decimal
  }: {
    decimal?: number;
    average?: boolean;
    min?: number;
  } = {}
) => {
  return formatNumberUtil(number, {
    output: 'currency',
    decimal,
    average,
    threshold: {
      min
    }
  });
};

const formatBalance = (
  number: number | BigNumber | null | undefined,
  decimal: number = 4,
  min: number = 0.0001
) =>
  formatNumberUtil(number ?? 0, {
    decimal,
    average: true,
    threshold: {
      min
    }
  });

const truncateTextMid = (text: string, start = 4, end = 4) =>
  text.length > start + end ? text.replace(text.substring(start, text.length - end), '...') : text;

const truncateTextEnd = (text: string, length = 16) => truncate(text, { length: length + 3 });

export { formatToCurrency, truncateTextMid, truncateTextEnd, formatBalance };
