import { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Text, Icon } from '@parallel-mono/components';
import cx from 'classnames';
import { ERC721Symbol } from 'paraspace-configs-v2';

import { ImageThumbnail, ImageThumbnailProps } from '../ImageThumbnail';
import { useEOAProvider } from '../../contexts';

import { getLargeERC721Image } from '@/apps/parax/utils';
import { useERC721ImagesThroughContract } from '@/apps/parax/hooks';
import { contractsConfig } from '@/apps/parax/config';

export const NFT_THUMBNAIL_SIZE_MAPPING = {
  xLarge: {
    width: '10.875rem',
    borderRadius: '1rem'
  },
  large: {
    width: '7.5rem',
    borderRadius: '0.625rem'
  },
  medium: {
    width: '5rem',
    borderRadius: '0.5rem'
  },
  small: {
    width: '2.5rem',
    borderRadius: '0.25rem'
  },
  xSmall: {
    width: '1.5rem',
    borderRadius: '0.25rem'
  }
};

export type ThumbnailSize = keyof typeof NFT_THUMBNAIL_SIZE_MAPPING;
export interface NFTThumbnailProps extends Omit<ImageThumbnailProps, 'src' | 'placeholder'> {
  symbol: ERC721Symbol;
  tokenId: number;
  showDescription?: boolean;
  round?: boolean;
  size?: ThumbnailSize;
  twitterPreview?: boolean;
  disabled?: boolean;
}

const TokenId = styled(Text)`
  text-align: center;
  line-height: 1rem;
`;

const SizedImageThumbnail = styled(ImageThumbnail)<{
  size: ThumbnailSize;
  round: boolean;
  width?: string | number;
  disabled?: boolean;
}>`
  ${({ size }) => NFT_THUMBNAIL_SIZE_MAPPING[size]};
  ${({ width }) => (width ? { width } : {})};
  .imageThumbnail {
    opacity: ${({ theme, disabled }) => (disabled ? theme.skin.action.disabledOpacity : 1)};
    border-radius: ${({ size, round }) =>
      round ? '50%' : NFT_THUMBNAIL_SIZE_MAPPING[size].borderRadius};
  }
`;

export const NFTThumbnail = ({
  symbol,
  tokenId,
  showDescription = false,
  description,
  round = false,
  size = 'large',
  disabled = false,
  ...others
}: NFTThumbnailProps) => {
  const getERC721ImagesThroughContract = useERC721ImagesThroughContract();
  const { chainId } = useEOAProvider();
  const contracts = contractsConfig.contracts[chainId];

  const theme = useTheme();

  const [imgSrc, setImgSrc] = useState<string>();

  useEffect(() => {
    if (symbol === ERC721Symbol.SF_VLDR || symbol === ERC721Symbol.UNISWAP_LP) {
      getERC721ImagesThroughContract({ address: contracts[symbol], tokenId }).then(data => {
        setImgSrc(data?.image);
      });
      return;
    }

    const img = getLargeERC721Image(symbol, String(tokenId));
    setImgSrc(img);
  }, [contracts, getERC721ImagesThroughContract, symbol, tokenId]);

  const descriptionSection = description ?? <TokenId>#{tokenId}</TokenId>;

  return (
    <SizedImageThumbnail
      size={size}
      round={round}
      classNames={{ imageThumbnail: cx('imageThumbnail') }}
      src={imgSrc}
      disabled={disabled}
      placeholder={<Icon name="image" size="100%" color={theme.skin.grey[500]} />}
      description={showDescription && descriptionSection}
      {...others}
    />
  );
};
