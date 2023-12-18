import React, { useState, useEffect } from "react";
import { Container, Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PAGE_SIZE = 10;
const MAX_PAGES_DISPLAYED = 5;

const getHistoryDataFromAPI = async (page) => {
  try {
    const response = await fetch(`http://localhost:8000/api/history?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return [];
  }
};

const generatePageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const halfMaxPages = Math.floor(MAX_PAGES_DISPLAYED / 2);

  if (totalPages <= MAX_PAGES_DISPLAYED) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const startPage = Math.max(1, currentPage - halfMaxPages);
    const endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1);

    if (startPage > 1) {
      pages.push(1, null);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      pages.push(null, totalPages);
    }
  }

  return pages;
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await getHistoryDataFromAPI(currentPage);
      setHistory(apiData.data);
      setTotalPages(apiData.totalPages);
    };

    fetchData();
  }, [currentPage]);

  if (!history || history.length === 0) {
    return <div>No history data available.</div>;
  }

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <Container className="mt-4">
      <div>
        <h3>History</h3>
        <table className="table table-striped table-bordered" style={{ marginTop: '60px' }}>
          <thead>
            <tr>
              <th>Action</th>
              <th>Device</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.action}</td>
                <td>{item.device}</td>
                <td>{new Date(item.time).toLocaleString()}</td>              
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination>
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index} active={currentPage === page}>
              {page !== null ? (
                <PaginationLink onClick={() => handlePageClick(page)}>
                  {page}
                </PaginationLink>
              ) : (
                <PaginationLink disabled>...</PaginationLink>
              )}
            </PaginationItem>
          ))}
        </Pagination>
      </div>
    </Container>
  );
};

export default History;
