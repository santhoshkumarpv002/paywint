export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null

  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
      >
        Previous
      </button>
      <span className="px-3 py-1 text-gray-600">
        Page {page} of {pages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  )
}
