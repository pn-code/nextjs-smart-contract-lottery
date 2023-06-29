import React from "react";

export default function AboutSection() {
    return (
        <section className="w-full p-4 bg-zinc-800 text-white flex flex-col gap-2 md:justify-center md:items-center">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="text-medium">
                This is a decentralized lottery which allows users to
                participate in an online raffle. Built on the blockchain, this
                raffle ensures that users have a fully decentralized and secure
                experience.
            </p>
        </section>
    );
}
