import { RiArrowDropDownLine } from "react-icons/ri";

export function RegistryFilter() {
  return (
    <>
      <div class="absolute flex flex-col ml-5 filter-container">
        <div className="form-control ">
          <div className="collapse">
            <input type="checkbox" />

            <label className="label collapse-title">
              <span className="text-lg font-bold">Status {""}</span>
              <RiArrowDropDownLine size={50} className=" " />
            </label>

            <div className="collapse-content">
              <label className="label cursor-pointer text-base max-w-[160px]">
                <span className="text-base">Claimed</span>
                <input type="checkbox" checked className="checkbox" />
              </label>
            </div>
          </div>
        </div>
        <div className="form-control ">
          <div className="collapse">
            <input type="checkbox" />

            <label className="label collapse-title">
              <span className="text-lg font-bold">Vintage {""}</span>
              <RiArrowDropDownLine size={50} className=" " />
            </label>

            <div className="collapse-content">
              <label className="label cursor-pointer text-base min-w-[160px]">
                <span className="text-base">Claimed</span>
                <input type="checkbox" checked className="checkbox" />
              </label>
            </div>
          </div>
        </div>
        <div className="form-control ">
          <div className="collapse">
            <input type="checkbox" />

            <label className="label collapse-title">
              <span className="text-lg font-bold">Quantity {""}</span>
              <RiArrowDropDownLine size={50} className=" " />
            </label>

            <div className="collapse-content">
              <label className="label cursor-pointer text-base min-w-[160px]">
                <span className="text-base">Claimed</span>
                <input type="checkbox" checked className="checkbox" />
              </label>
            </div>
          </div>
        </div>
        <div className="form-control ">
          <div className="collapse">
            <input type="checkbox" />

            <label className="label collapse-title">
              <span className="text-lg font-bold">Country {""}</span>
              <RiArrowDropDownLine size={50} className=" " />
            </label>

            <div className="collapse-content">
              <label className="label cursor-pointer text-base min-w-[160px]">
                <span className="text-base">Claimed</span>
                <input type="checkbox" checked className="checkbox" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
