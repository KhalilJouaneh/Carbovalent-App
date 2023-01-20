import React from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { useState } from "react";
import useSWR from "swr";
import { OpenNavbar } from "../components/OpenNavbar";
import { Footer } from "../components/Footer";
import { ListAll } from "../utils/ListAll";
import {ListNfts} from "../components/ListNfts";


const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);
function fractionalize() {
  const [address, setAddress] = useState(
    "4cA9rbDqBVCSQstMTpkeTfLM8aa6wwZ7qpxruBBRQ6Gz"
  );

  const [nft, setNft] = useState(null);
  const [uri, setUri] = useState("");

  const fetchNft = async () => {
    const asset = await metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(address) });

    setNft(asset);
    setUri(asset.uri);
  };

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      setCurrentView(null);
      const list = await mx
        .nfts()
        .findAllByOwner({ owner: new PublicKey(address) });
      setNftList(list);
      setCurrentPage(1);
    } catch (e) {
      console.error(e);
    }
  };

  const fetcher = async () => {
    const res = await fetch(`${uri}`);
    const data = await res.json();
    // return JSON.stringify(data);
    return data;
  };

  const { data, error, isLoading } = useSWR(`${uri}`, fetcher);

  // console.log(Object.keys(data))
  console.log(data);

  return (
    <div>
      <OpenNavbar />
      {/* <ListAll /> */}
      <ListNfts />
      <Footer />
    </div>
  );
}

export default fractionalize;
