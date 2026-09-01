import React from 'react'

const AdvanceTable = ({columns,rows}) => {
  return (
    <>  <div className="table-responsive"> <table className="styled-table">
        <thead>
          <tr>
            <th className="bg-black text-white px-3 py-2">#</th>
            {columns?.map((column, index) => (
              <th key={index} className="bg-black text-white px-3 py-2">{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={index} className="bg-white">
              <td>{index + 1}</td>
              {columns?.map((column, index) => {

                const { id } = column;
                return <td>{row[id]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table></div></>
  )
}

export default AdvanceTable