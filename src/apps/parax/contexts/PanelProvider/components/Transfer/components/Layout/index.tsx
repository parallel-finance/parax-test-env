import { CryptoIcon, SelectableTokenInput } from '@parallel-mono/business-components';
import {
  Stack,
  H2,
  Inline,
  H4,
  H5,
  Icon,
  Text,
  Spinner,
  H3,
  Responsive,
  useBreakpoints
} from '@parallel-mono/components';
import styled from 'styled-components';
import { ERC721Symbol } from 'paraspace-configs-v2';
import { FC, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { floor, zipObject } from 'lodash';

import { BorderedCard } from '../StyledCard';
import { ActionInput } from '../ActionInput';
import { ActionButton } from '../ActionButton';
import { CollapsibleTokensSelector } from '../../../../../../components';
import { formatBalance } from '../../../../../../utils';
import { ERC20BalanceInfo, UserBalanceInfos } from '../../../../..';

import { Header } from './Header';

import { MAXIMUM_BALANCE_DECIMALS } from '@/apps/parax/utils';
import { ERC20Symbol } from '@/apps/parax/typings';
import { Maybe } from '@/apps/parax/typings/basic';
import { MAX_RESERVED_GAS_FEE, zero } from '@/apps/parax/consts';
import { useContractsMap } from '@/apps/parax/hooks';

export const StyledSelectableTokenInput = styled(SelectableTokenInput)`
  border: none;
  width: 100%;
  padding: 16px;
  background: inherit;
`;

const MainContainer = styled(Stack)`
  min-height: calc(100% - 60px);
  border-radius: 16px;
`;

const MainScroll = styled(Stack)`
  max-width: 902px;
  width: 100%;
  padding: 1rem 2rem;
  margin: 0 auto 60px;
  ${({ theme }) => ({ background: theme.skin.background.main })}
`;

const StyledIcon = styled(Stack)`
  border-radius: 24px;
  padding: 8px;
  box-sizing: border-box;
  ${({ theme }) => ({ border: `2px solid ${theme.skin.grey[200]}` })};
`;

const RelativeCard = styled(BorderedCard)`
  position: relative;
`;

const StickyHeader = styled(Header)`
  position: sticky;
  top: 0;
`;

const StyledCollapsibleTokensSelector = styled(CollapsibleTokensSelector)``;

export type ERC20TokenAssets = { address: string; value: BigNumber; symbol: ERC20Symbol }[];
export type ERC721TokenAssets = { symbol: ERC721Symbol; tokenId: number; address: string }[];

export type TransferAssets = {
  ERC20Tokens: ERC20TokenAssets;
  ERC721Tokens: ERC721TokenAssets;
};

export enum ContentType {
  Transfer = 'Transfer',
  Deposit = 'Deposit'
}

export const HeadingMapping = {
  [ContentType.Transfer]: 'Transfer',
  [ContentType.Deposit]: 'Add Assets'
};

export const BaseLayout: FC<{
  type: `${ContentType}`;
  fromAccount: ReactElement;
  toAccount: ReactElement;
  balances: UserBalanceInfos & { loading: boolean };
  actionButtonText: ReactNode;
  actionButtonDisabled: boolean;
  onHandleAction: (params: TransferAssets) => void;
  onBack: () => void;
}> = props => {
  const {
    type,
    fromAccount,
    toAccount,
    balances,
    actionButtonText,
    actionButtonDisabled,
    onBack,
    onHandleAction
  } = props;

  const { desktop } = useBreakpoints();

  const contracts = useContractsMap();

  const [ERC20Tokens, setSelectedERC20Tokens] = useState<ERC20TokenAssets>([]);

  const [ERC721Tokens, setSelectedERC721Tokens] = useState<ERC721TokenAssets>([]);

  useEffect(() => {
    if (!balances.loading) {
      const selectedERC20sToBe = balances.ERC20Balances.filter(it => it.balance.gt(0))
        .map(it => ({
          address: contracts[it.symbol] ?? '',
          symbol: it.symbol,
          value: it.balance
        }))
        .filter(it => it.value.gt(0));
      setSelectedERC20Tokens(curr => {
        const currAmountMap = zipObject(
          curr.map(it => it.symbol),
          curr.map(it => it.value)
        );
        return selectedERC20sToBe.map(it => {
          if (it.symbol in currAmountMap && it.value !== currAmountMap[it.symbol]) {
            return { ...it, value: zero };
          }
          return it;
        });
      });
    }
  }, [balances.loading, contracts, balances.ERC20Balances]);

  useEffect(() => {
    if (!balances.loading) {
      setSelectedERC721Tokens(curr =>
        curr.filter(it =>
          balances.ERC721Balances.find(
            collection => collection.symbol === it.symbol
          )?.tokenIds?.includes(it.tokenId)
        )
      );
    }
  }, [balances.loading, balances.ERC721Balances]);

  const ERC20Balances = useMemo(() => {
    return balances.ERC20Balances.filter(i => i.balance.gt(0));
  }, [balances.ERC20Balances]);

  const ERC721Balances = useMemo(() => {
    return balances.ERC721Balances.filter(i => i.tokenIds.length > 0);
  }, [balances.ERC721Balances]);

  const hasAssets = useMemo(
    () => [...ERC20Balances, ...ERC721Balances].length > 0,
    [ERC20Balances, ERC721Balances]
  );

  const handleInputChange = useCallback(
    (tokenInfo: ERC20BalanceInfo) => (value: Maybe<BigNumber>) => {
      if (value?.gt(tokenInfo.balance)) {
        return;
      }
      setSelectedERC20Tokens(prev => {
        if (value === null) return prev.filter(i => i.address !== tokenInfo.address);

        return prev
          .filter(i => i.address !== tokenInfo.address)
          .concat({
            address: tokenInfo.address,
            symbol: tokenInfo.symbol,
            value
          });
      });
    },
    []
  );

  return (
    <MainContainer>
      <StickyHeader onBack={onBack} />
      <MainScroll gap="32px">
        <H2>{HeadingMapping[type]}</H2>
        <Responsive gap="24px">
          <Stack gap="16px" justifyContent="space-between" style={{ flex: 1, width: '100%' }}>
            {fromAccount}
          </Stack>
          {desktop && (
            <Stack gap="16px" style={{ flex: `0 0 auto` }} justifyContent="space-around">
              <H5 />
              <StyledIcon gap="10px">
                <Icon name="arrowRight" size="16px" />
              </StyledIcon>
            </Stack>
          )}
          <Stack gap="16px" justifyContent="space-between" style={{ flex: 1, width: '100%' }}>
            {toAccount}
          </Stack>
        </Responsive>
        <Stack gap="16px">
          {!hasAssets && !balances.loading && (
            <Stack alignItems="center">
              <H3>No Assets</H3>
              <Icon name="boxOpen" size="80px" />
            </Stack>
          )}
          {balances.loading && (
            <Stack alignItems="center">
              <Spinner />
            </Stack>
          )}
          {!balances.loading && hasAssets && (
            <>
              <H4>Assets</H4>
              {ERC20Balances.filter(i => i.balance.gt(0)).map(config => {
                const shouldKeepGasFee = type === ContentType.Deposit && config.isNativeToken;
                const maxValue = shouldKeepGasFee
                  ? BigNumber.max(config.balance.minus(MAX_RESERVED_GAS_FEE), 0)
                  : config.balance;
                const erc20 = ERC20Tokens.find(t => t.symbol === config.symbol);
                return desktop ? (
                  <RelativeCard inset="16px" key={config.displayName}>
                    <Inline alignItems="center" gap="12px" inset="0">
                      <CryptoIcon symbol={config.symbol} size="40px" />
                      <Text
                        skin={config.displayName?.startsWith('Supplied') ? 'success' : 'primary'}
                      >
                        {config.displayName ?? config.symbol}
                      </Text>
                    </Inline>
                    <Inline
                      alignItems="center"
                      gap="8px"
                      style={{ position: 'absolute', left: '50%', top: 0, bottom: 0 }}
                    >
                      <ActionInput
                        max={maxValue}
                        value={erc20?.value?.toNumber() ?? null}
                        handleOnChange={handleInputChange(config)}
                      />
                      <Text skin="secondary">Out of {formatBalance(config.balance)}</Text>
                    </Inline>
                  </RelativeCard>
                ) : (
                  <BorderedCard style={{ overflow: 'hidden', padding: 0 }}>
                    <StyledSelectableTokenInput
                      value={{
                        token: {
                          name: config.symbol,
                          symbol: config.symbol,
                          balance: erc20?.value?.toNumber() ?? 0,
                          priceInUSD: config.priceInUSD.toNumber(),
                          displayBalance: formatBalance(config.balance)
                        },
                        amount: erc20?.value
                          ? floor(erc20.value.toNumber(), MAXIMUM_BALANCE_DECIMALS)
                          : null
                      }}
                      tokens={[
                        {
                          name: config.symbol,
                          symbol: config.symbol,
                          balance: erc20?.value?.toNumber() ?? 0,
                          priceInUSD: config.priceInUSD.toNumber(),
                          displayBalance: formatBalance(config.balance)
                        }
                      ]}
                      decimals={MAXIMUM_BALANCE_DECIMALS}
                      onChange={o =>
                        handleInputChange(config)(o.amount ? BigNumber(o.amount) : null)
                      }
                      onActionButtonClicked={() => handleInputChange(config)(maxValue)}
                      actionButtonText="Max"
                    />
                  </BorderedCard>
                );
              })}

              {ERC721Balances.filter(i => i.tokenIds.length > 0).map(config => (
                <StyledCollapsibleTokensSelector
                  key={config.symbol}
                  symbol={config.symbol}
                  headerHint={`Total ${
                    config.tokenIds.map(id => ({ symbol: config.symbol, tokenId: id })).length
                  }`}
                  tokens={config.tokenIds.map(id => ({
                    symbol: config.symbol,
                    tokenId: id,
                    address: config.address
                  }))}
                  selectedTokens={ERC721Tokens.filter(i => i.symbol === config.symbol)}
                  collectionName={config.collectionName}
                  onSelectionChange={selections => {
                    setSelectedERC721Tokens(prev =>
                      prev.filter(i => i.symbol !== config.symbol).concat(selections)
                    );
                  }}
                />
              ))}
              <ActionButton
                disabled={
                  [...ERC20Tokens.filter(i => i.value.isGreaterThan(0)), ...ERC721Tokens].length ===
                    0 || actionButtonDisabled
                }
                actionButtonText={actionButtonText}
                onAction={() => {
                  onHandleAction({ ERC20Tokens, ERC721Tokens });
                }}
              />
            </>
          )}
        </Stack>
      </MainScroll>
    </MainContainer>
  );
};
