import React from 'react'

const GridRows = ({itemsPerPage,handleRowschange}) => {
  return (
    <>
          <div className="flex gap-3 items-center">
            <div className=" font-medium">showing</div>
            <select
                
                className="border max-w-md border-gray-300 focus:ring-2 outline-none p-2 rounded-md  text-sm text-gray-900   focus:ring-blue-400  "
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