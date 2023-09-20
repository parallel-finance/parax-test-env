import { EthereumTransactionTypeExtended } from 'paraspace-utilities-contract-helpers';
import { BigNumber, providers } from 'ethers';

const submitTransaction = async ({
  provider,
  tx
}: {
  provider: providers.JsonRpcProvider;
  tx: EthereumTransactionTypeExtended;
}) => {
  const extendedTxData = await tx.tx();
  const { from, ...txData } = extendedTxData;
  const signer = provider.getSigner(from);
  const txResponse = await signer.sendTransaction({
    ...txData,
    value: txData.value ? BigNumber.from(txData.value) : undefined
  });

  return txResponse;
};

export default submitTransaction;
