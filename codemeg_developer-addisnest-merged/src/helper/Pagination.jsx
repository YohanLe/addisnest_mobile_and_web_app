import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-main">
      <button
        className="pagination-arrow pagination-prev"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <span>
          <i class="fa fa-arrow-left" aria-hidden="true"></i>
        </span>
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        return (
          <button
            key={pageNum}
            className={`pagination-number ${
              currentPage === pageNum ? "active" : ""
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        className="pagination-arrow pagination-next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
        <span>
          <i class="fa fa-arrow-right" aria-hidden="true"></i>
        </span>
      </button>
    </div>
  );
};

export default Pagination;
