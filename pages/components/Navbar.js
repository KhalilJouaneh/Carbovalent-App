"use client"
import dynamic from "next/dynamic";

export function Navbar() {

    require("@solana/wallet-adapter-react-ui/styles.css");

    const WalletMultiButtonDynamic = dynamic(
      async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
      { ssr: false }
    );

    return (
        <>
            <div className="navbar w-screen">
                <div className="navbar-start">
                    <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-75 rounded-box w-52">
                        <li><a href="/">Launchpad</a></li>
                        <li><a>Bridge</a></li>
                        <li><a>Registry</a></li>
                        <li><a>Fractionalize </a></li>
                        <li><a>FAQ </a></li>
                    </ul>
                    </div>
                    <a href="/" className="btn btn-ghost normal-case text-xl">Carbovalent</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><a href="/">Launchpad</a></li>
                        <li><a href="/bridge">Bridge</a></li>
                        <li><a href="/registry">Registry</a></li>
                        <li><a>Fractionalize </a></li>
                        <li><a>FAQ </a></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <WalletMultiButtonDynamic />
                </div>
                </div>
        </>
    )
}