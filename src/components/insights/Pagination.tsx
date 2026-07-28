import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/insights",
}: {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-6">
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="rounded-full border border-lavender-30 px-5 py-2 text-sm text-linen transition-colors hover:border-lavender hover:text-lavender"
        >
          ← Newer
        </Link>
      ) : (
        <span aria-hidden="true" className="px-5 py-2 text-sm text-linen-50/40">
          ← Newer
        </span>
      )}
      <p className="text-sm text-linen-50">
        Page {currentPage} of {totalPages}
      </p>
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="rounded-full border border-lavender-30 px-5 py-2 text-sm text-linen transition-colors hover:border-lavender hover:text-lavender"
        >
          Older →
        </Link>
      ) : (
        <span aria-hidden="true" className="px-5 py-2 text-sm text-linen-50/40">
          Older →
        </span>
      )}
    </nav>
  );
}
