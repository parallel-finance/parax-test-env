import { useEffect } from 'react';
import { noop } from 'lodash';

import { emptyArray } from '../consts';

export const useAsyncEffect = (action = noop, deps: any[] = emptyArray, unMount = noop) => {
  const actionWrapper = async () => action();
  useEffect(() => {
    actionWrapper();
    return unMount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
