"use client";
import { ConnectButton } from "@web3uikit/web3";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-2 bg-gray-900 text-white">
      <h1 className="text-xl font-semibold">Ethraffle</h1>
      <ConnectButton moralisAuth={false} />
    </nav>
  );
}
