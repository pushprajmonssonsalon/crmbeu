import { useEffect, useMemo, useState } from 'react';
import useDebouncer from '../../utils/hooks/useDebouncer';
import { formatDateToFull, postApiData } from '../../utils/services';
import { IoMdPrint } from 'react-icons/io';
import exportToExcel from '../../utils/exportToExcel';
import CustomTable from '../../components/Table/CustomTable';
import { useNavigate } from 'react-router';
import AdvanceTable from '../../components/Table/AdvanceTable';
import GridRows from '../../components/pagination/gridRows';
import Pagination from '../../components/pagination';

const AdvanceHistory = () => {
    const [advances, setAdvances] = useState([]);
   
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);


    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleRowschange = (e) => {
        const { value } = e.target;
        setRowsPerPage(+value);
        // find the first item index of the current page
        const firstItemIndex = (page - 1) * rowsPerPage;

        // calculate the new page based on item index
        const newPage = Math.floor(firstItemIndex / value) + 1;

        setRowsPerPage(value);
        setPage(newPage);
    };
    const fetchLogs = (data) => {
        postApiData(`advance/getAllAdvance?page=${page}&limit=${rowsPerPage}`,
            {},
            (res) => {

                setAdvances(res?.advance?.map((elm) => ({
                        ...elm,
                        advance: `₹ ${elm?.advance?.balance || 0}`
                    })));
                setPage(res?.page)
                setRowsPerPage(res?.limit)
                setTotal(res?.total)

            },
            (err) => {

            }
        )
    }



    const headings = [
        {
            id: "name",
            name: "Customer Name",
        },
        {
            id: "phoneNumber",
            name: "Customer Phone",

        },
        {
            id: "advance",
            name: "Advance Balance"
        },


    ];

    const handleExport = () => {
        if (advances?.length > 0)
            exportToExcel(advances, "AdvancesHistory", "Advances.xlsx");
    };

   


    useEffect(() => {


        fetchLogs()
        return () => { }


    }, [page, rowsPerPage])
    return (
        <>
            <div className=" rounded-[16px] border border-primaryGray p-5  ">

                <div className="flex items-center mb-6 justify-between">

                    <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Advance History</h2>

                        <button disabled={advances?.length===0} onClick={handleExport} className='bg-ternary text-white rounded-[16px] w-[110px] text-sm font-normal '>Export All</button>

                </div>
                {advances?.length > 0 && <div className="w-full">

                    <AdvanceTable
                        rows={advances}
                        columns={headings}
                    />
                    <div className="flex justify-between mt-4 items-center">
                        <GridRows
                            totalItems={total}
                            itemsPerPage={rowsPerPage}
                            handleRowschange={handleRowschange}
                        />
                        <Pagination
                            totalItems={total}
                            itemsPerPage={rowsPerPage}
                            currentPage={page}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>}
            </div>






        </>

    )
}

export default AdvanceHistory