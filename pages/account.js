import React from "react";
import { useMemo, useEffect } from "react";
import { OpenNavbar } from "../components/OpenNavbar";
import * as anchor from '@project-serum/anchor'
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from '../idl.json'
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

function profile() {

  //get program key
  const PROGRAM_KEY = new PublicKey("CAtKEAG8paT41cUBWyunaBsmwFuH5k5BV9Vrhdw6AuE1")

  const anchorWallet = useAnchorWallet()
  const {connection} = useConnection()
  const wallet = useWallet();

  // console.log(wallet.publicKey?.toString());

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor, anchor.AnchorProvider.defaultOptions())
      return new anchor.Program(idl, PROGRAM_KEY, provider)
    }
  }, [connection, anchorWallet ])

  useEffect(() => {
    const start = async () => {
      if (program && wallet) {
        try {
          //Check if there is a user account 
          const [userPda] = await findProgramAddressSync([utf8.encode("user"), wallet.publicKey.toBuffer()], program.programId)
          const user = await program.account.userAccount.fetch(userPda)
        } catch (error) {
          console.log("No User");
        }
      }
    }
  }, [])

  

  return (
    <>
      <OpenNavbar />
      <div className="h-64 bg-slate-600">
        <input type="file" accept="image/*" tabIndex="-1" className="" />
      </div>

      <div className="avatar placeholder">
        <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-neutral-focus text-neutral-content ml-10 -mt-10 ">
          <span className="text-3xl">K</span>
        </div>
      </div>
    </>
  );
}

export default profile;
