import { memo, useCallback, useMemo, useState } from 'react';
import { chunk, groupBy, map } from 'lodash';
import { ERC721Symbol } from 'paraspace-configs-v2';

import { TransferAssets } from '../components';

import {
  ERC20TokensDepositSubmitter,
  ERC721TokenDepositSubmitter,
  ERC721TokensBatchDepositWithAASubmitter
} from './submitters';
import { DEPOSIT_CHUNK_SIZE } from './consts';

import { formatBalance } from '@/apps/parax/utils';
import { ApproveERC721Submitter, Stepper } from '@/apps/parax/components';
import { useEOAProvider } from '@/apps/parax/contexts/EOAProvider';
import { contractsConfig } from '@/apps/parax/config';

export const DepositSteppers = memo(
  ({
    formData,
    onError,
    onFinish
  }: {
    formData: { assets: TransferAssets; paraAccount: string };
    onError: () => void;
    onFinish: () => void;
  }) => {
    const {
      assets: { ERC20Tokens, ERC721Tokens },
      paraAccount
    } = formData;
    const [step, setStep] = useState(0);

    const handleNext = useCallback(() => {
      setStep(curr => curr + 1);
    }, []);

    const { chainId } = useEOAProvider();
    const ERC721Config = contractsConfig.nft[chainId]?.collection;

    const depositERC20Steps = useMemo(() => {
      return ERC20Tokens.map(erc20Token => ({
        description: `Deposit ${formatBalance(erc20Token.value)} ${erc20Token.symbol}`,
        // eslint-disable-next-line
        getContent: (index: number, isLastStep: boolean) => (
          <ERC20TokensDepositSubmitter
            key={`step-${index}`}
            formData={{ assets: [erc20Token], paraAccount }}
            onError={onError}
            onFinish={isLastStep ? onFinish : handleNext}
          />
        )
      }));
    }, [ERC20Tokens, onError, onFinish, handleNext, paraAccount]);

    const approveERC721Steps = useMemo(() => {
      const normalERC721Tokens = ERC721Tokens.filter(it => it.symbol !== ERC721Symbol.PUNK);
      if (normalERC721Tokens.length < 2) {
        return [];
      }
      const collections = groupBy(normalERC721Tokens, it => it.address);
      return map(collections, (items, address) => {
        return {
          description: `Approve ${
            ERC721Config?.[items[0].symbol].collectionName ?? items[0].symbol
          }`,
          // eslint-disable-next-line
          getContent: (index: number, isLastStep: boolean) => (
            <ApproveERC721Submitter
              key={`step-${index}`}
              formData={{
                name: items[0].symbol,
                assetAddress: address,
                spender: paraAccount
              }}
              onError={onError}
              onFinish={isLastStep ? onFinish : handleNext}
            />
          )
        };
      });
    }, [ERC721Tokens, onError, onFinish, handleNext, paraAccount, ERC721Config]);

    const depositERC721Steps = useMemo(() => {
      if (ERC721Tokens.length === 1) {
        return {
          description: `Deposit ${
            ERC721Config?.[ERC721Tokens[0].symbol].collectionName ?? ERC721Tokens[0].symbol
          } #${ERC721Tokens[0].tokenId}`,
          // eslint-disable-next-line
          getContent: (index: number, isLastStep: boolean) => (
            <ERC721TokenDepositSubmitter
              key={`step-${index}`}
              formData={{
                asset: ERC721Tokens[0],
                paraAccount
              }}
              onError={onError}
              onFinish={isLastStep ? onFinish : handleNext}
            />
          )
        };
      }
      const punks = ERC721Tokens.filter(it => it.symbol === ERC721Symbol.PUNK);
      const punksSteps = punks.map(punk => ({
        description: `Deposit Punk #${punk.tokenId}`,
        // eslint-disable-next-line
        getContent: (index: number, isLastStep: boolean) => (
          <ERC721TokenDepositSubmitter
            key={`step-${index}`}
            formData={{
              asset: punk,
              paraAccount
            }}
            onError={onError}
            onFinish={isLastStep ? onFinish : handleNext}
          />
        )
      }));

      const normalERC721s = ERC721Tokens.filter(it => it.symbol !== ERC721Symbol.PUNK);
      const normalERC721Chunks = chunk(normalERC721s, DEPOSIT_CHUNK_SIZE);
      const normalERC721Steps = normalERC721Chunks.map(erc721Chunk => ({
        description: `Deposit ${erc721Chunk.length} NFTs`,
        // eslint-disable-next-line
        getContent: (index: number, isLastStep: boolean) => (
          <ERC721TokensBatchDepositWithAASubmitter
            key={`step-${index}`}
            formData={{
              assets: erc721Chunk,
              paraAccount
            }}
            onError={onError}
            onFinish={isLastStep ? onFinish : handleNext}
          />
        )
      }));
      return normalERC721Steps.concat(punksSteps);
    }, [ERC721Tokens, paraAccount, onFinish, onError, handleNext, ERC721Config]);

    const steps = useMemo(() => {
      const stepSeeds = depositERC20Steps.concat(approveERC721Steps).concat(depositERC721Steps);
      return stepSeeds.map((stepSeed, index) => ({
        description: stepSeed.description,
        content: stepSeed.getContent(index, index === stepSeeds.length - 1)
      }));
    }, [depositERC20Steps, approveERC721Steps, depositERC721Steps]);

    return <Stepper steps={steps} step={step} />;
  }
);
