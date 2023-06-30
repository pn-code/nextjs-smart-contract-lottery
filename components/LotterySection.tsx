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
    const [timeTillNextUpkeep, setTimeTillNextUpkeep] = useState(0);
    const [raffleState, setRaffleState] = useState("0");

    const { chainId: chainIdHex, isWeb3Enabled, provider } = useMoralis();
    const chainId = parseInt(chainIdHex as string);
    const raffleAddress =
        chainId.toString() in contractAddresses
            ? contractAddresses[
                  chainId.toString() as keyof typeof contractAddresses
              ][0]
            : undefined;

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

    const { runContractFunction: getLastTimeStamp } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getLastTimeStamp",
        params: {},
    });

    const { runContractFunction: getRaffleState } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRaffleState",
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
        const lastTimestampFromContract = (await getLastTimeStamp()) as string;
        const raffleStateFromContract = (await getRaffleState()) as string;

        setEntranceFee(entranceFeeFromContract.toString());
        setNumberOfPlayers(numPlayersFromContract.toString());
        setRecentWinner(recentWinnerFromContract.toString());
        setTimeTillNextUpkeep(
            Number(lastTimestampFromContract.toString()) - getCurrentTimeUnix()
        );
        setRaffleState(raffleStateFromContract.toString());
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

    const getCurrentTimeUnix = () => {
        const currentDate = new Date();
        const currentTimeUnix = Math.floor(currentDate.getTime() / 1000);
        return currentTimeUnix;
    };

    return (
        <div className="w-full md:h-[calc(100vh-400px)] flex flex-col p-4 md:justify-center md:items-center md:my-20">
            {raffleAddress ? (
                <div className="flex flex-col gap-4">
                    <header>
                        <h2 className="text-lg font-semibold">Lottery</h2>
                        <span className="text-sm text-indigo-700 font-semibold">
                            Lottery Statistics
                        </span>
                    </header>

                    <section className="flex gap-2">
                        <h3 className="font-semibold">Jackpot</h3>
                        <span>{Number(numberOfPlayers) * 0.01}ETH</span>
                    </section>

                    <section className="flex gap-2">
                        <h3 className="font-semibold">Entrance Fee:</h3>
                        <span>
                            {ethers.utils.formatUnits(entranceFee, "ether")}
                            ETH
                        </span>
                    </section>

                    <section className="flex gap-2">
                        <h3 className="font-semibold">Number of Players:</h3>
                        <span>{numberOfPlayers}</span>
                    </section>

                    <section className="flex flex-col md:flex-row md:gap-2">
                        <h3 className="font-semibold">Recent Winner: </h3>
                        <span className="text-xs md:text-[16px] md:mt-1">
                            {recentWinner}
                        </span>
                    </section>

                    <section className="flex flex-col md:flex-row md:gap-2">
                        <h3 className="font-semibold">Time Left: </h3>
                        <span
                            className={
                                timeTillNextUpkeep > 0
                                    ? "text-red-600"
                                    : "text-green-600"
                            }
                        >
                            {timeTillNextUpkeep} seconds
                        </span>
                    </section>

                    <section className="flex flex-col md:flex-row md:gap-2">
                        <h3 className="font-semibold">Raffle State: </h3>
                        <span>{raffleState ? "OPEN" : "CALCULATING"}</span>
                    </section>

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
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    );
}
