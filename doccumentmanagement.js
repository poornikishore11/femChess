import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import SearchBox from "../SearchBox";
import Box from "../Box";
import Table from "../Table";
import pdfDocIcon from "../../assets/images/pdfDocIcon.png";
import docxDocIcon from "../../assets/images/docxDocIcon.png";
import {
  ActionIcon,
  CheckboxContainer,
  ColumnSortButton,
  DocumentImageIcon,
  DocumentSvgIcon,
} from "./components/styled";
import icons from "../../assets/icons";
import Button from "../Button";
import { P } from "../Typography";
import Checkbox from "../Checkbox";

const iconMap = {
  pdf: pdfDocIcon,
  docx: docxDocIcon,
};

export const matchItemToInput = (item, input) => {
  const lcItem = item.toLowerCase();
  const lcInput = input.toLowerCase();
  return lcItem.includes(lcInput) || lcItem.includes(lcInput.replace(" ", ""));
};

const VIEWFLAGS = {
  TRUE: "True",
  FALSE: "False",
};

class DocumentManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      activeSortColumn: "",
      sortColumnStatus: {
        document_name: null,
        case_type: null,
        case_reference: null,
        created_date: null,
        created_by: null,
      },
      isEditingCustomerViewFlag: false,
      docs: props.documents,
      currentPage: 1,
      pageSize: 10,
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  //Reset Page to 1 when searching
  handleSearchChange = (event) => {
    this.setState({
      searchTerm: event.target.value.trim(),
      currentPage: 1,
    });
  };

  getFileExtension = (string) => {
    if (string) {
      const [extension] = string.split(".").reverse();
      return extension;
    }

    return "";
  };

  setSortColumn = (key) => {
    const { sortColumnStatus } = this.state;

    const columnStatusForKey = sortColumnStatus[key];
    let sortDirection;

    if (columnStatusForKey === null || columnStatusForKey === "desc") {
      sortDirection = "asc";
    } else {
      sortDirection = "desc";
    }

    this.setState({
      activeSortColumn: key,
      sortColumnStatus: {
        ...sortColumnStatus,
        [key]: sortDirection,
      },
    });
  };

  sortDocuments = (a, b) => {
    const { sortColumnStatus, activeSortColumn } = this.state;
    switch (activeSortColumn) {
      case "document_name":
      case "case_type":
      case "case_reference":
      case "created_by":
      case "customerCanView": {
        if (sortColumnStatus[activeSortColumn] === "asc") {
          return this.alphabetSort(a, b, activeSortColumn);
        } else {
          return this.alphabetSort(b, a, activeSortColumn);
        }
      }
      case "created_date": {
        if (sortColumnStatus[activeSortColumn] === "asc") {
          return this.dateSort(a, b, activeSortColumn);
        } else {
          return this.dateSort(b, a, activeSortColumn);
        }
      }
      default: {
        return false;
      }
    }
  };

  alphabetSort = (a, b, activeSortColumn) =>
    a[activeSortColumn].localeCompare(b[activeSortColumn], undefined, {
      sensitivity: "base",
    });

  dateSort = (a, b, activeSortColumn) =>
    Number(new Date(a[activeSortColumn])) -
    Number(new Date(b[activeSortColumn]));

  getColumn = (key, title, sortEnabled = true) => (
    <div className="d-flex">
      {title}
      {sortEnabled && (
        <ColumnSortButton
          onClick={() => this.setSortColumn(key)}
          className="ml-2"
        >
          {icons.swapVertical}
        </ColumnSortButton>
      )}
    </div>
  );

  handleCustomerViewChange = (attachmentId) => {
    this.setState((prevState) => {
      const updatedArray = prevState.docs.map((d) => {
        if (d.attachment_id === attachmentId) {
          return {
            ...d,
            customerCanView:
              d.customerCanView === VIEWFLAGS.TRUE
                ? VIEWFLAGS.FALSE
                : VIEWFLAGS.TRUE,
          };
        }
        return d;
      });

      return { ...prevState, docs: updatedArray };
    });
  };

  getFolderRoute = (url) => {
    const parts = url.split("/").filter(Boolean);
    return parts.slice(-3).join("/");
  };

  handleViewFlagsAction = () => {
    const { handleUpdateViewFlags } = this.props;
    const { isEditingCustomerViewFlag } = this.state;

    if (isEditingCustomerViewFlag) {
      const { docs } = this.state;
      const { documents: initialDocuments } = this.props;

      const truePaths = [];
      const falsePaths = [];

      docs.forEach((d) => {
        const folderRoute = this.getFolderRoute(d.folder_url);
        const fullPath = `${folderRoute}/${d.document_name}`;

        if (d.customerCanView === VIEWFLAGS.TRUE) {
          const initialDocument = initialDocuments.find(
            (doc) => d.attachment_id === doc.attachment_id,
          );

          if (
            initialDocument &&
            initialDocument.customerCanView !== d.customerCanView
          ) {
            truePaths.push(fullPath);
          }
        }

        if (d.customerCanView === VIEWFLAGS.FALSE) {
          const initialDocument = initialDocuments.find(
            (doc) => d.attachment_id === doc.attachment_id,
          );

          if (
            initialDocument &&
            initialDocument.customerCanView !== d.customerCanView
          ) {
            falsePaths.push(fullPath);
          }
        }
      });

      this.setState({ isEditingCustomerViewFlag: false }, () => {
        handleUpdateViewFlags({ truePaths, falsePaths, docs });
      });
    } else this.setState({ isEditingCustomerViewFlag: true });
  };

  render() {
    const {
      strings,
      isEmployee,
      addDocumentsHandler,
      downloadDoc,
      flagsUpdating,
      repairsUrl,
      casesUrl,
    } = this.props;

    const {
      searchTerm,
      isEditingCustomerViewFlag,
      docs,
      currentPage,
      pageSize,
    } = this.state;

    const docSearchResults = docs.filter((d) =>
      searchTerm.length > 2
        ? !searchTerm || matchItemToInput(d.document_name, searchTerm)
        : d,
    );

    const sortedDocs = [...docSearchResults].sort((a, b) =>
      this.sortDocuments(a, b),
    );

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentDocsPage = sortedDocs.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <Fragment>
        <div className="row pt-2">
          <div className="col-12 col-md-6">
            <SearchBox
              isFullWidth
              placeholder={strings.searchPlaceholder}
              onChange={(event) =>
                this.setState({ searchTerm: event.target.value.trim() })
              }
            />
          </div>
          {isEmployee && (
            <div className="col-12 col-md-6">
              <div className="d-flex justify-content-end">
                <Button
                  disabled={flagsUpdating || (docs && docs.length === 0)}
                  className="mr-3"
                  buttonType="secondary"
                  onClick={() => this.handleViewFlagsAction()}
                >
                  {isEditingCustomerViewFlag ? strings.save : strings.edit}
                </Button>
                <Button
                  buttonType="secondary"
                  onClick={() => addDocumentsHandler()}
                >
                  {strings.addDocuments}
                </Button>
              </div>
            </div>
          )}
          <Fragment>
            <Box
              className="container mt-4 mt-md-2 m-3 p-4"
              style={{ overflowX: "scroll" }}
            >
              {sortedDocs.length === 0 ? (
                <P>{strings.noResults}</P>
              ) : (
                <Fragment>
                  <Table
                    addExtraTd
                    addExtraTh
                    data={currentDocsPage.map((d) => [
                      <div className="d-flex">
                        {Object.keys(iconMap).includes(
                          this.getFileExtension(d.document_name),
                        ) ? (
                          <DocumentImageIcon
                            key={`imageIcon-${d.case_reference}`}
                            src={
                              iconMap[this.getFileExtension(d.document_name)]
                            }
                          />
                        ) : (
                          <DocumentSvgIcon>{icons.documents}</DocumentSvgIcon>
                        )}

                        <div className="flex-column align-self-center">
                          {d.document_name.slice(0, 20).concat(["..."])}
                        </div>
                      </div>,
                      d.case_type,
                      <a
                        href={`${
                          d.case_type === "Case"
                            ? `${casesUrl}/case/${d.caseId}`
                            : `${repairsUrl}/${d.caseId}`
                        }`}
                      >
                        {d.case_reference}
                      </a>,
                      d.created_date,
                      d.created_by,
                      <ActionIcon
                        onClick={() =>
                          downloadDoc(d.folder_url, d.document_name)
                        }
                      >
                        {icons.download}
                      </ActionIcon>,
                      ...(isEmployee
                        ? [
                            <CheckboxContainer>
                              <Checkbox
                                disabled={!isEditingCustomerViewFlag}
                                checked={d.customerCanView === VIEWFLAGS.TRUE}
                                onChange={() =>
                                  this.handleCustomerViewChange(d.attachment_id)
                                }
                              />
                            </CheckboxContainer>,
                          ]
                        : []),
                    ])}
                    headerData={[
                      this.getColumn("document_name", "Name"),
                      this.getColumn("case_type", "Case Type"),
                      this.getColumn("case_reference", "Reference"),
                      this.getColumn("created_date", "Created Date"),
                      this.getColumn("created_by", "Created By"),
                      this.getColumn(null, "Download", false),
                      ...(isEmployee
                        ? [
                            this.getColumn(
                              "customerCanView",
                              "Customer can view",
                            ),
                          ]
                        : []),
                    ]}
                    striped={false}
                    tdWrap={false}
                    topAlign={false}
                  />
                  <PaginationNumber
                    totalItems={sortedDocs.length}
                    itemsPerPage={this.state.pageSize}
                    currentPage={this.state.currentPage}
                    onPageChange={this.handlePageChange}
                  />
                </Fragment>
              )}
            </Box>
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

DocumentManager.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.shape({})),
  strings: PropTypes.shape({
    searchPlaceholder: PropTypes.string,
    tableHeadings: PropTypes.shape({}),
    edit: PropTypes.string,
    save: PropTypes.string,
    addDocuments: PropTypes.string,
    noResults: PropTypes.string,
  }),
  isEmployee: PropTypes.bool.isRequired,
  addDocumentsHandler: PropTypes.func,
  downloadDoc: PropTypes.func,
  handleUpdateViewFlags: PropTypes.func,
  flagsUpdating: PropTypes.bool.isRequired,
  repairsUrl: PropTypes.string.isRequired,
  casesUrl: PropTypes.string.isRequired,
};

DocumentManager.defaultProps = {
  documents: [],
  strings: {
    searchPlaceholder: "Search documents",
    filterBy: "Filter by",
    addDocuments: "Add documents",
    noResults: "No results found. Please refine your search.",
    edit: "Edit",
    save: "Save",
  },
  addDocumentsHandler: () => {},
  handleUpdateViewFlags: () => {},
};

export default DocumentManager;
