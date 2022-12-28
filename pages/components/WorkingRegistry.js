import { Navbar } from "./components/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";
import { useState } from "react";
import { Loading } from "./components/Loading";

export default function registry() {
  const wallet = useWallet();

  const [toggle, setToggle] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);

  const fetcher = async () => {
    const res = await fetch(
      `https://api.goldstandard.org/credits?query&size=28&page=${pageIndex}&issuances=true`
    );
    const data = await res.json();
    return data;
  };

  const { data, error, isLoading } = useSWR(
    `https://api.goldstandard.org/credits?query&size=25&page=${pageIndex}&issuances=true`,
    fetcher
  );

  if (error) return "error";

  // if (isLoading) return (<Loading />)

  return (
    <>
      <Navbar />
      <p className="text-center text-3xl font-bold pb-2">
        {" "}
        Solana's Carbon Credit Registry Aggregator{" "}
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
          {data && !toggle ? (
            <div className="table-container">
              {data.map((project, idx) => {
                return (
                  <>
                    <div className="overflow-x-none flex items-center justify-center border w-fit mx-auto border-slate-700">
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
            <div className="grid grid-cols-4 gap-[2.75rem] container mx-auto shadow-yelllow-500/50">
              {data?.map((project) => {
              return (
                  <div className="card w-72 bg-[#ffe57a] shadow-xl pl-5 rounded-5xl">
                    <div className="card-body">
                      <h2 className="card-title">{project.number_of_credits}</h2>
                      <h2 className="card-title">
                        renewable energy carbon credit units
                      </h2>

                      <h3> Project: {project.project.name}</h3>
                      <h3> Location: {project.project.country}</h3>
                      <h3> Source: {project.project.gsf_standards_version}</h3>
                      <h3> Vintage: {project.vintage} </h3>

                      <div className="card-actions">
                        <button className="btn btn-primary">Claim</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="btn-group flex w-screen mt-5 mb-5">
            <div className="m-auto">
              <button className="btn">1</button>
              <button className="btn">2</button>
              <button className="btn btn-disabled">...</button>
              <button className="btn">99</button>
              <button className="btn">100</button>
            </div>
          </div>
        </>
      ) : (
        <>{/* wallet not connected */}</>
      )}
    </>
  );
}
