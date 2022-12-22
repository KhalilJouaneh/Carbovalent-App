import {Navbar} from './components/Navbar'
import {useWallet} from "@solana/wallet-adapter-react";
import { useProgram, useNFTs, useProgramMetadata} from "@thirdweb-dev/react/solana"
import Card from './components/Card'
import styles from "../styles/Home.module.css";

async function goldStandardAPI() {
      
  const res = await fetch(`https://api.goldstandard.org/credits?&size=25&issuances=true`);
  const data = await res.json();

  return data;
  
}

export default function registry() {


  const wallet = useWallet();
  const PROGRAM_ADDRESS = "5qRjLdA3iqboq9AJn7Y3sdBXs2KHksa5WnrxvQXJJPw6";
  const {data: collectionProgram} = useProgram(PROGRAM_ADDRESS, 'nft-collection')
  const {data: metadata, isLoading: loadingMetadata} = useProgramMetadata(collectionProgram)
  const {data: nfts, isLoading: loadingNFTs} = useNFTs(collectionProgram)


  return (
    <>
    <Navbar />

    {wallet.connected ? (
        <>
        <h1>All Projects</h1>
            
        </>
    ) : (
        <>
        </>
    )}

    </>
  )
}


// for metadata
{/* {loadingMetadata ? (
            <p>Loading...</p>
            ) : (
            <>
            <h1>{metadata?.uri}</h1>
            </>
        )} */}

//return NFTs that are bridged
{/* {loadingNFTs ? (
          <p>Loading...</p>
        ) : (
          <main className={styles.gallery}>
            {nfts?.map((nft, idx) => (
              <Card key={idx} nft={nft} />
            ))}
          </main>
        )} */}
