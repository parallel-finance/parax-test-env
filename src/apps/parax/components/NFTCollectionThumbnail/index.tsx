import { CryptoIcon, CryptoIconProps } from '@parallel-mono/business-components';
import styled from 'styled-components';
import { ERC721Symbol } from 'paraspace-configs-v2';

import { NFT_THUMBNAIL_SIZE_MAPPING } from '../NFTThumbnail';
import { getEnumKeyByValue } from '../../utils/getEnumKeyByValue';

type ThumbnailSize = keyof typeof NFT_THUMBNAIL_SIZE_MAPPING;
export interface NFTCollectionThumbnailProps extends Omit<CryptoIconProps, 'size' | 'symbol'> {
  symbol: ERC721Symbol;
  size?: ThumbnailSize;
  round?: boolean;
}

export const Thumbnail = styled(CryptoIcon)<{
  $size: ThumbnailSize;
  round?: boolean;
}>`
  width: ${({ $size, width }) => width ?? NFT_THUMBNAIL_SIZE_MAPPING[$size].width};
  height: auto;
  border-radius: ${({ $size, round }) =>
    round ? '50%' : NFT_THUMBNAIL_SIZE_MAPPING[$size].borderRadius};
`;

const getIconName = (symbol: ERC721Symbol) => {
  // TODO remove WPUNKS/PUNK handle after change symbol config
  if (ERC721Symbol.WPUNKS === symbol) return symbol;

  if (ERC721Symbol.PUNK === symbol) return 'CRYPTOPUNKS';

  return getEnumKeyByValue(ERC721Symbol, symbol);
};

export const NFTCollectionThumbnail = ({
  symbol,
  size = 'large',
  round = false,
  ...others
}: NFTCollectionThumbnailProps) => {
  const iconName = getIconName(symbol);
  return <Thumbnail symbol={iconName} $size={size} round={round} {...others} />;
};
