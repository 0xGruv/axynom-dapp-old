'use client';

import { useConnect } from 'wagmi';

export default function ConnectWallet() {
  const { connect, connectors, isPending } = useConnect();

  const injectedConnector = connectors.find((c) => c.id === 'injected');

  if (!injectedConnector) return <div>No wallet found</div>;

  return (
    <button
      onClick={() => connect({ connector: injectedConnector })}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
