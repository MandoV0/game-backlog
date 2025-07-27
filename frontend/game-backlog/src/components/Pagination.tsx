import React from 'react'
import '../styles/Pagination.css'

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageChange(Number(e.target.value));
  }


  return (
    <div className='pagination-container'>
      <button
        className='pagination-next-prev-btn'
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <span className='pagination-label'>Page {currentPage}</span>

      <button
        className='pagination-next-prev-btn'
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

    </div>
  )
};

export default Pagination