import { Item, ItemData } from "./item";
import React from "react";

type Props = {
  items: Array<ItemData> | undefined;
};

export function ItemList({ items }: Props) {
  if (!items) {
    return null;
  }

  return (
    <div className="fract-container grid grid-cols-3 gap-[1.25rem] mx-auto auto-rows-fr justify-center">
      {items.length === 0 ? (
        <p className="p-4">No NFTs in your wallet</p>
      ) : (
        items.map((item) => <Item data={item} key={item.tokenAddress} />)
      )}
    </div>
  );
}
