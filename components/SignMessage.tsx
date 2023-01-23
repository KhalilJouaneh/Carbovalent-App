import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { fetcher, useDataFetch } from "../utils/use-data-fetch";
import { Button, ButtonState } from "./items/button";
import { toast } from "react-hot-toast";
import { Transaction } from "@solana/web3.js";
import { SignCreateData } from "../pages/api/sign/create";
import { SignValidateData } from "../pages/api/sign/validate";
import { useEffect, useState } from "react";
import {Loading} from "./Loading"

export function SignMessage() {
  const { publicKey, signTransaction } = useWallet();
  const [signState, setSignState] = useState<ButtonState>("initial");

  const prevPublickKey = React.useRef<string>(publicKey?.toBase58() || "");

  // Reset the state if wallet changes or disconnects
 useEffect(() => {
    if (publicKey && publicKey.toBase58() !== prevPublickKey.current) {
      prevPublickKey.current === publicKey.toBase58();
      setSignState("initial");
    }
  }, [publicKey]);

  // This will request a signature automatically but you can have a separate button for that
  useEffect(() => {
    async function sign() {
      if (publicKey && signTransaction && signState === "initial") {
        setSignState("loading");
        const signToastId = toast.loading("Signing message...");

        try {
          // Request signature tx from server
          const { tx: createTx } = await fetcher<SignCreateData>(
            "/api/sign/create",
            {
              method: "POST",
              body: JSON.stringify({
                publicKeyStr: publicKey.toBase58(),
              }),
              headers: { "Content-type": "application/json; charset=UTF-8" },
            }
          );

          const tx = Transaction.from(Buffer.from(createTx, "base64"));

          // Request signature from wallet
          const signedTx = await signTransaction(tx);

        

          // Validate signed transaction
          await fetcher<SignValidateData>("/api/sign/validate", {
            method: "POST",
            body: JSON.stringify({
              signedTx: signedTx.serialize().toString("base64"),
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });

          setSignState("success");
          toast.success("Bridge Initiated", { id: signToastId });
        } catch (error: any) {
          setSignState("error");
          toast.error("Error verifying wallet, please reconnect wallet", {
            id: signToastId,
          });
        }
      }
    }
  

    sign();
  }, [signState, signTransaction, publicKey]);


  // if (publicKey && signState === "success" ) {
  //   return <Loading />
  // }


  return (
       <></>
  );
}
