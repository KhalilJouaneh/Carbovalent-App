import type { NextPage } from "next";
import dynamic from "next/dynamic";
import BridgeForm from "./bridge"; 
import {useWallet} from "@solana/wallet-adapter-react";
import {OpenNavbar} from './components/OpenNavbar'

// NFT collection address 
// 5qRjLdA3iqboq9AJn7Y3sdBXs2KHksa5WnrxvQXJJPw6

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);


const Home: NextPage = () => {
  // const {data: myNftCollectionProgram} = useProgram('nft_collection_address', 'nft-collection')
  // const sdk = useSDK();
  
  return (
    <>
    <OpenNavbar />
    </>  
    );
};

export default Home;
