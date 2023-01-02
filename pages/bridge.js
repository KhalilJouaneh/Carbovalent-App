"use client"
import { useState } from 'react';
import {useProgram, useMintNFT, useSDK} from "@thirdweb-dev/react/solana"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useWallet} from "@solana/wallet-adapter-react";
import { OpenNavbar } from '../components/OpenNavbar';
import Image from "next/image";
import { Payload, SIWS } from "@web3auth/sign-in-with-solana";


const Bridge = () => {
    const sdk = useSDK(); //thirdweb instance
    const wallet = useWallet(); //solana wallet object

    let statement = "Sign in with Solana to the app.";

    // const [siwsMessage, setSiwsMessage] = useState<SIWS>();
    // const [nonce, setNonce] = useState("");
    // const [sign, setSignature] = useState("");

    // function createSolanaMessage() {
    //   const payload = new Payload();
    //   payload.domain = domain;
  
    //   payload.address = publicKey!.toString();
    //   payload.uri = origin;
    //   payload.statement = statement;
    //   payload.version = "1";
    //   payload.chainId = 1;
  
    //   let message = new SIWS({ payload });
  
    //   // we need the nonce for verification so getting it in a global variable
    //   setNonce(message.payload.nonce);
    //   setSiwsMessage(message);
    //   const messageText = message.prepareMessage();
    //   const messageEncoded = new TextEncoder().encode(messageText);
    //   signMessage!(messageEncoded).then((resp) => setSignature(bs58.encode(resp)));
    // }

    const formArray = [1, 2, 3, 4, 5] ;
    const [formNo, setFormNo] = useState(formArray[0])
    const [registryName, setRegistryName] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [GSProjectName, setGSProjectName] = useState('');
    const [GSCountry, setGSCountry] = useState('');
    const [GSQuantity, setGSQuantity] = useState('');
    const [GSVintage, setGSVintagae] = useState('');

    const registries = [
      {
        label: "Select a Registry", value: "null",
      },
      {
        label: "American Carbon Registry (ACR)", value: "American Carbon Registry",
      },
      {
        label: "Climate Action Reserve (CAR)", value: "Climate Action Reserve",
      },
      {
        label: "Gold Standard (GS)", value: "Gold Standard ",
      },
      {
        label: "Plan Vivo (PV)", value: "Plan Vivo",
      },
    ];

    const [copied, setCopied] = useState(false); //copy to clipboard button on form 1

    const handleRegistry = (e) => {
      if (e.target.value === "null") { // If user selects "Select a Registry" option
        return null; // Do nothing
      } else {
      setRegistryName(e.target.value);
    }
  }

    const handleSerialNumber = (e) => {
      console.log("Serial Number Entered",  e.target.value);
      if (e.target.value === "") { // If user selects "Select a Registry" option
        return null; // Do nothing
      } else {
      setSerialNumber(e.target.value); //save the state of the "Select Registry" dropdown to whatever the user selects in RegistryName
      }
    }

    const next = () => {
      if (formNo === 1 && registryName) {
        setFormNo(formNo + 1)
      }
      else if (formNo === 2 && serialNumber) {
        let GSissuanceData = getIssuanceInfo(serialNumber)
        setFormNo(formNo + 1)
      } else if (formNo === 3){
        setFormNo(formNo + 1)
      } else if (formNo === 4){
        // let GSretirementData = getRetirmentInfo(serialNumber)
        mintCarbonNFT()
        // setFormNo(formNo + 1)
      }
      else {
        toast.error('Please fillup all input field')
      }
    }


    const pre = () => {
      setFormNo(formNo - 1)
    }

    //copy to clipboard button on form 1 arrow function 
    const copyToClipboard = () => {
      navigator.clipboard.writeText("C1V-R-669").then(
        () => {
            setCopied(true);
            toast.success("Copied to clipboard")
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

    async function getIssuanceInfo(serialNum)  {
      for (let i = 1; i < 23; i++){
        const res = await fetch(`https://api.goldstandard.org/credits?page=${i}&size=150&issuances=true`);
        const data = await res.json();
  
        for (let j = 0; j < 150; j++) {
              if (data[j].serial_number == serialNum) {
                console.log("serial nunmber exists");
                console.log("country: " + data[j].project.country);
                console.log("name: " + data[j].project.name);
                setGSProjectName(data[j].project.name);
                setGSCountry(data[j].project.country);
                setGSQuantity(data[j].number_of_credits);
                setGSVintagae(data[j].vintage);
              //"GS1-1-IN-GS4533-2-2020-22653-106-111" number 149
              return true 
              break 
          }
        }
      }    
    }

    async function getRetirmentInfo(serialNum)  {
      for (let i = 1; i < 23; i++){
        const res = await fetch(`https://api.goldstandard.org/credits?page=${i}&size=150&issuances=false`);
        const data = await res.json();
  
        for (let j = 0; j < 150; j++) {
              if (data[j].serial_number == serialNum) {
                console.log("serial nunmber exists");
                console.log("country: " + data[j].project.country);
                console.log("name: " + data[j].project.name);
                setGSProjectName(data[j].project.name);
                setGSCountry(data[j].project.country);
                setGSQuantity(data[j].number_of_credits);
                setGSVintagae(data[j].vintage);
              //"GS1-1-IN-GS4533-2-2020-22653-106-111" number 149
              return true 
              break 
          }
        }
      }    
    }

    const {data: myNftCollectionProgram} = useProgram(
      '5qRjLdA3iqboq9AJn7Y3sdBXs2KHksa5WnrxvQXJJPw6',
      'nft-collection',
    );

    const {mutate: mintNft} = useMintNFT(myNftCollectionProgram);
    
    async function mintCarbonNFT() {
      mintNft({
        metadata: {
          name: GSProjectName,
          vintage: GSVintage,
          carbon_credit_quantity: GSQuantity,
          country: GSCountry,
          retirment_serialNumber: serialNumber,
          source_registry: registryName,
        },
        to: sdk?.wallet.getAddress(),
      })
    }



    return (
      <>
      <OpenNavbar />
      {wallet.connected ? (
        // <div className="w-1/2 flex justify-center items-center outline-dashed ">
        <div className="flex justify-center items-center">
        <ToastContainer />

        {/* <div className="card rounded-md shadow-md p-5"> */}
        <div className="p-7"> 
          <div className='flex justify-center items-center'>
            {
              formArray.map((v, i) => <><div className={`w-[50px] my-3 text-black font-bold rounded-4xl ${formNo - 1 === i || formNo - 1 === i + 1 || formNo - 1 === i + 2  || formNo - 1 === i + 3  ||  formNo - 1 === i + 4 ||  formNo - 1 === i + 5 ||formNo === formArray.length ? 'bg-[#1B71E8]' : 'bg-slate-'} h-[40px] w-[40px] flex justify-center items-center`}>
                {v}
              </div>
                {
                  i !== formArray.length - 1 && <div className={`w-[90px] h-[2px] ${formNo === i + 3 || formNo === formArray.length ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                }
              </>)
            }
          </div>

          
          {
            formNo === 1 && 
            <div className='rounded-5xl outline outline-offset-1 outline-[#1B71E8] p-7 mt-5 box-border'>
              <div className='flex flex-col mb-2 max-w-xl'>
                <h4 class="text-3xl leading-normal mt-2 mb-2">
                  Select Source Registry
                </h4>

                  <p className="text-lg font-semibold leading-relaxed mt-3 mb-7 text-left">
           
                 Please select the source registry you wish to bridge from. Only unretired credits can be bridged.
                  <br />
                  <br />
                  <b>Important:</b> Bridging is the migration of carbon credits to Carbovalent&apos;s on-chain registry. It does 
                  not in any way constitute a retirement of the credits from the source registry.
                  </p>

                  <select value={registryName} id="dropdown" onChange={handleRegistry} className="block w-70 py-2 px-3 rounded-4xl border-[#1B71E8] bg-[#cdcdcd] rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-bold">
                    {registries.map((registry) => (
                      <option value={registry.value} key={registry.value} onChange={handleRegistry} className="font-semibold"> {registry.label} </option>
                      ))}
                  </select>
                </div>

                <div className='mt-14 flex justify-center items-center'>
                  <button onClick={next} className='px-3 py-2 text-lg rounded-4xl 1.5rem w-1/2 text-white bg-[#1B71E8]'>Next</button>
                </div>
                
            </div>
          }
  
          {
            formNo === 2 && 
            <div className='rounded-5xl outline outline-offset-1 outline-[#1B71E8] p-7 mt-5'>
              <div className='flex flex-col mb-2 max-w-xl'>

              <h4 class="text-3xl leading-normal mt-2 mb-2">
                  Issuance Serial Number
                </h4>
              <p className="text-lg font-bold leading-relaxed mt-3 mb-7 text-left">
                  Please log in to your Carbon Credit registry account and navigate to the issuances section. 
                  Once there, copy and paste the serial number of the carbon credits you wish to bridge. 
                  <br />
                  <br />
                  <b>Attention:</b> Please ensure that the serial number is accurately and completely filled out, 
                  as carbon credits may be rejected by the system if any information is missing or contains unexpected characters. 
                </p>

                {/* <input value={serialNumber} onChange={handleSerialNumber} className='p-2 border border-slate-400 mt-1 outline-0 text-slate-500 focus:border-blue-500 rounded-md' type="text" name='serialNumber' placeholder='Serial number' id='serialNumber' /> */}
                <input value={serialNumber} onChange={handleSerialNumber} className='input input-info bordered w-full max-w-full bg-inherit' type="text" name='serialNumber' placeholder='e.g. XXX-1-XX-XX10886-16-2021-23381-452-41589' id='serialNumber' />

 

              </div>

              <div className='mt-4 gap-3 flex justify-center items-center'>
                <button onClick={pre} className='px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500'>Previous</button>
                <button onClick={next} className='px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500'>Import Data</button>
              </div>
            </div>
          }
  
          {
            formNo === 3 && 
            <div className='rounded-5xl outline outline-[#1B71E8] p-7 mt-5'>   
              <div className='flex flex-col mb-2 max-w-xl'>
              <h4 class="text-3xl leading-normal mt-2 mb-2">
                  Initiate Bridge
                </h4>

              <p className="text-lg font-semibold leading-relaxed mt-3 mb-7 text-left ">
                Please take your time to review the retirment data before submitting to bridge. 
                <br /><br />
                <b>Important</b>: Bridging carbon credits to the Solana network is a one-way and permanent process.
                </p>

              <div className=' rounded-5xl outline-dashed outline-[#1B71E8] p-5'> 
              
              <div className='flex flex-col mb-2'>
                <label htmlFor="projectName">PROJECT NAME</label>
                <b>{GSProjectName}</b>
              </div>
              <div className='flex flex-col mb-2'>
                <label htmlFor="thana">SERIAL NUMBER</label>
                <b>{serialNumber}</b>
              </div>
              <div className='flex flex-col mb-2'>
                <label htmlFor="post">REGISTRY</label>
                <b>{registryName}</b>
              </div>
              <div className='flex flex-col mb-2'>
                <label htmlFor="post">COUNTRY</label>
                <b> {GSCountry}</b>
              </div>
              <div className='flex flex-col mb-2'>
                <label htmlFor="post">QUANTITY</label>
                <b>{GSQuantity} </b>
              </div>
              
              <div className='flex flex-col mb-2'>
                <label htmlFor="post">VINTAGE</label>
                <b>{GSVintage}</b>
              </div>

              </div>

                <div className='mt-4 gap-3 flex justify-center items-center'>
                  <button onClick={pre} className='rounded-4xl px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Previous</button>
                 
                  <button onClick={next} id="verify" className='rounded-4xl px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Initiate Bridge</button>
                </div>
              </div>
            </div>
          }

      {
            formNo === 4 && 
            <div className='rounded-5xl outline outline-offset-1 outline-[#1B71E8] p-7 mt-5'>
              <div className='flex flex-col mb-2 max-w-xl'>

              <h4 class="text-3xl leading-normal mt-2 mb-2">
                  Retirement Serial Number
                </h4>
                
              <p className="text-lg font-bold leading-relaxed mt-3 mb-7 text-left">
                  Navigate to the retirement section. 
                  Once there, copy and paste the Carbovalent migration identifier into the designated retirement note field before completing the retirment on the source registry.
                  <br /><br />

                  <button onClick={copyToClipboard} class="bg-white text-gray-700 font-semibold py-4 px-4 border rounded-4xl border-blue-500 text-left italic min-w-fit">
                    {copied ? "Copied" : `"This action is a migration of carbon credits to the Carbovalent on-chain registry. Holder wallet: ${wallet.publicKey}"`}
                  </button>
                  <br /><br />
                  To finalize the bridging process, please input the retirement serial number in the space below and proceed to mint your reference NFT.
                  <br /><br /> 
                  
                  <b> Important</b>: Please ensure that the identifier and retirement serial number are accurately and completely filled out. 
                   Any variations from the identifier will result in the migration being rejected.
                </p>

                {/* <input value={serialNumber} onChange={handleSerialNumber} className='p-2 border border-slate-400 mt-1 outline-0 text-slate-500 focus:border-blue-500 rounded-md' type="text" name='serialNumber' placeholder='Serial number' id='serialNumber' /> */}
                <input value={serialNumber} onChange={handleSerialNumber} className='input input-info bordered w-full max-w-full bg-inherit' type="text" name='serialNumber' placeholder='e.g. XXX-1-XX-XX10886-16-2021-23381-452-41589' id='serialNumber' />

              </div>

              <div className='mt-4 gap-3 flex justify-center items-center'>
                <button onClick={pre} className='px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500'>Previous</button>
                <button onClick={next} className='px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500'>Mint NFT</button>
              </div>
            </div>
          }

          {
            formNo === 5 && 
            <div className='rounded-5xl outline outline-[#1B71E8] p-7 mt-5'>
              <div className='flex flex-col mb-2 max-w-xl'>
              <div className='h-98'>

              <Image 
                    className='object-center'
                        src="/orange_nft.png"
                        alt=''
                        width={490}
                        height={400}
                    />
              </div>
             
                <button onClick={pre} className='px-3 py-2 text-lg rounded-4xl w-full text-white bg-blue-500 mt-10'>Previous</button>
              </div>
            </div>
          }


        </div>
      </div>


      ) : (
        // if not connectet to wallet
        <>
        </>
      )}
    
      </>
      
    );
}

Bridge.displayName = "Bridge";
export default Bridge;
