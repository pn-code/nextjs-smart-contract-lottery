"use client";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function Navbar() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3 } =
    useMoralis();

  // Check for connection and allow reconnect if user recently connected
  useEffect(() => {
    if (isWeb3Enabled) return;

    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  // Do not allow user to be reprompted by wallet if they choose to disconnect.
  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      // If the account is null, user disconnected. Deactivate to not reprompt user.
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("User has disconnected their wallet.")
      }
    });
  }, []);

  const handleConnectWallet = async () => {
    await enableWeb3();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("connected", "injected");
    }
  };

  return (
    <nav className="w-full flex justify-between items-center p-2 bg-gray-900 text-white">
      <h1 className="text-xl">Decentralized Lottery</h1>

      {account ? (
        <div>
          Connected to {account.slice(0, 4)}...{account.slice(38)}
        </div>
      ) : (
        <button onClick={handleConnectWallet}>Connect</button>
      )}
    </nav>
  );
}
