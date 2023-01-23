import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { fetcher, useDataFetch } from "../../utils/use-data-fetch";
import { ItemList } from "./item-list";
import { ItemData } from "./item";
import { Button, ButtonState } from "./button";
import { toast } from "react-hot-toast";
import { Transaction } from "@solana/web3.js";
import { SignCreateData } from "../../pages/api/sign/create";
import { SignValidateData } from "../../pages/api/sign/validate";
import { useEffect, useState } from "react";
import { Loading } from "../Loading";

export  function HomeContent() {
  const { publicKey, signTransaction } = useWallet();
  const [signState, setSignState] = useState<ButtonState>("initial");
  const { data, error } = useDataFetch<Array<ItemData>>(
    publicKey && signState === "success" ? `/api/items/${publicKey}` : null
  );
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
          toast.success("Message signed", { id: signToastId });
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

  const onSignClick = () => {
    setSignState("initial");
  };

  if (error) {
    return (
      <p className="text-center p-4">
        Failed to load items, please try connecting again
      </p>
    );
  }

  if (publicKey && signState === "success" && !data) {
    return <Loading />;
  }

  const hasFetchedData = publicKey && signState === "success" && data;

  return (
    <div className="">
      {hasFetchedData ? (
        <div>
          <ItemList items={data} />
        </div>
      ) : (
        <div className="text-center">
          {!publicKey && (
            <h2 className="font-bold">
              Please connect your wallet to get a list of your NFTs
            </h2>
          )}

          {publicKey && signState === "error" ? (
            <div className="flex h-screen w-screen">
              <div className="m-auto">
    
                <Button
                  state={signState}
                  onClick={onSignClick}
                  className="init-btn"
                >
                  Verify Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-screen w-screen">
            <div className="m-auto">
  
              <Button
                state={signState}
                onClick={onSignClick}
                className="init-btn"
              >
                Verify Wallet
              </Button>
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}
