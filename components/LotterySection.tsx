import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";
import { Bell } from "@web3uikit/icons";

export default function LotterySection() {
    const [entranceFee, setEntranceFee] = useState("0");
    const [numberOfPlayers, setNumberOfPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex as string);
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const dispatch = useNotification();

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

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const updateUI = async () => {
        const entranceFeeFromContract = (await getEntranceFee()) as string;
        const numPlayersFromContract = (await getNumberOfPlayers()) as string;
        const recentWinnerFromContract = (await getRecentWinner()) as string;

        setEntranceFee(entranceFeeFromContract.toString());
        setNumberOfPlayers(numPlayersFromContract.toString());
        setRecentWinner(recentWinnerFromContract.toString());
    };

    const handleSuccess = async function (tx: any) {
        await tx.wait(1);
        handleNewNotification();
        updateUI();
    };

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: <Bell fontSize={20} />,
        });
    };

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            {raffleAddress ? (
                <div className="flex flex-col gap-4">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-lg font-semibold hover:bg-blue-700"
                        onClick={async () =>
                            enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                    >
                        Enter Raffle
                    </button>
                    <section>
                        Entrance Fee:{" "}
                        {ethers.utils.formatUnits(entranceFee, "ether")}
                        ETH
                    </section>
                    Number of Players: {numberOfPlayers}
                    Recent Winner: {recentWinner}
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    );
}
