import { ethers } from 'ethers';

export const convertToChecksumAddress = (address: string) => {
  try {
    if (!address) {
      return '';
    }
    return ethers.utils.getAddress(address?.toLowerCase());
  } catch (e: unknown) {
    return address;
  }
};
