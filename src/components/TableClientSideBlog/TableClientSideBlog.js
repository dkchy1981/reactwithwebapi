import React, { useState } from "react";

const TableHeader = ({
  headers,
  onSortColumnChange,
  sortColumn,
  sortDirection,
}) => {
  const handleHeaderClick = (column) => {
    onSortColumnChange(column);
  };

  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th
            key={header.column}
            onClick={() => handleHeaderClick(header.column)}
          >
            {header.label}{" "}
            {sortColumn === header.column && (
              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableBody = ({
  headers,
  data,
  currentPage,
  itemsPerPage,
  sortColumn,
  sortDirection,
  isLoading,
}) => {
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  // Sort data based on the default sorting column and direction
  const sortedData = [...data].sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];

    if (columnA < columnB) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (columnA > columnB) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  // const paginatedData = data.slice(startIdx, endIdx);
  const paginatedData = sortedData.slice(startIdx, endIdx);

  return (
    <>
      <tbody>
        {!isLoading &&
          paginatedData.map((item) => (
            <tr key={item.ActiveDirectoryId}>
              {headers.map((header) => (
                <td key={header.column}>{item[header.column]}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </>
  );
};

const Pagination = ({
  currentPage,
  totalNumberOfPages,
  itemsPerPageForPagination,
  handlePageChange,
  maxPageNumbers = 5, // Set the maximum number of page numbers to display
}) => {
  const pageNumbers = Array.from(
    { length: totalNumberOfPages },
    (_, index) => index + 1
  );

  const renderPageNumbers = () => {
    if (totalNumberOfPages <= maxPageNumbers) {
      return pageNumbers;
    }

    const middleIndex = Math.floor(maxPageNumbers / 2);

    if (currentPage <= middleIndex) {
      // Display pages from 1 to maxPageNumbers
      return [
        ...pageNumbers.slice(0, maxPageNumbers - 1),
        "...",
        totalNumberOfPages,
      ];
    } else if (currentPage >= totalNumberOfPages - middleIndex) {
      // Display pages from totalNumberOfPages - maxPageNumbers + 2 to totalNumberOfPages
      return [1, "...", ...pageNumbers.slice(-maxPageNumbers + 1)];
    } else {
      // Display pages around the current page
      const startPage = currentPage - middleIndex + 1;
      const endPage = currentPage + middleIndex - 1;
      return [
        1,
        "...",
        ...pageNumbers.slice(startPage, endPage),
        "...",
        totalNumberOfPages,
      ];
    }
  };

  return (
    <div className="row justify-content-between">
      <div className="col-md-3 col-sm-12 text-start">
        Showing {(currentPage-1)*itemsPerPageForPagination} to {currentPage *itemsPerPageForPagination } of {totalNumberOfPages} entries
      </div>
      <div className="col-md-3 col-sm-12 text-end">
        <div className="pagination">
          <li className="page-item">
            <button
              className={"page-link " + (currentPage === 1 ? "disabled" : "")}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >{`<`}</button>
          </li>
          {renderPageNumbers().map((pageNumber, index) => (
            <li key={index} className="page-item">
              <button
                className={`page-link ${
                  currentPage === pageNumber ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              className={
                "page-link " +
                (currentPage === totalNumberOfPages ? "disabled" : "")
              }
              onClick={() => handlePageChange(totalNumberOfPages)}
              disabled={currentPage === totalNumberOfPages}
            >{`>`}</button>
          </li>
        </div>
      </div>
    </div>
  );
};

const Table = ({ headers, data, isLoading, loadingTag }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState(""); // Added state for search
  const [itemsPerPage, setItemsPerPage] = useState(5); // Added state for itemsPerPage
  const [sortColumn, setSortColumn] = useState(headers[0].column); // Default sorting column
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction

  // Added filteredData variable to hold filtered data based on search
  const filteredData = data.filter((item) =>
    headers.some((header) =>
      String(item[header.column])
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    )
  );

  const totalNumberOfPages = Math.ceil(filteredData.length / itemsPerPage);
  const itemsPerPageForPagination = itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortColumnChange = (column) => {
    // Toggle sort direction if the same column is clicked again
    if (sortColumn === column) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  return (
    <>
      <div className="row justify-content-between">
        <div className="col-md-3 col-sm-12 text-start">
          <div className="input-group">
            <span className="input-group-text" htmlFor="inputGroupSelect01">
              Show
            </span>
            {/* <div style={{ width: '200px' }}> */}
            <div>
              <select
                className="form-control form-select"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value, 10));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span className="input-group-text" id="inputGroupSelect02">
              entries
            </span>
            {/* {buttonAdd} */}
          </div>
        </div>
        <div className="col-md-3 col-sm-12 text-end">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search all columns"
            />
          </div>
        </div>
      </div>
      <br></br>

      <div className="table-responsive">
        <table className="table table-bordered table-responsive">
          <TableHeader
            headers={headers}
            onSortColumnChange={handleSortColumnChange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
          <TableBody
            headers={headers}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            isLoading={isLoading}
            loadingTag={loadingTag}
          />
        </table>
      </div>
      {isLoading ? (
        <div style={{ textAlign: "center", width: "200px", margin: "0 auto" }}>
          <p>{loadingTag}</p>
        </div>
      ) : (
        ""
      )}

      <Pagination
        currentPage={currentPage}
        totalNumberOfPages={totalNumberOfPages}
        itemsPerPageForPagination={itemsPerPageForPagination}
        handlePageChange={handlePageChange}
      />
    </>
  );
};

export default Table;