import { ComponentType, ReactNode, forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export type RouterImperativeHandles = {
  navigate: NavigateFunction;
};

const NavigateFunctionElevator = memo(
  // eslint-disable-next-line react/no-unused-prop-types
  forwardRef<RouterImperativeHandles, { children: ReactNode }>(({ children }, ref) => {
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
      navigate
    }));

    return <>{children}</>;
  })
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function createImperativeRouter<P>(Router: ComponentType<P>) {
  const ImperativeRouter = memo(
    forwardRef<RouterImperativeHandles, P>(({ children, ...others }, ref) => {
      const elevatorRef = useRef<RouterImperativeHandles>(null);
      useImperativeHandle(ref, () => elevatorRef.current!);

      // TODO fix typing with others as P
      return (
        <Router {...(others as P)}>
          <NavigateFunctionElevator ref={elevatorRef}>{children}</NavigateFunctionElevator>
        </Router>
      );
    })
  );

  return ImperativeRouter;
}
