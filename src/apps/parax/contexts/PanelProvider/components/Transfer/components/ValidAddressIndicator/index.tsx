import { Icon, Inline, Text } from '@parallel-mono/components';
import { ethers } from 'ethers';
import { FC, memo, useMemo } from 'react';
import { useTheme } from 'styled-components';

import { truncateTextMid } from '@/apps/parax/utils';

export const ValidAddressIndicator: FC<{ address: string }> = memo(props => {
  const { address } = props;
  const isValidAddress = useMemo(() => ethers.utils.isAddress(address), [address]);
  const theme = useTheme();

  return (
    <Inline>
      {isValidAddress && (
        <Inline gap="8px">
          <Text>({truncateTextMid(address, 6, 4)})</Text>
          <Icon name="checkContained" color={theme.skin.success.main} />
        </Inline>
      )}
      {!isValidAddress && (
        <Inline gap="8px">
          <Text>Invalid Address</Text>
          <Icon name="closeContained" color={theme.skin.error.main} />
        </Inline>
      )}
    </Inline>
  );
});
