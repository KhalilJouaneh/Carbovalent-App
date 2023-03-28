import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import carbovalentLogo from "/public/carbovalent_logo.png";
import { style } from "./Header.style.js";
import shallow from "zustand/shallow";

import { useStore } from "../store/store.ts";

export function OpenNavbar() {
  // Zustand state
  const [searchQuery, updateSearchQuery, resetPageNumber] = useStore(
    (state) => [
      state.searchQuery,
      state.updateSearchQuery,
      state.resetPageNumber,
    ]);

  //connect wallet adapater 
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  //handle search query on enter key press
  const handleSearchQuery = (event) => {
    if (event.key === "Enter") {
      resetPageNumber(); //set page number to 1 after user searches
      updateSearchQuery(event.target.value.trim()); //pass query to api call
    }
  };

  return (
    <div className="border-x-0 border-[#E4E8EB] border-y-2">
      <div className={style.wrapper}>
        <Link href="/">
          <div className={style.logoContainer}>
            <Image
              src={carbovalentLogo}
              height={200}
              width={200}
              alt="Carbovalent logo"
            />
          </div>
        </Link>

        <div className={style.searchBar}>
          <div className={style.searchIcon}>
            <AiOutlineSearch />
          </div>
          <input
            className={style.searchInput}
            placeholder="Search carbon projects, credits, and accounts"
            onKeyDown={handleSearchQuery}
          />
        </div>
        <div className={style.headerItems}>
          <Link href="/">
            <div className={style.headerItem}> Registry </div>
          </Link>
          <Link href="/bridge">
            <div className={style.headerItem}>Bridge</div>
          </Link>
          {/* <Link href="/fractionalize">
            <div className={style.headerItem}>Fractionalize</div>
          </Link> */}
          <Link href="/retire">
            <div className={style.headerItem}>Retire</div>
          </Link>
          <Link href="/account">
            <div className={style.headerIcon}>
              <CgProfile />
            </div>
          </Link>
          <div className={style.headerIcon}>
              <HiOutlineShoppingCart/>
          </div>
          <div className={style.headerIcon}>
            <WalletMultiButtonDynamic />
          </div>
        </div>
      </div>
    </div>
  );
}
