import {OpenNavbar} from '../components/OpenNavbar'
import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";
import { useState } from "react";
import { Loading } from "../components/Loading";
import Image from 'next/image';
import {useStore} from './store';


export default function registry() {
  const wallet = useWallet();

  const [toggle, setToggle] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const {searchQuery, setSearchQuery} = useStore();

  const fetcher = async () => {
    const res = await fetch(
      `https://api.goldstandard.org/credits?query=${searchQuery}&size=30&page=${pageIndex}&issuances=true`
    );
    const data = await res.json();
    return data;
  };

  const { data, error, isLoading } = useSWR(
    `https://api.goldstandard.org/credits?query&size=25&page=${pageIndex}&issuances=true`,
    fetcher
  );

  if (error) return "error";

  if (isLoading) return (<Loading />)

  return (
    <>
      <OpenNavbar />
      <p className="text-center text-3xl font-bold p-5">
        {" "}
        Solana&apos;s Carbon Credit Registry Aggregator{" "}
      </p>
      <p className="text-center text-xl pb-4">
        {" "}
        REAL-TIME DATA . NET-ZERO . INSTANT BRIDGING{" "}
      </p>

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

      {wallet.connected ? (
        <>
          {data && toggle ? (
            <div className="table-container">
              {data.map((project, idx) => {
                return (
                  <>
                    <div className="overflow-x-none flex items-center justify-center border w-fit mx-auto border-[#1B71E8]">
                      <table className="table-fixed max-w-screen-lg border-separate border-spacing">
                        <thead>
                          <tr>
                            <th>name</th>
                            <th>country</th>
                            <th>carbon credits</th>
                            <th>type</th>
                            <th>vintage</th>
                            <th>serial number</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td className="w-52 text-center">
                              {project.project.name}
                            </td>
                            <td className="w-52 text-center">
                              {project.project.country}
                            </td>
                            <td className="w-52 text-center">
                              {project.number_of_credits}
                            </td>
                            <td className="w-52 text-center">
                              {project.project.type}
                            </td>
                            <td className="w-52 text-center">
                              {project.vintage}
                            </td>
                            <td className="w-52 text-center">
                              {project.serial_number}
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
                    <p class="text-white px-10">renewable energy carbon credit units</p>
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
                  <p class="text-sm text-white w-100 mr-2 ">ID: IN-5-277480604-2-2-0-6484</p>
                  <p class="text-sm text-white w-100 mr-2 ">- IN-5-277549035-2-2-0-6484</p>
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
                <button className="btn" onClick={() => setPageIndex(pageIndex-1)}>«</button>
                <button className="btn">Page {pageIndex}</button>
                <button className="btn" onClick={() => setPageIndex(pageIndex+1)}>»</button>
              </div>
            </div>
        </>
      ) : (
        <>{/* wallet not connected */}</>
      )}
    </>
  );
}
