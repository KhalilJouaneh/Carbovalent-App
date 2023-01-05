import React from "react";
import { OpenNavbar } from "../components/OpenNavbar";
import { useWallet } from "@solana/wallet-adapter-react";

function profile() {
  const { connected, wallet } = useWallet();

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
