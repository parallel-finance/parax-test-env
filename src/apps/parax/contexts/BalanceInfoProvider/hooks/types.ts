import { ComputedUserReserve, FormatReserveUSDResponse } from 'paraspace-utilities-math-utils';
import { ReserveDataHumanized } from 'paraspace-utilities-contract-helpers';

export type PositionMap = Record<
  string,
  ComputedUserReserve<ReserveDataHumanized & FormatReserveUSDResponse>
>;
