import "./Pagination.scss";

type Data = {
  currentPage: number;
  total: number;
};

type PaginationProps = {
  data: Data;
  setUrl: (url: string) => void;
  url: string;
};

type PageNumberProps = {
  pageNumber: number;
  changePage: (pageNumber: number) => void;
  currentPage: number;
};

export const Pagination = ({ data, setUrl, url }: PaginationProps) => {
  const { currentPage, total } = data;

  function changePage(pageNumber: number) {
    const apiUrl = new URL(url);

    if (apiUrl.searchParams.has("page")) {
      // Check if the 'page' parameter exists before setting the new value
      apiUrl.searchParams.set("page", pageNumber.toString());
    } else {
      // If 'page' parameter doesn't exist, add it
      apiUrl.searchParams.append("page", pageNumber.toString());
    }

    const newUrl: string = apiUrl.toString();

    setUrl(newUrl);
  }

  const firstPage = currentPage === 1;
  const lastPage = currentPage === total;

  function goBack() {
    if (firstPage) return;
    changePage(currentPage - 1);
  }
  function goForword() {
    if (lastPage) return;
    changePage(currentPage + 1);
  }

  const renderPageNumbers = () => {
    let pageNumbers: JSX.Element[] = [];
    const pagesToShow = 5;

    if (total <= pagesToShow) {
      for (let i = 1; i <= total; i++) {
        pageNumbers.push(
          <PageNumber
            key={i}
            pageNumber={i}
            changePage={changePage}
            currentPage={currentPage}
          />
        );
      }
    } else {
      const isStartEllipsisVisible = currentPage > Math.ceil(pagesToShow / 2);
      const isEndEllipsisVisible =
        currentPage < total - Math.floor(pagesToShow / 2);

      if (isStartEllipsisVisible) {
        pageNumbers.push(
          <PageNumber
            key={1}
            pageNumber={1}
            changePage={changePage}
            currentPage={currentPage}
          />
        );
        if (currentPage < 5) {
          const updatedElements = pageNumbers.filter(
            (element) => element.key !== "ellipsis-start"
          );
          pageNumbers = [...updatedElements];
        } else {
          pageNumbers.push(<span key="ellipsis-start">...</span>);
        }
      }

      const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
      const endPage = Math.min(total, startPage + pagesToShow - 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PageNumber
            key={i}
            pageNumber={i}
            changePage={changePage}
            currentPage={currentPage}
          />
        );
      }

      if (isEndEllipsisVisible) {
        pageNumbers.push(<span key="ellipsis-end">...</span>);
        pageNumbers.push(
          <PageNumber
            key={total}
            pageNumber={total}
            changePage={changePage}
            currentPage={currentPage}
          />
        );
      }
    }

    return pageNumbers;
  };

  if (!currentPage || !total) return;
  return (
    <div className="pagination-wrapper">
      <button
        onClick={goBack}
        disabled={firstPage}
        className="pagination-arrow"
      >
        &#11164;
      </button>
      {renderPageNumbers()}
      <button
        onClick={goForword}
        disabled={lastPage}
        className="pagination-arrow"
      >
        &#11166;
      </button>
    </div>
  );
};

const PageNumber = ({
  pageNumber,
  changePage,
  currentPage,
}: PageNumberProps) => {
  let className = "page-number";
  if (currentPage === pageNumber) {
    className += " selected";
  }
  return (
    <span className={className} onClick={() => changePage(pageNumber)}>
      {pageNumber}
    </span>
  );
};
