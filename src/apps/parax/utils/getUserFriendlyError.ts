export interface ErrorConfig {
  code: number | string;
  alreadyHasFriendlyErrorMsg: boolean;
  userFriendlyErrorMsg: string;
}

export const ERROR_MAP: Record<string, ErrorConfig> = {
  // metamask user cancel tx
  4001: {
    code: 4001,
    alreadyHasFriendlyErrorMsg: false,
    userFriendlyErrorMsg: 'You rejected transaction.'
  },
  '-32000': {
    code: -32000,
    alreadyHasFriendlyErrorMsg: true,
    userFriendlyErrorMsg: ''
  },
  ACTION_REJECTED: {
    code: 'ACTION_REJECTED',
    alreadyHasFriendlyErrorMsg: false,
    userFriendlyErrorMsg: 'You rejected transaction.'
  },
  'execution reverted: 51': {
    code: 51,
    alreadyHasFriendlyErrorMsg: false,
    userFriendlyErrorMsg: 'Supply cap has been reached. Please try again later.'
  },
  'execution reverted: 35': {
    code: 35,
    alreadyHasFriendlyErrorMsg: false,
    userFriendlyErrorMsg:
      'Health factor is lower than the liquidation threshold. Please repay some tokens then try again.'
  },
  'execution reverted: ERC20: transfer amount exceeds balance': {
    code: 3,
    alreadyHasFriendlyErrorMsg: false,
    userFriendlyErrorMsg:
      'Transfer amount exceeds your balance. Please top up your token balance then try again.'
  },
  'execution reverted: Price slippage check': {
    code: 3,
    alreadyHasFriendlyErrorMsg: false,
    userFriendlyErrorMsg:
      'Price slippage check failed. Please adjust your input to conform the token pair price range.'
  },
  'execution reverted: Pausable: paused': {
    code: 3,
    alreadyHasFriendlyErrorMsg: false,
    userFriendlyErrorMsg:
      'The token asset has been paused by the contract owner. Please try again later.'
  },
  '-32002': {
    code: -32002,
    alreadyHasFriendlyErrorMsg: false,
    userFriendlyErrorMsg:
      'There is already a pending transaction on your wallet, please confirm pending one first.'
  }
};

export const getUserFriendlyError = <T extends Error | ErrorConfig>(
  error: any,
  fallbackMsg?: string,
  respType?: 'errObj'
): T => {
  console.error(error);
  const errorConfig =
    ERROR_MAP[error?.code] ||
    ERROR_MAP[error?.reason] ||
    // gas estimate
    Object.values(ERROR_MAP).find(each =>
      error?.reason?.includes(`reverted with reason string '${each.code}'`)
    );

  if (respType === 'errObj') {
    return errorConfig as T;
  }

  if (errorConfig) {
    if (errorConfig.alreadyHasFriendlyErrorMsg) {
      return error;
    }
    return new Error(errorConfig.userFriendlyErrorMsg) as T;
  }

  return new Error(fallbackMsg || 'Unknown Internal Error!') as T;
};
