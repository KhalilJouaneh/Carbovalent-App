import React from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { useState } from "react";
import { OpenNavbar } from "../components/OpenNavbar";
import { Footer } from "../components/Footer";
import { ListRetire } from "../utils/ListRetire";
function retire() {
  return (
    <>
      <OpenNavbar />
      <ListRetire />
      <Footer />
    </>
  );
}

export default retire;
