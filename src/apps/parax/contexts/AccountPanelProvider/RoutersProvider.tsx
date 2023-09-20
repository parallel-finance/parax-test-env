import { noop } from 'lodash';
import { ReactNode, createContext, memo, useContext } from 'react';
import { NavigateFunction } from 'react-router-dom';

export type RoutersContextValue = {
  paraXRouter: {
    navigate: NavigateFunction;
  };
  accountPanelRouter: {
    navigate: NavigateFunction;
  };
};

const RoutersContext = createContext<RoutersContextValue>({
  paraXRouter: {
    navigate: noop
  },
  accountPanelRouter: {
    navigate: noop
  }
});

export const RoutersProvider = memo(
  ({ children, value }: { children: ReactNode; value: RoutersContextValue }) => {
    return <RoutersContext.Provider value={value}>{children}</RoutersContext.Provider>;
  }
);

export const useRouters = () => useContext(RoutersContext);
