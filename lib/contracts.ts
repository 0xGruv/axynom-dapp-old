import type { Abi } from 'viem';

import AxynomToken from './abi/AxynomToken.json';
import AxynomStaking from './abi/AxynomStaking.json';
import RewardsPool from './abi/RewardsPool.json';
import PoG from './abi/PoG.json';
import ContributionRegistry from './abi/ContributionRegistry.json';

export const CONTRACTS = {
  axynomToken: {
    address: '0x2AbDE7746d687DDB4255A58a5065f4A6CEA1B577',
    abi: AxynomToken as Abi,
  },
  staking: {
    address: '0x2f3fB518f7CAd0e490A156a3F0beb23Df4C17B8e',
    abi: AxynomStaking as Abi,
  },
  rewardsPool: {
    address: '0x5E13C7fC31E8B28572925f47d3173c4126a2fb7f',
    abi: RewardsPool as Abi,
  },
  pog: {
    address: '0x21F28279fa81F8ec7b6536e9eBDa9c2430ED5f61',
    abi: PoG as Abi,
  },
  registry: {
    address: '0xA22e015A1d6C253402bBCe61C3686bF813EFa81b',
    abi: ContributionRegistry as Abi,
  },
};