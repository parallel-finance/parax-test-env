import {
  Inline,
  Icon,
  Text,
  H5,
  Tooltip,
  TooltipProps,
  SmallText,
  Container,
  ContainerProps
} from '@parallel-mono/components';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { memo, useCallback, useRef } from 'react';

import { routeNamesMap } from '../routeNames';

import { useAAProvider } from '@/apps/parax/contexts';
import { truncateTextMid } from '@/apps/parax/utils';

type AccountHeaderWithHomeProps = Omit<ContainerProps, 'children'> & {
  expanded: boolean;
  onClickAccount: () => void;
};
type AccountHeaderWithBackProps = Omit<ContainerProps, 'children'>;

const createAccountTipClassNames: TooltipProps['classNames'] = {
  tipContainer: 'create-account-tip-container'
};

const GlobalStyles = createGlobalStyle`
  .${createAccountTipClassNames.tipContainer} {
    padding: 0.5rem;
  }
`;

const CreateAccountTip = styled(Tooltip)`
  cursor: pointer;
`;

const HeaderContainer = styled(Container)`
  border-bottom: 1px solid ${({ theme }) => theme.skin.grey[200]};
  position: sticky;
  top: 0;
  z-index: 999;
`;
const IconWithRotate = styled(Icon)<{ $expanded: boolean }>`
  transform: ${({ $expanded }) => ($expanded ? 'rotate(-180deg)' : 'rotate(0)')};
  transition: transform 0.3s ease;
`;
const BackLink = styled(Inline)`
  cursor: pointer;
  width: fit-content;
  :hover {
    text-decoration: underline;
  }
`;
const InlineWithCursor = styled(Inline)`
  cursor: pointer;
`;

export const AccountHeaderWithHome = memo(
  ({ expanded, onClickAccount, ...props }: AccountHeaderWithHomeProps) => {
    const navigate = useNavigate();
    const { account } = useAAProvider();

    const container = useRef<HTMLInputElement>(null);
    const handleToolTipContainer = useCallback(
      () => container?.current || document.getElementById('root')!,
      [container]
    );

    return (
      <HeaderContainer ref={container} {...props}>
        <Inline gap="0" justifyContent="space-between" alignItems="center" inset="1rem 2rem">
          <GlobalStyles />
          <CreateAccountTip
            zIndex={1000000}
            classNames={createAccountTipClassNames}
            onClick={() => navigate(routeNamesMap.CREATE_PARA_ACCOUNT)}
            content={<SmallText>Create ParaX Account</SmallText>}
            placement="bottom-start"
            gap="0.25rem"
            getPopupContainer={handleToolTipContainer}
          >
            <Icon name="plusCircle" strokeWidth={2} />
          </CreateAccountTip>
          <InlineWithCursor gap="0.5rem" alignItems="center" onClick={onClickAccount}>
            <Text>{account ? truncateTextMid(account) : 'No Account Connected'}</Text>
            <IconWithRotate $expanded={expanded} name="chevronDown" size="small" strokeWidth="2" />
          </InlineWithCursor>
          <br />
        </Inline>
      </HeaderContainer>
    );
  }
);

export const AccountHeaderWithBack = memo(({ ...props }: AccountHeaderWithBackProps) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => navigate(-1), [navigate]);
  return (
    <HeaderContainer {...props}>
      <Inline inset="1rem 2rem">
        <BackLink alignItems="center" gap="0.5rem" onClick={handleClick}>
          <Icon name="arrowLeft" strokeWidth={2} width="1.25rem" height="1.25rem" />
          <H5 fontWeight="medium">Back</H5>
        </BackLink>
      </Inline>
    </HeaderContainer>
  );
});
