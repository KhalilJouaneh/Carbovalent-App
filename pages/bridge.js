"use client"
import { useState } from 'react';
import {useProgram, useNFTs, useMintNFT, useSDK} from "@thirdweb-dev/react/solana"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useWallet} from "@solana/wallet-adapter-react";
import {Navbar} from './components/Navbar';

export default () => {
    const sdk = useSDK(); //thirdweb instance
    const wallet = useWallet(); //solana wallet object


    const formArray = [1, 2, 3, 4] ;
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
        let GSData = getRetirmentInfoGS(serialNumber)
        setFormNo(formNo + 1)
      } else {
        toast.error('Please fillup all input field')
      }
    }

    const submitCarbonData = () => {
        if (formNo === 3) {
          //mint the NFT here
          mintCarbonNFT()
          // setFormNo(formNo + 1)
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

    async function getRetirmentInfoGS(serialNum)  {
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
      <Navbar />
      {wallet.connected ? (
        // <div className="w-1/2 flex justify-center items-center outline-dashed ">
        <div className="flex justify-center items-center">
        <ToastContainer />

        <div className="card rounded-md shadow-md p-5">
          <div className='flex justify-center items-center'>
            {
              formArray.map((v, i) => <><div className={`w-[50px] my-3 text-white rounded-full ${formNo - 1 === i || formNo - 1 === i + 1 || formNo - 1 === i + 2  || formNo - 1 === i + 3  ||  formNo - 1 === i + 4 ||  formNo - 1 === i + 5 ||formNo === formArray.length ? 'bg-[#1B71E8]' : 'bg-slate-'} h-[40px] w-[40px] flex justify-center items-center`}>
                {v}
              </div>
                {
                  i !== formArray.length - 1 && <div className={`w-[90px] h-[2px] ${formNo === i + 3 || formNo === formArray.length ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                }
              </>)
            }
          </div>

          
          {
            formNo === 1 && <div>
              <div className='flex flex-col mb-2 max-3xl'>
                <h4 class="text-3xl font-normal leading-normal mt-2 mb-2">
                  Select Source Registry
                </h4>

                  <p className="text-lg font-semibold leading-relaxed mt-3 mb-7 ">
                  In your Carbon Credit registry account, 
                  copy and paste the retirment details in your retirment entry on your respective registry. 
                  <br />
                  <b>IMPORTANT</b>: your carbon credits will be 
                  rejected by the bridge if any of this information is missing, or if it contains any unexpected characters.
                  </p>

                  <select value={registryName} id="dropdown" onChange={handleRegistry} className="block w-70 py-2 px-3 border border-gray-300 bg-black rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    {registries.map((registry) => (
                      <option value={registry.value}  onChange={handleRegistry}>{registry.label}</option>
                      ))}
                  </select>
                </div>

                <button onClick={copyToClipboard} class="bg-transparent  text-blue-700 font-semibold  py-2 px-4 mt-4 border border-blue-500  rounded">
                    {copied ? "Copied" : "C1V-R-669"}
                </button>

                <div className='mt-14 flex justify-center items-center'>
                  <button onClick={next} className='px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Next</button>
                </div>
                
            </div>
          }
  
          {
            formNo === 2 && <div>
              <div className='flex flex-col mb-2'>
                <label className='text-slate-500' htmlFor="serialNumber">Import Retirment Data</label>
                <input value={serialNumber} onChange={handleSerialNumber} className='p-2 border border-slate-400 mt-1 outline-0 text-slate-500 focus:border-blue-500 rounded-md' type="text" name='serialNumber' placeholder='Serial number' id='serialNumber' />
              </div>

              <div className='mt-4 gap-3 flex justify-center items-center'>
                <button onClick={pre} className='px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Previous</button>
                <button onClick={next} className='px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Import Data</button>
              </div>
            </div>
          }
  
          {
            formNo === 3 && <div>
                
              <label className='text-slate-500' htmlFor="serialNumber">Submit Retirment Data</label>

              <p className="text-lg font-semibold leading-relaxed mt-3 mb-7 ">
                Please take your time to review the retirment data before submitting to bridge. 
                <br />
                <b>Important</b>: Bridging carbon credits to the Solana network is a one-way and permanent process.
                </p>

              <div className=' rounded-md	outline-dashed outline-[#1B71E8] p-5'> 
              
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
                <button onClick={pre} className='px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Previous</button>
                <button onClick={submitCarbonData} className='px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Mint NFT</button>
              </div>
            </div>
          }

        {
          formNo === 4 && <div>
              <div className='flex flex-col mb-2'>
                <label className='text-slate-500' htmlFor="serialNumber">Import Retirment Data</label>
                <input value={serialNumber} onChange={handleSerialNumber} className='p-2 border border-slate-400 mt-1 outline-0 text-slate-500 focus:border-blue-500 rounded-md' type="text" name='serialNumber' placeholder='Serial number' id='serialNumber' />
              </div>

              <div className='mt-4 gap-3 flex justify-center items-center'>
                <button onClick={pre} className='px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Previous</button>
                <button onClick={next} className='px-3 py-2 text-lg rounded-md w-full text-white bg-blue-500'>Import Data</button>
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