import type { NextPage } from "next";
import dynamic from "next/dynamic";
import BridgeForm from "./bridge"; 
import {useWallet} from "@solana/wallet-adapter-react";
import {OpenNavbar} from '../components/OpenNavbar'

// NFT collection address 
// 5qRjLdA3iqboq9AJn7Y3sdBXs2KHksa5WnrxvQXJJPw6


const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);


const Home: NextPage = () => {
  
  return (
    <>
    <OpenNavbar />
    </>  
    );
};

export default Home;
