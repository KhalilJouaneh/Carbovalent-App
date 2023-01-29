import React from "react";
import Image from "next/image";
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
import { GoPencil } from "react-icons/go";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { TbFaceId } from "react-icons/tb";
import { IoInformationCircleSharp } from "react-icons/io5";
import { TbSquareCheck } from "react-icons/tb";
import BlueCarbonImg from "/public/blue_carbon.png";
import RenewableCarbonImg from "/public/renewable_energy.png";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Label,
} from "recharts";

function profile() {
  const [user, setUser] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const barChartData = [
    {
      name: "2020",
      uv: 3970,
      pv: 2000,
      amt: 2400,
    },
    {
      name: "2021",
      uv: 3000,
      pv: 2800,
      amt: 2210,
    },
    {
      name: "2022",
      uv: 2000,
      pv: 3000,
      cv: 1100,
      amt: 2290,
    },
    {
      name: "2023",
      uv: 2100,
      pv: 2800,
      cv: 1500,
      amt: 2000,
    },
  ];

  const pieChartData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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

  // useEffect(() => {
  //   setHydrated(true);
  // }, []);

  
  useEffect(() => {
    const start = async () => {
      setHydrated(true);
      if (program && wallet) {
        try {
          // setTransactionPending(true);
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
            // setInitialized(false);
          }
        }
      };
      start();
    }, [program, wallet.publicKey, transactionPending]);
    
    if (!hydrated) {
        return null;
    }
    const initUser = async () => {
    if (program) {
      try {
        setTransactionPending(true);
        const name = "Unnamed";
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

  // const currentYear = new Date().getFullYear();

  return (
    <div>
      <OpenNavbar />
      <div className="banner-container h-64 bg-[#1B71E8] ">
        <label className="pencilIcon">
          <GoPencil size={40} />
          <input
            type="file"
            accept="image/*"
            tabIndex="-1"
            className="hidden"
          />
        </label>
        <div className="avatar placeholder">
          <div className="w-32 rounded-full ring ring-[#1b71e8] text-neutral-content bg-[#808080]">
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


      {/* {true ? ( */}
      {!user?.name ? (
        <div className="info-container pb-10" >
          <div className="account-info-container">
            <div className="user-name">
              {/* {user?.name} &nbsp; */}
              Unnamed &nbsp;
              <IoMdCheckmarkCircle size={30} className="text-[#1b71e8] mt-3" />
            </div>

            <div className="user-info">
              <p className="opacity-75">
                {/* {user?.business
                  ? "Business Organization"
                  : "Individual Account"}{" "} */}
                Individual Account
                Joined January 
              </p>

              <div className="user-status">
                <b>Status: &nbsp; </b>
                <div className="flex text-[#40c47c]">
                  {/* {user?.status} &nbsp; <IoMdCheckmarkCircle size={30} /> */}
                  Carbon Neutral 2023 &nbsp; <IoMdCheckmarkCircle size={30} />
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-5 place-items-center mt-10 ">
            {/* row 1 column 1  */}
            <div className="chart-container">
              <p className="chart-title">
                Retirement Overview <IoInformationCircleSharp />
              </p>
              <BarChart
                width={500}
                height={300}
                data={barChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                {/* <Tooltip /> */}
                {/* <Legend /> */}
                <Bar dataKey="pv" fill="#c00000" />
                <Bar dataKey="uv" fill="#00b050" />
                <Bar dataKey="cv" fill="#1c71e8" />
              </BarChart>
            </div>

            {/* row 1 column 2 */}
            <div className="chart-container">
              <div className="chart-title">
                Goal Overview <IoInformationCircleSharp />
              </div>
              <div className="goal-circle">100%</div>

              {/* <hr className="goal-hr" /> */}
              <div className="goal-text"></div>
            </div>

            {/* row 2 column 1 */}
            <div className="chart-container" >
              <p className="chart-title">Recent </p>
              <table className="table-fixed  border-seperate">
                <tbody>
                  <tr className="border-solid border-[#808080] border-y-2 border-x-0">
                    <td className="w-36 text-center">
                      <button className="buy-btn"> Buy </button>
                    </td>
                    <td className="w-36 text-center">
                      <div className="recent-quantity">
                        35,500 &nbsp;
                        <Image
                          src={BlueCarbonImg}
                          width={25}
                          height={20}
                          alt="Blue Carbon Energy logo"
                        />
                      </div>
                    </td>
                    <td className="w-52 text-center recent-date">
                      11/09/2022 9:51AM
                    </td>
                    <td className="w-36 text-center">
                      <TbSquareCheck size={35} />
                    </td>
                  </tr>

                  <tr className="border-solid border-[#808080] border-y-2 border-x-0">
                    <td className="w-36 text-center">
                      <button className="sell-btn"> Sell </button>
                    </td>
                    <td className="w-36 text-center">
                      <div className="recent-quantity">
                        685,000 &nbsp;
                        <Image
                          src={BlueCarbonImg}
                          width={25}
                          height={20}
                          alt="Blue Carbon Energy logo"
                        />
                      </div>
                    </td>
                    <td className="w-52 text-center recent-date ">
                      12/08/2022 11:41AM
                    </td>
                    <td className="w-36 text-center">
                      <TbSquareCheck size={35} />
                    </td>
                  </tr>
                  <tr className="border-solid border-[#808080] border-y-2 border-x-0">
                    <td className="w-36 text-center">
                      <button className="retire-btn"> Retire </button>
                    </td>

                    <td className="w-36 text-center">
                      <div className="recent-quantity">
                        1,5000,000 &nbsp;
                        <Image
                          src={BlueCarbonImg}
                          width={25}
                          height={20}
                          alt="Blue Carbon Energy logo"
                        />
                      </div>
                    </td>
                    <td className="w-52 text-center recent-date">
                      01/01/2023 3:43PM
                    </td>
                    <td className="w-36 text-center">
                      <TbSquareCheck size={35} />
                    </td>
                  </tr>
                  <tr className="border-solid border-[#808080] border-y-2 border-x-0">
                    <td className="w-36 text-center">
                      <button className="buy-btn"> Buy </button>
                    </td>
                    <td className="w-36 text-center flex">
                      <div className="recent-quantity">
                        30,000 &nbsp;
                        <Image
                          src={BlueCarbonImg}
                          width={25}
                          height={20}
                          alt="Blue Carbon Energy logo"
                        />
                      </div>
                    </td>
                    <td className="w-52 text-center recent-date">
                      01/17/2023 7:49PM
                    </td>
                    <td className="w-36 text-center">
                      <TbSquareCheck size={35} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* row 2 column 2 */}
            <div className="chart-container">
              <p className="chart-title">Asset Summary</p>
              <PieChart width={500} height={300}>
                <Pie
                  data={pieChartData}
                  cx={80}
                  cy={120}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="value"
                >
                  <Label width={30} position="center">
                    Total Credits: 2,635,500
                  </Label>

                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </div>

      ) : (
        <div className="flex h-screen w-screen">
          <div className="m-auto">
            <button
              className="init-btn flex m-auto "
              onClick={() => {
                initUser();
              }}
            >
              Initialize User
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default profile;
