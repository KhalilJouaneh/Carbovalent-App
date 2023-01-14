import { useState } from "react";
import axios from "axios";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { useWallet } from "@solana/wallet-adapter-react";

export const ListAll = () => {
  const xKey = "7DmQi-SJmO16yq6u";
  const [wallID, setWallID] = useState("");
  const [network, setNetwork] = useState("devnet");
  const [isLoaded, setLoaded] = useState(false);
  const [dataFetched, setDataFetched] = useState();
  const [connStatus, setConnStatus] = useState(false);
  const wallet = useWallet(); //solana wallet object


  // Phantom Adaptor
//   const solanaConnect = async () => {
//     console.log("clicked solana connect");
//     const { solana } = window;
//     if (!solana) {
//       alert("Please Install Solana");
//     }

//     try {
//       //const network = "devnet";
//       const phantom = new PhantomWalletAdapter();
//       await phantom.connect();
//       const rpcUrl = clusterApiUrl(network);
//       const connection = new Connection(rpcUrl, "confirmed");
//       const wallet = {
//         address: phantom.publicKey.toString(),
//       };

//       if (wallet.address) {
//         console.log(wallet.address);
//         setWallID(wallet.address);
//         const accountInfo = await connection.getAccountInfo(
//           new PublicKey(wallet.address),
//           "confirmed"
//         );
//         console.log(accountInfo);
//         setConnStatus(true);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

  const fetchNFTs = (e) => {
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
    <div className="grd-back">
      <div className="container-lg">
        <div className="py-4 text-center">
          <h1>List All Your NFTs</h1>
          <p>
            This is a sample project which will list all your NFTs associated
            with your wallet
          </p>
        </div>
      </div>

      <div className="container-lg">
        {!wallet.publicKey && (
          <></>
          
        )}
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
                <div className="text-center p-3">
                  <button className="btn btn-primary" onClick={fetchNFTs}>
                    Get
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="card-container  grid grid-cols-3 gap-[2.75rem] mx-auto auto-rows-fr justify-center">
        {isLoaded &&
          dataFetched.result.map((item) => {
            return (
              <div class="font-extralight py-8 px-0 m-auto card-body">
                <div class="grid justify-items-center px-3 py-2">
                  <img className="img-fluid w-50 h-50" src={item.image_uri} alt="img" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
