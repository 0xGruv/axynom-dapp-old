'use client';

import { useState, useEffect } from 'react';
import { parseUnits } from 'viem';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';

const lockOptions = [
  { label: '6 Months – 5% APY', value: 0 },
  { label: '1 Year – 12% APY', value: 1 },
  { label: '2 Years – 30% APY', value: 2 },
];

export default function StakeForm() {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState<number>(lockOptions[0]?.value ?? 0);
  const [step, setStep] = useState<'idle' | 'approving' | 'staking'>('idle');
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>();

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const parsedAmount = amount ? parseUnits(amount.trim(), 18) : 0n;

  // ✅ Check allowance first
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.axynomToken.address as `0x${string}`,
    abi: CONTRACTS.axynomToken.abi,
    functionName: 'allowance',
    args: [address as `0x${string}`, CONTRACTS.staking.address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const { isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveTxHash,
    query: {
      enabled: !!approveTxHash,
    },
  });

  useEffect(() => {
    if (isApproved && step === 'approving') {
      stakeNow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved]);

  const handleStake = async () => {
    if (!isConnected || !amount.trim()) {
      alert('Please connect wallet and enter amount');
      return;
    }

    if (!address) return;

    const alreadyApproved = typeof allowance === 'bigint' && allowance >= parsedAmount;

    if (alreadyApproved) {
      console.log('✅ Already approved, skipping approval');
      await stakeNow();
    } else {
      try {
        setStep('approving');
        const tx = await writeContractAsync({
          address: CONTRACTS.axynomToken.address as `0x${string}`,
          abi: CONTRACTS.axynomToken.abi,
          functionName: 'approve',
          args: [CONTRACTS.staking.address as `0x${string}`, parsedAmount],
        });
        setApproveTxHash(tx);
        console.log('✅ approve() hash:', tx);
      } catch (err) {
        console.error('❌ approve() error:', err);
        alert('❌ Approval failed.');
        setStep('idle');
      }
    }
  };

  const stakeNow = async () => {
    try {
      setStep('staking');
      const tx = await writeContractAsync({
        address: CONTRACTS.staking.address as `0x${string}`,
        abi: CONTRACTS.staking.abi,
        functionName: 'stake',
        args: [parsedAmount, lockPeriod],
      });
      console.log('✅ stake() hash:', tx);
      alert('✅ Staked successfully!');
      setAmount('');
      setApproveTxHash(undefined);
      await refetchAllowance();
    } catch (err) {
      console.error('❌ stake() error:', err);
      alert('❌ Staking failed. Check console.');
    } finally {
      setStep('idle');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="number"
        placeholder="Amount to stake"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select
        value={lockPeriod}
        onChange={(e) => setLockPeriod(Number(e.target.value))}
        className="w-full p-2 border rounded"
      >
        {lockOptions.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleStake}
        disabled={step !== 'idle'}
        className="bg-purple-700 text-white px-4 py-2 rounded w-full"
      >
        {step === 'approving'
          ? 'Approving...'
          : step === 'staking'
          ? 'Staking...'
          : 'Approve & Stake'}
      </button>
    </div>
  );
}