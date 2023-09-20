import { Inline, Icon, H5, InlineProps, useCallbackMerge } from '@parallel-mono/components';
import { useNavigate } from 'react-router-dom';
import { memo, useCallback, FC } from 'react';
import styled from 'styled-components';

const BackLink = styled(Inline)`
  cursor: pointer;
  width: fit-content;
  :hover {
    text-decoration: underline;
  }
`;

export const GoBack: FC<InlineProps> = memo(({ ...props }) => {
  return (
    <BackLink alignItems="center" gap="0.5rem" {...props}>
      <Icon name="arrowLeft" strokeWidth={2} width="1.25rem" height="1.25rem" />
      <H5 fontWeight="medium">Back</H5>
    </BackLink>
  );
});

export const RouterGoBack: FC<InlineProps> = memo(({ onClick, ...others }) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => navigate(-1), [navigate]);
  const mergedHandleClick = useCallbackMerge(handleClick, onClick);

  return <GoBack onClick={mergedHandleClick} {...others} />;
});
