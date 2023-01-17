import React from "react";
import { useMemo, useEffect, useState } from "react";
import { OpenNavbar } from "../components/OpenNavbar";
import * as anchor from "@project-serum/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../idl.json";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { Footer } from "../components/Footer";
import { FaPencilAlt } from "react-icons/fa";

function profile() {
  const [user, setUser] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);

  //get program key
  const PROGRAM_KEY = new PublicKey(
    "CAtKEAG8paT41cUBWyunaBsmwFuH5k5BV9Vrhdw6AuE1"
  );

  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

  // console.log(wallet.publicKey?.toString());

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(idl, PROGRAM_KEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const start = async () => {
      if (program && wallet) {
        try {
          setTransactionPending(true);
          const [userPda] = await findProgramAddressSync(
            [utf8.encode("user"), wallet.publicKey.toBuffer()],
            program.programId
          );
          const user = await program.account.userAccount.fetch(userPda);
          if (user) {
            setInitialized(true);
            setUser(user);
            console.log(user);
          }
        } catch (error) {
          console.log("No User");
          setInitialized(false);
        }
      }
    };

    start();
  }, [program, wallet.publicKey, transactionPending]);

  const initUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const name = "tester";
        const description = "Carbovalent user";
        const [userPda] = await findProgramAddressSync(
          [utf8.encode("user"), wallet.publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .initUser(name, description)
          .accounts({
            userAccount: userPda,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setInitialized(true);
      } catch (error) {
        console.log(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  return (
    <>
      <OpenNavbar />
      <div className="h-64 bg-[#1B71E8] flex">
        <label className="pencilIcon">
          <FaPencilAlt size={20} />
          <input
            type="file"
            accept="image/*"
            tabIndex="-1"
            className="hidden"
          />
        </label>
      </div>

      <button
        className=" btn btn-active flex m-auto mt-5"
        onClick={() => {
          initUser();
        }}
      >
        Initialize User
      </button>

      <div className="avatar placeholder">
        <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-neutral-focus text-neutral-content ml-10 -mt-10 ">
          <span className="text-3xl">K</span>
        </div>
      </div>

      <p>
        <br />
        <br />
        username: {user?.name}
        <br />
        description : {user?.description}
      </p>
      <Footer />
    </>
  );
}

export default profile;
