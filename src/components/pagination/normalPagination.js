import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const NormalPagination = ({onPageChange,currentPage,totalItems,itemsPerPage}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const handlePageChange = (page) => {
        
        if (page < 1) {
            onPageChange(totalPages);
        } else if (page > totalPages) {
            onPageChange(1);
        } else {
            onPageChange(page);
        }
    };

  return (
    <>
    <div className="flex items-center">
    <MdNavigateBefore
                  size={25}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="text-gray-500 w-9 h-9 cursor-pointer   rounded-[100%] p-1 bg-none hover:bg-gray-300 transition-colors duration-100 "
                />

                <MdNavigateNext
                  size={25}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="text-gray-500 w-9 h-9 cursor-pointer   rounded-[100%] p-1 bg-none hover:bg-gray-300 transition-colors duration-100 "
                />
    </div>

    </>
  )
}

export default NormalPagination