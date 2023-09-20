import { contractsConfig } from '../config/contractsConfig';
import { useEOAProvider } from '../contexts';

export const useContractsMap = () => {
  const { chainId } = useEOAProvider();
  return contractsConfig.contracts[chainId];
};
