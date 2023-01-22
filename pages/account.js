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
import { IoMdCheckmarkCircle } from "react-icons/io";
import { TbFaceId } from "react-icons/tb";

function profile() {
  const [user, setUser] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);

  //get program key
  const PROGRAM_KEY = new PublicKey(
    "8FvudSSuBV2eBmafz1cQLDMADc1Hzzw96AdWEhe8UBEs"
  );

  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

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
        const name = "Unamed";
        const business = false;
        let status = "Carbon Neutral 2023";
        const [userPda] = await findProgramAddressSync(
          [utf8.encode("user"), wallet.publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .signupUser(name, business, status)
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

  const currentYear = new Date().getFullYear();

  return (
    <>
      <OpenNavbar />
      <div className="banner-container h-64 bg-[#1B71E8] ">
        <label className="pencilIcon">
          <FaPencilAlt size={30} />
          <input
            type="file"
            accept="image/*"
            tabIndex="-1"
            className="hidden"
          />
        </label>
        <div className="avatar placeholder">
          <div className="w-32 rounded-full ring ring-[#1b71e8] text-neutral-content  bg-[#808080]">
            <label className="cursor-pointer	">
              <input
                type="file"
                accept="image/*"
                tabIndex="-1"
                className="hidden"
              />
              <TbFaceId size={80} />
            </label>
          </div>
        </div>
      </div>

      {user?.name ? (
        <div className="info-container pb-10">
          <div className="user-name">{user?.name} &nbsp; <IoMdCheckmarkCircle size={30} className="text-[#1b71e8] mt-3"/></div>
          <div className="user-info">
            <p className="opacity-75">
              {user?.business ? "Business Organization" : "Individual Account"}
            </p>

            <div className="user-status">
              <b>Status: &nbsp; </b>{" "}
              <p className="flex text-[#61f761]">
                {user?.status} {currentYear} &nbsp;{" "}
                <IoMdCheckmarkCircle size={30} />
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 place-items-center h-screen pt-5">
            <div className="chart-container">
             
            </div>
            <div className="chart-container"></div>
            <div className="chart-container"></div>
            <div className="chart-container"></div>
          </div>
        </div>
      ) : (
        <button
          className=" btn btn-active flex m-auto mt-5"
          onClick={() => {
            initUser();
          }}
        >
          Initialize User
        </button>
      )}

      <Footer />
    </>
  );
}

export default profile;
