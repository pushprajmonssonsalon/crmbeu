const GridRows = ({itemsPerPage,handleRowschange,totalItems}) => {
  return (
    <>
          <div className="flex gap-3 items-center">
            <div className="text-sm text-ternaryGray flex items-center gap-2">showing <span>{itemsPerPage||0} results</span><span>of</span> <span>{totalItems||0}</span> </div>
            <select
                
                className=" max-w-md bg-none  focus:ring-2 outline-none border-none p-0  text-sm text-gray-900   focus:ring-blue-400  "
                name="limit"
                value={itemsPerPage}
                onChange={handleRowschange}
              >
                <option ></option>
               {
                  [5,10,50,100]?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>
    </>
  )
}

export default GridRows