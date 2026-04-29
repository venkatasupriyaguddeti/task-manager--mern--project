import React from "react";

export default function Pagination({ meta, onPageChange }) {
  if (!meta) return null;

  const { page, totalPages, hasPrevPage, hasNextPage } = meta;

  const goPrev = () => hasPrevPage && onPageChange(page - 1);
  const goNext = () => hasNextPage && onPageChange(page + 1);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <button className="btn btn-outline-secondary" disabled={!hasPrevPage} onClick={goPrev}>
        Prev
      </button>

      <div className="text-muted">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </div>

      <button className="btn btn-outline-secondary" disabled={!hasNextPage} onClick={goNext}>
        Next
      </button>
    </div>
  );
}
