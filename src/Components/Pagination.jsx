const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination-container">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate which page numbers to show
                let pageNum;
                if (totalPages <= 5) {
                    pageNum = i + 1;
                } else {
                    // To have the current page in center when we have 2 pages to the left and right.
                    let start = Math.max(1, currentPage - 2);
                    let end = Math.min(totalPages, start + 4);
                    start = Math.max(1, end - 4);
                    pageNum = start + i;
                }
                
                return (
                    <button
                        key={pageNum}
                        className={`page-button ${currentPage === pageNum ? "active" : ""}`}
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </button>
                );
            })}

            {/* Shows the next 100 pages for a easier navigation. */}
            <select className="page-select" value={currentPage} onChange={(e) => onPageChange(Number(e.target.value))}>
                {Array.from({ length: Math.min(100, totalPages - currentPage + 1) }, (_, i) => currentPage + i)
                    .map((pageNum) => (<option key={pageNum} value={pageNum}>{pageNum}</option>))}
            </select>
        </div>
    );
}
    
export default Pagination;