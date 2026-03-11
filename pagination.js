import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background: white;
  border-top: 1px solid #e0e0e0;
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #757575;
`;

const NavGroup = styled.div`
  display: flex;
  gap: 5px;
`;

const PageBtn = styled.button`
  border: 1px solid ${(props) => (props.$active ? "#e38601" : "#e0e0e0")};
  background: ${(props) => (props.$active ? "#e38601" : "white")};
  color: ${(props) => (props.$active ? "white" : "#4a4a4a")};
  padding: 5px 12px;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? "700" : "400")};

  &:hover:not(:disabled) {
    border-color: #e38601;
    color: ${(props) => (props.$active ? "white" : "#e38601")};
  }
`;

const PaginationNumber = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <PaginationWrapper>
      <PageInfo>
        Showing <strong>{start}</strong> to <strong>{end}</strong> of{" "}
        <strong>{totalItems}</strong> results
      </PageInfo>

      <NavGroup>
        <PageBtn
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </PageBtn>

        {pageNumbers.map((number) => (
          <PageBtn
            key={`page-${number}`}
            $active={currentPage === number}
            onClick={() => onPageChange(number)}
          >
            {number}
          </PageBtn>
        ))}

        <PageBtn
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </PageBtn>
      </NavGroup>
    </PaginationWrapper>
  );
};

PaginationNumber.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationNumber;
