import React from "react";
import { Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="p-2 fixed left-0 bottom-0 w-full bg-gray-900 text-white text-center">
            <ul className="flex justify-between items-center w-full h-10">
                <li>Developed by Philip Nguyen</li>
                <li>
                    <a href="https://github.com/pn-code">
                        <Github className="w-full h-full hover:bg-orange-600/95 duration-200 ease-linear p-2 rounded-full" />
                    </a>
                </li>
            </ul>
        </footer>
    );
}
