
export function RegistryFilter() {
  return (
    <>
      <div class="flex flex-col ml-5 max-w-[160px] ">
        <div className="form-control">
          <label className="label cursor-pointer text-base">
            <span className="label-text">Claimed</span>
            <input type="checkbox" checked className="checkbox" />
          </label>
        </div>
      </div>
    </>
  );
}
