import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/wallet.css";
import "../styles/buttons.css";
import "../styles/responsive.css";
import "../styles/card.css";
import "../styles/account.css";
import "../styles/fractionalize.css";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletProvider } from "@solana/wallet-adapter-react";
import {
  BackpackWalletAdapter,
  BraveWalletAdapter,
  CoinbaseWalletAdapter,
  FractalWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { useMemo } from "react";

// Change the network to the one you want to use: "mainnet-beta", "testnet", "devnet", "localhost" or your own RPC endpoint
// const network: Network = "devnet";

const App = ({
  Component,
  pageProps,
  cluster,
}: AppProps & { cluster: string }) => {
  const network = useMemo(() => {
    switch (cluster) {
      case 'mainnet':
        return WalletAdapterNetwork.Mainnet
      case 'devnet':
        return WalletAdapterNetwork.Devnet
      case 'testnet':
        return WalletAdapterNetwork.Testnet
      default:
        return WalletAdapterNetwork.Mainnet
    }
}, [cluster]) 

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new BackpackWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new CoinbaseWalletAdapter(),
    new BraveWalletAdapter(),
    new SlopeWalletAdapter(),
    new FractalWalletAdapter(),
    new GlowWalletAdapter({ network }),
    new LedgerWalletAdapter(),
    new TorusWalletAdapter({ params: { network, showTorusButton: false } }),
  ],
  [network]
)
{
  return (
    <WalletProvider autoConnect wallets={wallets} >
      <WalletModalProvider>
          <Component {...pageProps} suppressHydrationWarning={true}/>
        </WalletModalProvider>
    </WalletProvider>
  )
}}

export default App;
