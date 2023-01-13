"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { OpenNavbar } from "../components/OpenNavbar";
import Image from "next/image";
import useSWR from "swr";
import { Loading } from "../components/Loading";
import { Footer } from "../components/Footer";

const Bridge = () => {
  const wallet = useWallet(); //solana wallet object

  const formArray = [1, 2, 3, 4, 5];
  const [formNo, setFormNo] = useState(formArray[0]);
  const [registryName, setRegistryName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [copied, setCopied] = useState(false); //copy to clipboard button on form 1

  const handleRegistry = (e) => {
    if (e.target.value === "null") {
      // If user selects "Select a Registry" option
      return null; // Do nothing
    } else {
      setRegistryName(e.target.value);
    }
  };

  const handleSerialNumber = (e) => {
    if (e.target.value === "") {
      // If user selects "Select a Registry" option
      return null; // Do nothing
    } else {
      setSerialNumber(e.target.value.trim()); //save the state of the "Select Registry" dropdown to whatever the user selects in RegistryName
    }
  };

  const next = () => {
    if (formNo === 1 && registryName) {
      setFormNo(formNo + 1);
    } else if (formNo === 2 && serialNumber) {
      setSearchQuery(serialNumber);
      setFormNo(formNo + 1);
    } else if (formNo === 3) {
      setFormNo(formNo + 1);
    } else if (formNo === 4) {
      // let GSretirementData = getRetirmentInfo(serialNumber)
      // mintCarbonNFT();
      // setFormNo(formNo + 1)
    } else {
      toast.error("Please fillup all input field");
    }
  };

  const pre = () => {
    setFormNo(formNo - 1);
  };

  //copy to clipboard button on form 1 arrow function
  const copyToClipboard = () => {
    navigator.clipboard.writeText("C1V-R-669").then(
      () => {
        setCopied(true);
        toast.success("Copied to clipboard");
        // changing back to default state after 2 seconds.
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.log("failed to copy", err.mesage);
      }
    );
  };

  const fetcher = async () => {
    const res = await fetch(
      `https://api.goldstandard.org/credits?query=${searchQuery}&issuances=true&size=1`
    );
    const data = await res.json();
    return data;
  };

  const { data, error, isLoading } = useSWR(
    `https://api.goldstandard.org/credits?query=${searchQuery}&issuances=true&size=1`,
    fetcher
  );

  if (error) return "error";

  if (isLoading) return <Loading />;

  return (
    <>
      <OpenNavbar />
      {true ? (
        <>
          <div className="flex justify-center items-center">
            <ToastContainer />
            <div className="p-7">
              <div className="flex justify-center items-center">
              
                
                <ul className="steps">
                  <li className="step step-primary"></li>
                  <li className={`${formNo >= 2 ? "step step-primary" : "step"}`}></li>
                  <li className={`${formNo >= 3 ? "step step-primary" : "step"}`}></li>
                  <li className={`${formNo >= 4 ? "step step-primary" : "step"}`}></li>
                  <li className={`${formNo >= 5 ? "step step-primary" : "step"}`}></li>
                </ul>
              </div>

              {formNo === 1 && (
                <div className="rounded-5xl outline outline-offset-1 outline-[#1B71E8] p-7 mt-5 box-border">
                  <div className="flex flex-col mb-2 max-w-xl">
                    <h4 class="text-3xl leading-normal mt-2 mb-2 m-auto font-bold">
                      Select Source Registry
                    </h4>

                    <p className="text-lg font-semibold leading-relaxed mt-3 mb-7 text-left">
                      Please select the source registry you wish to bridge from.
                      Only unretired credits can be bridged.
                      <br />
                      <br />
                      <b>Important:</b> Bridging is the migration of carbon
                      credits to Carbovalent&apos;s on-chain registry. It does
                      not in any way constitute a retirement of the credits from
                      the source registry.
                    </p>

                    <select
                      className="select w-full max-w-xs text-base mx-auto"
                      onChange={handleRegistry}
                    >
                      <option disabled selected className="text-base">
                        Select registry
                      </option>
                      <option value={1}>Gold Standard</option>
                      <option disabled value={2}>
                        American Carbon Registry (ACR)
                      </option>
                      <option disabled value={3}>
                        Climate Action Reserve (CAR)
                      </option>
                      <option disabled value={4}>
                        Plan Vivo
                      </option>
                    </select>
                  </div>

                  <div className="mt-14 flex justify-center items-center">
                    <button
                      onClick={next}
                      className="px-3 py-2 text-lg rounded-4xl 1.5rem w-1/2 text-white bg-[#1B71E8]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {formNo === 2 && (
                <div className="rounded-5xl outline outline-offset-1 outline-[#1B71E8] p-7 mt-5">
                  <div className="flex flex-col mb-2 max-w-xl">
                    <h4 class="text-3xl leading-normal mt-2 mb-2 font-bold mx-auto">
                      Issuance Serial Number
                    </h4>
                    <p className="text-lg font-bold leading-relaxed mt-3 mb-7 text-left">
                      Please log in to your Carbon Credit registry account and
                      navigate to the issuances section. Once there, copy and
                      paste the serial number of the carbon credits you wish to
                      bridge.
                      <br />
                      <br />
                      <b>Attention:</b> Please ensure that the serial number is
                      accurately and completely filled out, as carbon credits
                      may be rejected by the system if any information is
                      missing or contains unexpected characters.
                    </p>

                    <input
                      // value={serialNumber}
                      onChange={handleSerialNumber}
                      className="input input-info bordered w-full max-w-full bg-inherit"
                      type="text"
                      name="serialNumber"
                      placeholder="e.g. XXX-1-XX-XX10886-16-2021-23381-452-41589"
                      id="serialNumber"
                    />
                  </div>

                  <div className="mt-4 gap-3 flex justify-center items-center">
                    <button
                      onClick={pre}
                      className="px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500"
                    >
                      Previous
                    </button>
                    <button
                      onClick={next}
                      className="px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500"
                    >
                      Import Data
                    </button>
                  </div>
                </div>
              )}

              {formNo === 3 && (
                <div className="rounded-5xl outline outline-[#1B71E8] p-7 mt-5">
                  <div className="flex flex-col mb-2 max-w-xl">
                    <h4 class="text-3xl leading-normal mt-2 mb-2">
                      Initiate Bridge
                    </h4>

                    <p className="text-lg font-semibold leading-relaxed mt-3 mb-7 text-left ">
                      Please take your time to review the retirment data before
                      submitting to bridge.
                      <br />
                      <br />
                      <b>Important</b>: Bridging carbon credits to the Solana
                      network is a one-way and permanent process.
                    </p>

                    <div className=" rounded-5xl outline-dashed outline-[#1B71E8] p-5">
                      <div className="flex flex-col mb-2">
                        <label htmlFor="projectName">PROJECT NAME</label>
                        <b>{data[0].id}</b>
                      </div>
                      <div className="flex flex-col mb-2">
                        <label htmlFor="thana">SERIAL NUMBER</label>
                        <b>{serialNumber}</b>
                      </div>
                      <div className="flex flex-col mb-2">
                        <label htmlFor="post">REGISTRY</label>
                        <b>Gold Standard</b>
                      </div>
                      <div className="flex flex-col mb-2">
                        <label htmlFor="post">COUNTRY</label>
                        <b> {data[0].project.country}</b>
                      </div>
                      <div className="flex flex-col mb-2">
                        <label htmlFor="post">QUANTITY</label>
                        <b>{data[0].number_of_credits} </b>
                      </div>

                      <div className="flex flex-col mb-2">
                        <label htmlFor="post">VINTAGE</label>
                        <b>{data[0].vintage}</b>
                      </div>
                    </div>

                    <div className="mt-4 gap-3 flex justify-center items-center">
                      <button
                        onClick={pre}
                        className="rounded-4xl px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500"
                      >
                        Previous
                      </button>

                      <button
                        onClick={next}
                        id="verify"
                        className="rounded-4xl px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500"
                      >
                        Initiate Bridge
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {formNo === 4 && (
                <div className="rounded-5xl outline outline-offset-1 outline-[#1B71E8] p-7 mt-5">
                  <div className="flex flex-col mb-2 max-w-xl">
                    <h4 class="text-3xl leading-normal mt-2 mb-2">
                      Retirement Serial Number
                    </h4>

                    <p className="text-lg font-bold leading-relaxed mt-3 mb-7 text-left">
                      Navigate to the retirement section. Once there, copy and
                      paste the Carbovalent migration identifier into the
                      designated retirement note field before completing the
                      retirment on the source registry.
                      <br />
                      <br />
                      <button
                        onClick={copyToClipboard}
                        class="bg-white text-gray-700 font-semibold py-4 px-4 border rounded-4xl border-blue-500 text-left italic min-w-fit"
                      >
                        {copied
                          ? "Copied"
                          : `"This action is a migration of carbon credits to the Carbovalent on-chain registry. Holder wallet: ${wallet.publicKey}"`}
                      </button>
                      <br />
                      <br />
                      To finalize the bridging process, please input the
                      retirement serial number in the space below and proceed to
                      mint your reference NFT.
                      <br />
                      <br />
                      <b> Important</b>: Please ensure that the identifier and
                      retirement serial number are accurately and completely
                      filled out. Any variations from the identifier will result
                      in the migration being rejected.
                    </p>

                    <input
                      value={serialNumber}
                      onChange={handleSerialNumber}
                      className="input input-info bordered w-full max-w-full bg-inherit"
                      type="text"
                      name="serialNumber"
                      placeholder="e.g. XXX-1-XX-XX10886-16-2021-23381-452-41589"
                      id="serialNumber"
                    />
                  </div>

                  <div className="mt-4 gap-3 flex justify-center items-center">
                    <button
                      onClick={pre}
                      className="px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500"
                    >
                      Previous
                    </button>
                    <button
                      onClick={next}
                      className="px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500"
                    >
                      Mint NFT
                    </button>
                  </div>
                </div>
              )}

              {formNo === 5 && (
                <div className="rounded-5xl outline outline-[#1B71E8] p-7 mt-5">
                  <div className="flex flex-col mb-2 max-w-xl">
                    <div className="h-98">
                      <Image
                        className="object-center"
                        src="/orange_nft.png"
                        alt=""
                        width={490}
                        height={400}
                      />
                    </div>

                    <button
                      onClick={pre}
                      className="px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500 mt-10"
                    >
                      Previous
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </>
      ) : (
        // if not connectet to wallet
        <></>
      )}
    </>
  );
};

Bridge.displayName = "Bridge";
export default Bridge;
