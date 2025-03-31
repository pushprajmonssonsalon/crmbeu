import { FcPrevious } from "react-icons/fc";
import { FcNext } from "react-icons/fc";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let startPage = Math.max(1, currentPage - 4);
  let endPage = Math.min(totalPages, startPage + 9);
  startPage = Math.max(1, endPage - 9);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

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
    <div className="flex justify-center items-center ">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={` flex items-center justify-center   text-white  `}
      >
        <FcPrevious
          className="text-md text-ternaryGray"
        />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={` ${currentPage === page ? 'text-black' : 'text-ternaryGray'} `}
        >
          {page}
        </button>
      ))}
      <button
        className={` rounded-[100%] w-[40px] h-[40px] flex items-center justify-center   text-white  `}
        onClick={() => handlePageChange(currentPage + 1)}

        disabled={currentPage === totalPages}
      >
        <FcNext
          className="text-md text-ternaryGray"

        />
      </button>
    </div>
  );
};

export default Pagination;
