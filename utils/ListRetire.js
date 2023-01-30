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
  const [amountToRetire, setAmountToRetire] = useState(0);
  const [counter, setCounter] = useState(1);

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


  const retireNft = async (mintAddr) => {
    try {
      const nft = await mx
        .nfts()
        .findByMint({ mintAddress: new PublicKey(mintAddr) });
      console.log(nft);

      const updatedAttributes = nft.json.attributes.map((attribute) => {
        if (attribute.trait_type === "Carbon_Credit_Units") {
          return { trait_type: "Carbon_Credit_Units", value: nft.json.attributes. };
        } else if (attribute.trait_type === "Status") {
          return { trait_type: "Status", value: "Retired" };
        } else if (attribute.trait_type === "Units_Retired") {
          return { trait_type: "Units_Retired", value: amountToRetire };
        }
        else return attribute;
      });

      const { uri: newUri } = await mx.nfts().uploadMetadata({
        ...nft.json,
        attributes: updatedAttributes,
      });

      await mx.nfts().update({
        nftOrSft: nft,
        uri: newUri,
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
                            width={500}
                            // height={100vh}
                            className="fract-img"
                            alt="image of nft"
                          />
                        </figure>
                        <div className="card-body">
                          <p className="text-center font-bold mb-5">
                            {nft.name ? nft.name : "No name"}
                          </p>
                          <p className="mb-5">
                            {nft.attributes.Carbon_Credit_Units
                              ? "Available units (tC02): " +
                                nft.attributes.Carbon_Credit_Units
                              : "DNE"}
                          </p>
                          <p className="mb-5">
                            {"Retired units (tC02): " +
                              nft.attributes.Units_Retired - amountToRetire}
                          </p>
                          <p className="mb-5">
                            {nft.attributes.Vintage
                              ? "Status: " + nft.attributes.Status
                              : "DNE"}
                          </p>
                          {/* <p>
                            {nft.attributes.Carbon_Type
                              ? "Type: " + nft.attributes.Carbon_Type
                              : "DNE"}
                          </p>
                          <p>
                            {nft.attributes.Carbon_Type
                              ? "Type: " + nft.attributes.Carbon_Type
                              : "DNE"}
                          </p>
                          <p>
                            {nft.attributes.Vintage
                              ? "Vintage: " + nft.attributes.Vintage
                              : "DNE"}
                          </p>
                          }
                          {/* <p>
                            {nft.attributes.Vintage
                              ? "Methodology: " + nft.attributes.Methodology
                              : "DNE"}
                          </p> */}

                          <div className="card-buttons">
                            {/* <AiOutlinePlusCircle size={35} /> */}

                            {/* <div>
                              <label for="Quantity" class="sr-only ">
                                {" "}
                                Quantity{" "}
                              </label>

                              <div class="flex gap-3 ml-[40px]">
                                <button
                                  type="button"
                                  className=" h-10 leading-10 text-gray-600 transition hover:opacity-75"
                                  onClick={() => {setCounter(counter-1)}}
                                >
                                  &minus;
                                </button>

                                <input
                                  type="number"
                                  id="Quantity"
                                  value={counter}
                                  className="w-20 h-10 border-gray-200 retirement-input"
                                  // onChange={() => {setAmountToRetire(counte  r)}}
                                />

                                <button
                                  type="button"
                                  class="w-10 h-10 leading-10 text-gray-600 transition hover:opacity-75"
                                  onClick={() => {setCounter(counter+1)}}
                                >
                                  &#43;
                                </button>
                              </div>
                            </div> */}

                            <input
                              type="text"
                              placeholder="Enter amount to retire"
                              className="mb-10 p-4"
                              onChange={(event) => setAmountToRetire(event.target.value)}
                            />

                            <button
                              className="btn retire-btn"
                              onClick={(event) => {
                                retireNft(nft.mint);
                              }}
                            >
                              Retire
                            </button>
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
