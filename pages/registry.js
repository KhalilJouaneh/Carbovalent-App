import { OpenNavbar } from "../components/OpenNavbar";
import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";
import { Loading } from "../components/Loading";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "../store/store";
import GoldStandardLogo from "/public/GoldStandard.jpg";
import BlueCarbonImg from "/public/blue_carbon.png";
import RenewableCarbonImg from "/public/renewable_energy.png";
import shallow from "zustand/shallow";
import { style } from "../components/Header.style.js";
import { AiOutlineSearch } from "react-icons/ai";
import { RxTable } from "react-icons/rx";
import { MdFormatListBulleted } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { RegistryFilter } from "../components/RegistryFilters";
import { useState } from "react";

export default function registry() {
  const handleSearchQuery = (event) => {
    if (event.key === "Enter") {
      resetPageNumber(); //set page number to 1 after user searches
      updateSearchQuery(event.target.value.trim()); //pass query to api call
    }
  };

  const [
    searchQuery,
    updateSearchQuery,
    pageNumber,
    incrementPageNumber,
    decrementPageNumber,
    resetPageNumber,
    cardTableToggle,
    setCardTableToggle,
    filterToggle,
    setFilterToggle,
  ] = useStore(
    (state) => [
      state.searchQuery,
      state.updateSearchQuery,
      state.pageNumber,
      state.incrementPage,
      state.decrementPage,
      state.resetPageNumber,
      state.cardTableToggle,
      state.setCardTableToggle,
      state.filterToggle,
      state.setFilterToggle,
    ],
    shallow
  );

  //sortColunm=number_of_credits, vintage, certified_date (issuance_date)
  //sortDirection = asc/desc

  const [column, setColumn] = useState("");
  const [direction, setDirection] = useState("");

  const fetcher = async () => {
    const res = await fetch(
      `https://api.goldstandard.org/credits?query=${searchQuery}&size=30&page=${pageNumber}&issuances=true&sortColumn=${column}&sortDirection=${direction}`
    );
    const data = await res.json();
    return data;
  };

  const { data, error, isLoading } = useSWR(
    `https://api.goldstandard.org/credits?query=${searchQuery}&size=30&page=${pageNumber}&issuances=true&sortColumn=${column}&sortDirection=${direction}`,
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

  const handleSelectedOption = (e) => {
    let selectedOption = e.target.value;
    if (selectedOption == 1) {
      setDirection("");
      setColumn("");
    } else if (selectedOption == 2) {
      setDirection("desc");
      setColumn("number_of_credits");
      console.log("direction" + direction + "column" + column + selectedOption);
    } else if (selectedOption == 3) {
      setDirection("asc");
      setColumn("number_of_credits");
    } else if (selectedOption == 4) {
      setDirection("desc");
      setColumn("vintage");
    } else if (selectedOption == 5) {
      setDirection("asc");
      setColumn("vintage");
    } else if (selectedOption == 6) {
      setDirection("asc");
      setColumn("certified_date");
    }
  };

  return (
    <>
      <OpenNavbar />

      <div className="mt-[13px] flex search-container shadow-lg pb-[13px]">
        <IoFilter
          size={30}
          className="my-auto ml-10 cursor-pointer"
          onClick={(event) => {
            setFilterToggle(filterToggle);
          }}
        />

        <div className={style.searchBar}>
          <div className={style.searchIcon}>
            <AiOutlineSearch />
          </div>
          <input
            className={style.searchInput}
            placeholder="Search by serial number or country"
            onKeyDown={handleSearchQuery}
          />
        </div>

        <select
          className="select w-full max-w-xs mr-10 text-base"
          onChange={handleSelectedOption}
        >
          <option disabled selected className="text-base">
            Select option
          </option>
          <option value={1}>Recently issued</option>
          <option value={2}>Units high to low</option>
          <option value={3}>Units low to high</option>
          <option value={4}>Vintage high to low</option>
          <option value={5}>Vintage low to high</option>
          <option value={6}>Oldest</option>
        </select>
      </div>

      <div className="flex items-center justify-center pb-10 pt-10">
        <span className="mr-5">
          <RxTable size={27} />
        </span>
        <input
          type="checkbox"
          className="toggle"
          onChange={(event) => setCardTableToggle(event.currentTarget.checked)}
          checked={cardTableToggle}
        />
        <span className="ml-5">
          <MdFormatListBulleted size={30} />
        </span>
      </div>

      {filterToggle ? <RegistryFilter /> : ""}

      {true ? (
        <>
          {data && cardTableToggle ? (
            <div className="table-container">
              <div className="flex items-center justify-center w-fit mx-auto">
                <table className="table-fixed max-w-screen-lg border-seperate ">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Unit(s)</th>
                      <th>Credit Type</th>
                      <th>Project Type</th>
                      <th>Country</th>
                      <th>Vintage</th>
                      <th>Serial Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((project, idx) => {
                      const parseCreditNumber = parseInt(
                        project.number_of_credits
                      ).toLocaleString(); //format number of credits with commas

                      let creditType = project.project.type;
                      const classification = function () {
                        if (
                          creditType === "Energy Efficiency - Domestic" ||
                          creditType === "Energy Efficiency - Industrial" ||
                          creditType === "Energy Efficiency - Public Sector" ||
                          creditType === "Energy Efficiency Transport Sector" ||
                          creditType ===
                            "Energy Efficiency Agriculture Sector" ||
                          creditType === "Energy Efficiency Commercial Sector"
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      };

                      return (
                        <tr className="border-solid border-[#E4E8EB] border-y-2 border-x-0">
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
                                src={
                                  classification()
                                    ? BlueCarbonImg
                                    : RenewableCarbonImg
                                }
                                width={30}
                                height={30}
                                alt="Blue Carbon Energy logo"
                                className="float-right m-auto p-1"
                              />
                            </div>
                          </td>
                          <td className="w-64 text-center">
                            {classification()
                              ? "Efficiency/Reduction Credits"
                              : "Renewable Energy"}
                          </td>
                          <td className="w-64 h-8 text-center">
                            {project.project.type}
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
                              <button className="btn claim-btn">Claim</button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card-container grid grid-cols-3 gap-[2.75rem] mx-auto auto-rows-fr justify-center">
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
