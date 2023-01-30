import { useState, useEffect } from "react";
import axios from "axios";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";
import { Loading } from "../components/Loading";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  Metaplex,
  walletAdapterIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";

export const ListRetire = () => {
  const xKey = "7DmQi-SJmO16yq6u";
  const [network, setNetwork] = useState("devnet");
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState();
  const wallet = useWallet(); //solana wallet object
  const connection = new Connection(clusterApiUrl("devnet"));
  const mx = Metaplex.make(connection);

  mx.use(walletAdapterIdentity(wallet)).use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    })
  );

  const [nftSelected, setNftSelected] = useState([]);
  const [nftAddr, setNftAddr] = useState("");

  const [nfts, setNfts] = useState();
  const [acess, setAccess] = useState();
  const [tokenAddress, setTokenAddress] = useState(
    "HjnYw4sRWvarScZmyvs2z3XFoQhkFaQyvqihSSmSCEnd"
  );

  useEffect(() => {
    setLoading(true);
    let nftUrl = `https://api.shyft.to/sol/v1/nft/read_all?network=${network}&address=${wallet.publicKey}&refresh=refresh`;
    //add the wallet address which you want to check as an authentication parameter
    //access will be granted if and only if an NFT with this update authority is present in your wallet

    axios({
      // Endpoint to get NFTs
      url: nftUrl,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
    })
      // Handle the response from backend here
      .then((res) => {
        console.log(res.data);
        setLoading(false);

        if (res.data.success === true) {
          setNfts(res.data.result);
          console.log(nfts);

          let flag = 0;
          nfts?.forEach((element) => {
            if (element.update_authority === wallet.publicKey.toString()) {
              flag = 1;
            }
          });
          if (flag === 1) {
            setAccess(true);
          } else {
            setAccess(false);
            setMsg("You do not have access");
          }
        }
      })
      // Catch errors if any
      .catch((err) => {
        console.warn(err);
        setLoading(false);
      });
  }, [wallet.publicKey, network]);

  const burnNFT = (e) => {
    e.preventDefault();

    //Note, we are not mentioning update_authority here for now
    let nftUrl = `https://api.shyft.to/sol/v1/nft/burn_detach?network=${network}&address=${wallet.publicKey}&refresh=refresh`;
    axios({
      // Endpoint to send files
      url: nftUrl,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      // Attaching the form data
    })
      // Handle the response from backend here
      .then((res) => {
        console.log(res.data);
        setDataFetched(res.data);
        setLoaded(true);
      })

      // Catch errors if any
      .catch((err) => {
        console.warn(err);
      });
  };

  let attrib = [
    // { trait_type: "Carbon Credit Units (tC02e)", value:  },
    { trait_type: "Units Retired (tC02e)", value: 100 },
    { trait_type: "Status", value: "Retired" },
  ];


  const retireNft = async () => {
    try {
      const { uri } = await mx.nfts().uploadMetadata({
        attributes: attrib,
      });

      await mx.nfts().update({
        nftOrSft: mintAddress,
        name: "Updated Name",
        // uri: uri,
      });

    } catch (err) {
      if (err.message !== "User rejected the request.") {
        throw err;
      }
    }
  };

  return (
    <>
      {loading ? <Loading /> : <></>}

      {!wallet.publicKey ? (
        <Loading />
      ) : (
        <div className="fract-container grid grid-cols-3 gap-[1rem] mx-auto auto-rows-fr justify-center">
          {nfts ? (
            nfts.map((nft) => {
              return (
                <div class="font-extralight py-8 px-0 m-auto">
                  <div class="justify-items-center px-3 py-2">
                    <div className="grid  justify-items-center">
                      <div className="card shadow-xl">
                        <figure>
                          <img
                            src={nft.image_uri}
                            width={300}
                            // height={100vh}
                            className="fract-img"
                            alt=""
                          />
                        </figure>
                        <div className="card-body">
                          <p className="text-center font-bold">
                            {nft.name ? nft.name : "No name"}
                          </p>
                          {/* <p>{nft.name ? "Available units (tC02): " + nft.mint : "DNE"}</p> */}
                          <p>
                            {nft.attributes.Vintage
                              ? "Vintage: " + nft.attributes.Vintage
                              : "DNE"}
                          </p>

                          <div className="card-buttons">
                            {/* <AiOutlinePlusCircle size={35} /> */}

                            <button className="btn retire-btn" onClick={retireNft}>Retire</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};
