import { Inline, useBreakpoints } from '@parallel-mono/components';
import { NavLink } from 'react-router-dom';
import { HostedImage } from '@parallel-mono/business-components';
import styled from 'styled-components';

HostedImage.displayName = 'HostedImage';
(window as any).HostedImage = HostedImage;

export const LogoIcon = styled(HostedImage).attrs({
  name: `design/PDS_V3/logo/paraX`
})`
  display: block;
  height: 1.5rem;
`;

const IconContainer = styled(Inline)`
  ${({ theme }) => theme.breakpoints.down('desktop')`
    flex-wrap: wrap;
  `};
`;

export const Logo = () => {
  const { desktop: isDesktop } = useBreakpoints();

  return (
    <IconContainer gap={isDesktop ? '1rem' : '.5rem'} alignItems="center">
      <NavLink to="/">
        <LogoIcon />
      </NavLink>
    </IconContainer>
  );
};
