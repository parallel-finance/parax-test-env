import {
  Inline,
  Stack,
  StackProps,
  Stepper as RawStepper,
  Spinner
} from '@parallel-mono/components';
import { FC, ReactNode, memo, useMemo } from 'react';
import styled from 'styled-components';

export type Step = {
  description: ReactNode;
  content: ReactNode;
  pass?: boolean;
};

const SpinnerWithCenter = styled(Spinner)`
  display: block;
  margin: 0 auto;
`;

export type StepperProps = Omit<StackProps, 'children'> & {
  steps: Step[];
  step: number;
};

export const Stepper: FC<StepperProps> = memo(({ steps, step, ...others }) => {
  const finalSteps = useMemo(
    () =>
      steps
        .filter(({ pass }) => !pass)
        .map(({ description, content }, index, array) => ({
          title: index === array.length - 1 ? 'Finally' : `Step ${index + 1}`,
          description,
          content
        })),
    [steps]
  );

  if (finalSteps.length === 0) {
    return <SpinnerWithCenter />;
  }

  // Out of the steps
  if (step >= finalSteps.length) {
    return null;
  }

  return (
    <Stack {...others}>
      {finalSteps.length > 1 && <RawStepper steps={finalSteps} step={step} />}
      {finalSteps.length === 1 && (
        <Inline justifyContent="center">{finalSteps[0].description}</Inline>
      )}
      {finalSteps[step].content}
    </Stack>
  );
});
