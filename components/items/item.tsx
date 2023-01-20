import React from "react";

export type ItemData = {
  collectionAddress: string;
  collectionName: string;
  imageUrl: string;
  name: string;
  tokenAddress: string;
  traits: Array<{ trait_type: string; value: string }>;
};

type Props = {
  data: ItemData;
};

export function Item({ data }: Props) {
  const name = data.name;
  const collection = data.collectionName;

  return (
    <div className="font-extralight px-0 m-auto">
      <div className="justify-items-center px-3 py-2">
        <div className="grid  justify-items-center">
          <div className="card shadow-xl">
            {data.imageUrl && (
              <figure>
                <img
                  className="fract-img	"
                  src={data.imageUrl}
                  alt={`Picture of ${name}`}
                />
              </figure>
            )}

            <div className="card-body">
              <h2 className="card-title">{name}</h2>
              {/* {collection && <p>{collection}</p>} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
