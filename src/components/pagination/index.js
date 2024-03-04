import React from "react";
import { FcPrevious } from "react-icons/fc";
import { FcNext } from "react-icons/fc";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  
    return (
      <div className="flex justify-center items-center mb-6 ">
        {/* <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 rounded-lg hover:bg-black bg-blue-600"
        >
          Prev
        </button> */}
        <FcPrevious   onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 rounded-lg hover:bg-black  text-white text-2xl"/>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${currentPage === page ? 'bg-black text-white' : ''} mx-1 rounded-lg hover:bg-black`}
          >
            {page}
          </button>
        ))}
        {/* <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 rounded-lg hover:bg-black bg-blue-600"
        >
          Next
        </button> */}
        <FcNext 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 rounded-lg hover:bg-black text-2xl"
        />
      </div>
    );
};

export default Pagination;
