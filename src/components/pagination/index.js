import React from "react";
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
      <div className="flex justify-center items-center mb-6 ">
        <FcPrevious 
          onClick={() => handlePageChange(currentPage - 1)}
          className={`mx-1 rounded-lg hover:bg-black text-white text-2xl ${currentPage === 1 ? 'opacity-50 ' : ''}`}
        />
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${currentPage === page ? 'bg-black  text-white' : ''} mx-1 p-2 rounded-lg hover:bg-black`}
          >
            {page}
          </button>
        ))}
        <FcNext 
          onClick={() => handlePageChange(currentPage + 1)}
          className={`mx-1 rounded-lg hover:bg-black text-2xl ${currentPage === totalPages ? 'opacity-50 ' : ''}`}
        />
      </div>
    );
};

export default Pagination;
