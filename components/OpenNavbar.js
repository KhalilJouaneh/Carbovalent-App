import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import carbovalentLogo from "/public/carbovalent_logo.png";
import { style } from "./Header.style.js";
import shallow from "zustand/shallow";

import { useStore } from "../store/store.ts";


export function OpenNavbar() {
  const [searchQuery, updateSearchQuery] = useStore(
    (state) => [state.searchQuery, state.updateSearchQuery],
    shallow
  );

  // require("@solana/wallet-adapter-react-ui/styles.css");

  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      updateSearchQuery(event.target.value);
      console.log("after search query: " + searchQuery);
    }
  };

  return (
    <div className="border-x-0 border-[#E4E8EB] border-y-2">
      <div className={style.wrapper}>
        <Link href="/">
          <div className={style.logoContainer}>
            <Image
              src={carbovalentLogo}
              height={220}
              width={220}
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
            onKeyDown={handleKeyDown}
            // onChange={(e) => updateSearchQuery(e.currentTarget.value)}
          />
        </div>
        <div className={style.headerItems}>
          <Link href="/registry">
            <div className={style.headerItem}> Registry </div>
          </Link>
          <Link href="/bridge">
            <div className={style.headerItem}>Bridge</div>
          </Link>
          <Link href="/">
            <div className={style.headerItem}>Fractionalize</div>
          </Link>
          <Link href="/">
            <div className={style.headerItem}>Retire</div>
          </Link>
          <Link href="/account">
            <div className={style.headerIcon}>
              <CgProfile />
            </div>
          </Link>
          <div className={style.headerIcon}>
            <WalletMultiButtonDynamic />
          </div>
        </div>
      </div>
    </div>
  );
}

// export default OpenNavbar;
