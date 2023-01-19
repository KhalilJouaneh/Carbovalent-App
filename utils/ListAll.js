import { useState, useEffect } from "react";
import axios from "axios";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";
import { Loading } from "../components/Loading";
import { AiOutlinePlusCircle } from "react-icons/ai";

export const ListAll = () => {
  const xKey = "7DmQi-SJmO16yq6u";
  const [network, setNetwork] = useState("devnet");
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState();
  const wallet = useWallet(); //solana wallet object

  const [nftSelected, setNftSelected] = useState([]);
  const [nftAddr, setNftAddr] = useState('');

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

  const mintSemiFungibleToken = (e) => {
    e.preventDefault();

    //Note, we are not mentioning update_authority here for now
    let nftUrl = `https://api.shyft.to/sol/v1/nft/read_all?network=${network}&address=${wallet.publicKey}`;
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

  return (
    <>
      <div className="grd-back">
        <div className="container-lg">
          {!wallet.publicKey && <></>}
          {wallet.publicKey && (
            <div className="w-50 border border-primary rounded-3 mx-auto">
              <div className="form-container p-3">
                <form>
                  <div className="row d-flex justify-content-center">
                    <div className="col-12 p-2">
                      <select
                        name="network"
                        className="form-control form-select"
                        id=""
                        onChange={(e) => setNetwork(e.target.value)}
                      >
                        <option value="devnet">Devnet</option>
                        <option value="testnet">Testnet</option>
                        <option value="mainnet-beta">Mainnet Beta</option>
                      </select>
                    </div>
                    <div className="col-12 p-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Wallet Id"
                        value={wallet.publicKey}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? <Loading /> : <></>}

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
                          width={250}
                          height={250}
                          className="fract-img"
                          alt=""
                        />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{nft.name}</h2>
                        <div className="card-buttons">
                          <AiOutlinePlusCircle size={35} />
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
    </>
  );
};
