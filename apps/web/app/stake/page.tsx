'use client';

import StakeForm from '../../components/StakeForm';
import ConnectWallet from '../../components/ConnectWallet';

export default function StakePage() {
  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <ConnectWallet />
      <StakeForm />
    </main>
  );
}
