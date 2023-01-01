import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { MdOutlineAccountBalanceWallet } from 'react-icons/md'
import { AiOutlineSearch } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'

import carbovalentLogo from '/public/carbovalent_logo.png'

import { style } from './Header.style.js'


export function OpenNavbar() {

    require("@solana/wallet-adapter-react-ui/styles.css");

    const WalletMultiButtonDynamic = dynamic(
      async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
      { ssr: false }
    );

  return (
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.logoContainer}>
          <Image src={carbovalentLogo} height={220} width={220} alt="Carbovalent logo"/>
        </div>
      </Link>

      <div className={style.searchBar}>
        <div className={style.searchIcon}>
          <AiOutlineSearch />
        </div>
        <input
          className={style.searchInput}
          placeholder="Search carbon projects, credits, and accounts"
        />
      </div>
      <div className={style.headerItems}>
        <Link href="/registry">
          <div className={style.headerItem}> Registry </div>
        </Link>
        <Link href="/bridge">
        <div className={style.headerItem}>Bridge</div>
        </Link>
        <Link href="/fractionalize">
        <div className={style.headerItem}>Fractionalize</div>
        </Link>
        <Link href="/retire">
        <div className={style.headerItem}>Retire</div>
        </Link>
        <div className={style.headerIcon}>
          <CgProfile />
        </div>
        <div className={style.headerIcon}>
          <WalletMultiButtonDynamic />
        </div>
      </div>
    </div>
  )
}

