import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function LotterySection() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const [entranceFee, setEntranceFee] = useState("0");

    const chainId = parseInt(chainIdHex as string);
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    useEffect(() => {
        async function updateUI() {
            const fee = (await getEntranceFee()) as string;
            setEntranceFee(fee.toString());
        }

        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            {raffleAddress ? (
                <div className="flex flex-col gap-4">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-lg font-semibold hover:bg-blue-700"
                        onClick={async () => enterRaffle()}
                    >
                        Enter Raffle
                    </button>
                    <section>
                        Entrance Fee:{" "}
                        {ethers.utils.formatUnits(entranceFee, "ether")}
                        ETH
                    </section>
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    );
}
