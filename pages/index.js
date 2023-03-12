import { OpenNavbar } from "../components/OpenNavbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loading } from "../components/Loading";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "../store/store";
import GoldStandardLogo from "/public/GoldStandard.jpg";
import BlueCarbonImg from "/public/blue_carbon.png";
import RenewableCarbonImg from "/public/renewable_energy.png";
import { style } from "../components/Header.style.js";
import { AiOutlineSearch } from "react-icons/ai";
import { RxTable } from "react-icons/rx";
import { MdFormatListBulleted } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { RegistryFilter } from "../components/RegistryFilters";
import { useState, useEffect } from "react";
import { Footer } from "../components/Footer";

export default function Registry() {
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
  ] = useStore((state) => [
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
  ]);

  //sortColunm=number_of_credits, vintage, certified_date (issuance_date)
  //sortDirection = asc/desc

  const [column, setColumn] = useState("");
  const [direction, setDirection] = useState(""); //direction of sort
  const [GSdata, setGSdata] = useState(); //data retrieved from the gold standard api

  useEffect(() => {
    async function getGoldStandrad() {
      const body = {
        searchQuery: searchQuery,
        pageNumber: pageNumber,
        column: column,
        direction: direction,
      };

      console.log("body: ", JSON.stringify(body));


      const res = await fetch("/api/registry/goldstandard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("res: ", res);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(`Data fetch failed ${data} `);
      }

      console.log("gs data: ", data);

      return data;
    }

    async function fetchData() {
      try {
        const data = await getGoldStandrad();
        setGSdata(data); // set the retrieved data to the GSdata state variable
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

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

      {/* {filterToggle ? <RegistryFilter /> : ""} */}

      {true ? (
        <>
          {GSdata && cardTableToggle ? (
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
                    {GSdata.map((project, idx) => {
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
                          <td className="w-52">
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
              {GSdata?.map((project) => {
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
                    creditType === "Energy Efficiency Agriculture Sector" ||
                    creditType === "Energy Efficiency Commercial Sector"
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                };

                return (
                  <div
                    className={`font-extralight bg-white shadow-lg py-8 px-0 m-auto main-card ${
                      classification() ? "bg-[#8bdbd8]" : "bg-[#7df399]"
                    }`}
                  >
                    <div className="grid  justify-items-center px-3 py-2">
                      <div
                        className={`flex w-11/12 rounded-full items-center px-2 py-3 ${
                          classification() ? "bg-[#7ad0c5]" : "bg-[#5ff1ac]"
                        }`}
                      >
                        <p className="text-white text-[36px] mx-auto">
                          {parseCreditNumber}
                        </p>
                        <img
                          src="/headimg.png"
                          alt="Tailwind CSS Logo"
                          class="w-12 h-12 ml-auto"
                        />
                      </div>

                      <div className="mx-auto">
                        <p className="text-white px-10">
                          renewable energy carbon credit units
                        </p>
                      </div>
                    </div>
                    <div
                      className={`mt-4 text-base text-white text-content ${
                        classification() ? "bg-[#7ad0c5]" : "bg-[#5ff1ac]"
                      }`}
                    >
                      <div className="grid grid-rows-4">
                        <div className="card-content">
                          Type:{" "}
                          {classification()
                            ? "E/R Credits"
                            : "Renewable Energy"}
                        </div>
                        <div className="card-content ">
                          Country: {project.project.country}
                        </div>
                        <div className="card-content">
                          Source: Gold Standard
                        </div>
                        <div className="card-content">
                          Vintage: {project.vintage}
                        </div>
                      </div>
                    </div>
                    <div className="flex foot w-10/12 rounded-full items-center bg-highlight px-2 py-5 grid-cols-2 mt-12 mx-auto allow-overlap ">
                      <div className="grid grid-rows-1 h-fit">
                        <p className="text-[10px] text-white w-100 mr-2 ">
                          {project.serial_number}
                        </p>
                      </div>

                      <img
                        src="/carbovalentlogo.png"
                        alt="Carbovalent Logo"
                        className="w-20 h-20 overlap-img ml-auto mr-1 mb-1"
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
          <Footer />
        </>
      ) : (
        <>{/* wallet not connected */}</>
      )}
    </>
  );
}
