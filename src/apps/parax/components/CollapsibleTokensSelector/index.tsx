import { memo, useMemo, MouseEvent, useCallback, ReactNode, useState } from 'react';
import { differenceBy, isEmpty, noop } from 'lodash';
import styled from 'styled-components';
import {
  Button,
  Card,
  Icon,
  Inline,
  SmallText,
  Stack,
  Text,
  useBreakpoints,
  Collapse,
  Pagination
} from '@parallel-mono/components';
import { ERC721Symbol } from 'paraspace-configs-v2';

import { NFTThumbnailCheck } from '../NFTThumbnailCheck';
import { NFTCollectionThumbnail } from '../NFTCollectionThumbnail';
import { Maybe } from '../../typings/basic';

import { SelectTopItemsInput } from './SelectTopItemsInput';

import { usePagination } from '@/apps/parax/hooks';

type CollapsibleTokensSelectorProps<T> = {
  symbol: ERC721Symbol;
  headerHint: ReactNode;
  collectionName: string;
  tokens: T[];
  selectedTokens: T[];
  onSelectionChange: (selection: T[]) => void;
};

const TokensContainer = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1rem;
  ${({ theme }) => theme.breakpoints.down('desktop')`
    grid-template-columns: repeat(2, 2fr);
  `};
`;

const DEFAULT_PAGE_SIZE = 10;
const MOBILE_PAGE_SIZE = 4;

const stopPropagation = (e: MouseEvent) => e.stopPropagation();

const Header = styled(Inline)`
  cursor: pointer;
`;

const FullWidthH5 = styled(Inline)`
  ${({ theme }) => theme.typography.header5};
  width: 100%;
`;

export const CollapsibleTokensSelector = memo(
  ({
    symbol,
    headerHint,
    tokens,
    collectionName,
    selectedTokens,
    onSelectionChange,
    ...others
  }: CollapsibleTokensSelectorProps<{
    tokenId: number;
    symbol: ERC721Symbol;
    address: string;
  }>) => {
    const [finalOpen, setInternalOpen] = useState(false);

    const handleToggleOpen = useCallback(() => {
      setInternalOpen(prev => !prev);
    }, [setInternalOpen]);

    const selectedTokenIds = useMemo(() => selectedTokens.map(it => it.tokenId), [selectedTokens]);

    const handleSelectAll = useCallback(() => {
      if (!finalOpen) {
        handleToggleOpen();
      }
      onSelectionChange(tokens);
    }, [finalOpen, onSelectionChange, tokens, handleToggleOpen]);

    const handleUnselectAll = useCallback(() => {
      onSelectionChange([]);
    }, [onSelectionChange]);

    const handleSelectTopItems = useCallback(
      (count: Maybe<number>) => {
        if (!finalOpen) {
          handleToggleOpen();
        }
        onSelectionChange(tokens.slice(0, count ?? 0));
      },
      [onSelectionChange, tokens, finalOpen, handleToggleOpen]
    );

    const allSelected = useMemo(
      () => !isEmpty(tokens) && differenceBy(tokens, selectedTokens, it => it.tokenId).length === 0,
      [tokens, selectedTokens]
    );

    const selectButtonText = useMemo(
      () => (allSelected ? 'Unselect All' : 'Select All'),
      [allSelected]
    );

    const selectButtonAction = useMemo(
      () => (allSelected ? handleUnselectAll : handleSelectAll),
      [allSelected, handleSelectAll, handleUnselectAll]
    );

    const handleButtonClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        stopPropagation(e);
        selectButtonAction?.();
      },
      [selectButtonAction]
    );

    const handleToggleItem = useCallback(
      token => {
        onSelectionChange(
          selectedTokenIds.includes(token.tokenId)
            ? selectedTokens.filter(it => it.tokenId !== token.tokenId)
            : selectedTokens.concat(token)
        );
      },
      [onSelectionChange, selectedTokens, selectedTokenIds]
    );

    const { mobile } = useBreakpoints();
    const { currentPage, setCurrentPage, pageData, totalPage } = usePagination(
      tokens,
      mobile ? MOBILE_PAGE_SIZE : DEFAULT_PAGE_SIZE
    );

    const mobileButton = useMemo(() => {
      return mobile && tokens.length > 0 ? (
        <Button block onClick={selectButtonAction} skin="secondary">
          {selectButtonText}
        </Button>
      ) : null;
    }, [mobile, selectButtonAction, tokens.length, selectButtonText]);

    return (
      <Card border {...others}>
        <Stack gap="1rem">
          <Header justifyContent="space-between" alignItems="center" onClick={handleToggleOpen}>
            <FullWidthH5 forwardedAs="div">
              <Inline width="100%" justifyContent="space-between" {...others}>
                <Inline onClick={mobile ? noop : stopPropagation} gap="0.5rem">
                  <NFTCollectionThumbnail symbol={symbol} size="small" />
                  <Stack gap="0">
                    {/* TODO remove the condition 'collectionName.startsWith('Supplied')' */}
                    <Text skin={collectionName.startsWith('Supplied') ? 'success' : 'primary'}>
                      {collectionName}
                    </Text>
                    <SmallText skin="secondary">{headerHint}</SmallText>
                  </Stack>
                </Inline>

                {!mobile && (
                  <Inline gap="0.5rem">
                    {tokens.length > 10 && (
                      <SelectTopItemsInput
                        itemsCount={tokens.length}
                        onSelect={handleSelectTopItems}
                        onClick={mobile ? noop : stopPropagation}
                      />
                    )}
                    <Button onClick={handleButtonClick} skin="secondary">
                      {selectButtonText}
                    </Button>
                  </Inline>
                )}
              </Inline>
            </FullWidthH5>
            <Icon name={finalOpen ? 'minusCircle' : 'downContained'} />
          </Header>
        </Stack>
        <Collapse open={finalOpen}>
          {mobileButton && (
            <Stack gap="0.5rem" style={{ marginTop: '16px' }}>
              {tokens.length > 4 && (
                <SelectTopItemsInput
                  itemsCount={tokens.length}
                  onSelect={handleSelectTopItems}
                  onClick={mobile ? noop : stopPropagation}
                />
              )}
              {mobileButton}
            </Stack>
          )}
          <TokensContainer>
            {pageData.map(token => {
              const { tokenId } = token;
              return (
                <NFTThumbnailCheck
                  key={tokenId}
                  symbol={symbol}
                  tokenId={tokenId}
                  checked={selectedTokenIds.includes(tokenId)}
                  onChange={() => {
                    handleToggleItem(token);
                  }}
                >
                  <Stack alignItems="center" gap="0.5rem">
                    <Text>#{tokenId}</Text>
                  </Stack>
                </NFTThumbnailCheck>
              );
            })}
          </TokensContainer>
          <Inline justifyContent="center" inset="1rem">
            {totalPage > 1 && (
              <Pagination
                total={totalPage}
                page={currentPage}
                onChange={setCurrentPage}
                siblingCount={0}
                startBoundaryCount={3}
              />
            )}
          </Inline>
        </Collapse>
      </Card>
    );
  }
);
