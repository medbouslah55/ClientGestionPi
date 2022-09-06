import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import api from '../../../api'
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  ModalBody,
  Modal,
  DropdownItem,
  Form,
} from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  RSelect,
} from "../../../components/Component";
import {orderData } from "../../pre-built/trans-list/TransData";
import {Options,Option} from '../Options'
import { useForm } from "react-hook-form";

const Theme = () => {
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    add: false,
  });
  const [data, setData] = useState(orderData);
  const [formData, setFormData] = useState({
    label: "",
    ThemeOption: "",
    ThemeDescription: "", 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [themes, SetThemes] = useState([]);
  const [advancedFilter, SetAdvancedFilter] = useState("Any Class");

  const retrieveThemes = async () => {
    if (advancedFilter === "Any Class") {
      const response = await api.get("/theme");
      return response.data;
    }
    else {
      const response = await api.get("/theme/"+ advancedFilter);
      return response.data;
    }
  }

  useEffect(() => {
    const getAllTheme = async () => {
      const allTheme = await retrieveThemes();
      if (allTheme) {
        SetThemes(allTheme);
      };
    };
    getAllTheme();
  }, [advancedFilter]);

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.ref.localeCompare(b.ref));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.ref.localeCompare(a.ref));
      setData([...sortedData]);
    }
  };

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = orderData.filter((item) => {
        return item.ref.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...orderData]);
    }
  }, [onSearchText]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      label: "",
      ThemeOption: "",
      ThemeDescription: "",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ add: false });
    resetForm();
  };

  const onFormAddSubmit = async () => {
    const response = await api.post("/theme", formData);
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = themes.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  const { errors, register } = useForm();
  // console.log(formData);
  console.log(advancedFilter);

  return (
    <React.Fragment>
      <Head title="Trasaction List - Crypto"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Themes</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {themes.length} themes.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <ul className="nk-block-tools g-3">
                <li>
                  <Button color="primary" className="btn-icon" onClick={() => setModal({ add: true })}>
                    <Icon name="plus"></Icon>
                  </Button>
                </li>
              </ul>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">All Themes</h5>
                </div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <UncontrolledDropdown>
                      
                        <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                          <Icon name="filter-alt"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right className="filter-wg dropdown-menu-xl">
                          <div className="dropdown-head">
                            <span className="sub-title dropdown-title">Advanced Filter</span>
                            <div className="dropdown">
                            </div>
                          </div>
                          <div className="dropdown-body dropdown-body-rg">
                            <Row className="gx-6 gy-4">
                              <Col size="12">
                                <FormGroup>
                                  <label className="overline-title overline-title-alt">Option</label>
                                  <RSelect options={Options} placeholder="Any Class"
                                    onChange={(e) => SetAdvancedFilter(e.value)}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                          <br /><br /><br /><br />
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                          <Icon name="setting"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right className="dropdown-menu-xs">
                          <ul className="link-check">
                            <li>
                              <span>Show</span>
                            </li>
                            <li className={itemPerPage === 10 ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setItemPerPage(10);
                                }}
                              >
                                10
                              </DropdownItem>
                            </li>
                            <li className={itemPerPage === 15 ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setItemPerPage(15);
                                }}
                              >
                                15
                              </DropdownItem>
                            </li>
                          </ul>
                          <ul className="link-check">
                            <li>
                              <span>Order</span>
                            </li>
                            <li className={sort === "dsc" ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setSortState("dsc");
                                  sortFunc("dsc");
                                }}
                              >
                                DESC
                              </DropdownItem>
                            </li>
                            <li className={sort === "asc" ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setSortState("asc");
                                  sortFunc("asc");
                                }}
                              >
                                ASC
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </ul>
                </div>
                <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                  <div className="search-content">
                    <Button
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                      className="search-back btn-icon toggle-search"
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by Order Id"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody bodyclass="nk-tb-tnx">
              <DataTableHead>
                <DataTableRow>
                  <span>#</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Label</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Option</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Description</span>
                </DataTableRow>
              </DataTableHead>

              {currentItems.length > 0
                ? currentItems.map((theme) => {
                  return (
                    <DataTableItem key={theme.ThemeId}>
                      <DataTableRow>
                        <div className="nk-tnx-type">
                          <span className="tb-lead-sub">{theme.ThemeId}</span>
                        </div>
                      </DataTableRow>
                      <DataTableRow>
                        <span className="tb-amount">{theme.label}</span>
                      </DataTableRow>
                      <DataTableRow >
                        <span className="tb-amount">{theme.ThemeOption}</span>
                      </DataTableRow>
                      <DataTableRow >
                        <span className="tb-amount">{theme.ThemeDescription}</span>
                      </DataTableRow>
                    </DataTableItem>
                  );
                })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  noDown
                  itemPerPage={itemPerPage}
                  totalItems={themes.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add Theme</h5>
              <Form className="mt-4" onSubmit={onFormAddSubmit} noValidate>
                <Row className="g-gs">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          name="Label"
                          value={formData.label}
                          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                          className="form-control"
                          ref={register({ required: "This field is required" })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Option</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={Option}
                          onChange={(e) => setFormData({ ...formData, ThemeOption: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="g-gs">
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Description</label>
                      <textarea
                        type="text"
                        name="ThemeDescription"
                        className="form-control"
                        value={formData.ThemeDescription}
                        onChange={(e) => setFormData({ ...formData, ThemeDescription: e.target.value })}
                      />
                      {errors.amountBTC && <span className="invalid">{errors.amountBTC.message}</span>}
                    </FormGroup>
                  </Col>
                </Row>
                <hr className="hr mt-2 border-light" />
                <Row className="gy-4">
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button type="submit" color="primary" size="md">
                          Add Theme
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Form>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};

export default Theme;
