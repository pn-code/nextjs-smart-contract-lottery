"use client";
import { useMoralis } from "react-moralis";

export default function Navbar() {
  const { enableWeb3, account } = useMoralis();

  return (
    <nav className="w-full flex justify-between items-center p-2 bg-gray-900 text-white">
      <h1 className="text-xl">Decentralized Lottery</h1>

      {account ? (
        <div>
          Connected to {account.slice(0, 4)}...{account.slice(38)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
          }}
        >
          Connect
        </button>
      )}
    </nav>
  );
}
