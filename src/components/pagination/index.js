import React from "react";
import { FcPrevious } from "react-icons/fc";
import { FcNext } from "react-icons/fc";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  
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
          className={`mx-1 rounded-lg hover:bg-black text-white text-2xl ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${currentPage === page ? 'bg-black text-white' : ''} mx-1 rounded-lg hover:bg-black`}
          >
            {page}
          </button>
        ))}
        <FcNext 
          onClick={() => handlePageChange(currentPage + 1)}
          className={`mx-1 rounded-lg hover:bg-black text-2xl ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
    );
};

export default Pagination;
