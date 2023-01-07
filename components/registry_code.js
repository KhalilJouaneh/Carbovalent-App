import { OpenNavbar } from "../components/OpenNavbar";
import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "../store/store";
import GoldStandardLogo from "/public/GoldStandard.jpg"
import BlueCarbonImg from "/public/blue_carbon.png"


export default function registry() {
  const wallet = useWallet();

  const [toggle, setToggle] = useState(true);
  const [searchQuery, pageNumber, incrementPageNumber, decrementPageNumber] =
    useStore((state) => [
      state.searchQuery,
      state.pageNumber,
      state.incrementPage,
      state.decrementPage,
    ]);

  const fetcher = async () => {
    const res = await fetch(
      `https://api.goldstandard.org/credits?query=${searchQuery}&size=30&page=${pageNumber}&issuances=true`
    );
    const data = await res.json();
    return data;
  };

  const { data, error, isLoading } = useSWR(
    `https://api.goldstandard.org/credits?query=${searchQuery}&size=30&page=${pageNumber}&issuances=true`,
    fetcher
  );

  if (error) return "error";

  if (isLoading) return <Loading />;

  const handleDecrementPage = (event) => {
    if (pageNumber === 1) {
      return null;
    } else {
      decrementPageNumber();
    }
  };

  return (
    <>
      <OpenNavbar />

      <div className="flex items-center justify-center pb-5">
        <span className="text-md pl-2">TABLE</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          onChange={(event) => setToggle(event.currentTarget.checked)}
          checked={toggle}
        />
        <span className="text-md pr-2">CARDS</span>
      </div>

      {true ? (
        <>
          {data && toggle ? (
            <div className="table-container">
              {data.map((project, idx) => {

                const parseCreditNumber = parseInt(
                  project.number_of_credits
                ).toLocaleString(); //format number of credits with commas

                const parseProjectName = project.project.name.replace(
                  / *\([^)]*\) */g,
                  ""
                ); //remove any paranthese from the project name

                return (
                  <>
                    <div className="overflow-hidden flex items-center justify-center w-fit mx-auto">
                      <table className="table-fixed max-w-screen-lg border-collapse">
                        <thead className="bg-[#000000]">
                          <tr>
                            <th>Source</th>
                            <th>Unit(s)</th>
                            <th>Credit Type</th>
                            <th>Project Name</th>
                            <th>Country</th>
                            <th>Vintage</th>
                            <th>Serial Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="w-52 ">
                              <Image 
                                src={GoldStandardLogo}
                                width={60}
                                height={60}
                                alt="Gold Standard logo"
                                className="m-auto"
                              />
                            </td>
                            <td className="w-52 text-center">
                              <div id="credit-quantity">
                                {parseCreditNumber}
                                <Image 
                                src={BlueCarbonImg}
                                width={30}
                                height={30}
                                alt="Blue Carbon Energy logo"
                                className="float-right m-auto p-1"
                              />
                              </div>
                            </td>
                            <td className="w-52 text-center">
                              {project.project.type}
                            </td>
                            <td className="w-52W">
                              {parseProjectName}
                            </td>
                            <td className="w-52 text-center">
                              {project.project.country}
                            </td>
                            <td className="w-52 text-center">
                              {project.vintage}
                            </td>
                            <td className="w-52 text-center">
                              {project.serial_number}
                            </td>
                            <td className="w-52 text-center">
                              <Link href="/bridge" target="_blank">
                                <button className="btn btn-primary">
                                  Claim
                                </button>
                              </Link>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })}
            </div>
          ) : (
            <div className=" grid grid-cols-4 gap-[2.75rem] container mx-auto auto-rows-fr justify-center shadow-lg">
              {data?.map((project) => {
                return (
                  <div class="font-extralight py-8 px-0 m-auto main-card">
                    <div class="grid justify-items-center px-3 py-2">
                      <div class="flex rounded-full items-center bg-highlight px-2 py-6">
                        <h1 class="text-white w-100 mr-2">68432</h1>
                        <Image
                          src="/headimg.png"
                          width={96}
                          height={96}
                          alt="Carbovalent Card Logo"
                        />
                      </div>

                      <div class="ml-4">
                        <p class="text-white px-10">
                          renewable energy carbon credit units
                        </p>
                      </div>
                    </div>

                    <div class="mt-4 bg-highlight px-4 text-white">
                      <div class="px-2 py-6 grid grid-rows-4">
                        <div class="content-center flex-1">
                          <p class=" ">Project: Wind Energy</p>
                        </div>
                        <div class="content-center flex-1">
                          <p class=" ">Location: India</p>
                        </div>
                        <div class="content-center flex-1">
                          <p class=" ">Source: GS</p>
                        </div>
                        <div class="content-center flex-1">
                          <p class=" ">Vintage: 2020</p>
                        </div>
                      </div>
                    </div>

                    <div class="flex foot rounded-full items-center bg-highlight px-2 py-2 grid-cols-2 mt-5 mx-auto allow-overlap">
                      <div class="grid grid-rows-2">
                        <p class="text-sm text-white w-100 mr-2 ">
                          ID: IN-5-277480604-2-2-0-6484
                        </p>
                        <p class="text-sm text-white w-100 mr-2 ">
                          - IN-5-277549035-2-2-0-6484
                        </p>
                      </div>

                      <Image
                        src="/carbovalentlogo.png"
                        alt="Carbovalent logo on Card"
                        width={80}
                        height={80}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-center mt-5 mb-5">
            <div className="btn-group">
              <button className="btn" onClick={handleDecrementPage}>
                «
              </button>
              <button className="btn">Page {pageNumber} </button>
              <button className="btn" onClick={incrementPageNumber}>
                »
              </button>
            </div>
          </div>
        </>
      ) : (
        <>{/* wallet not connected */}</>
      )}
    </>
  );
}
