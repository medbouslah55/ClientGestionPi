import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  DropdownItem,
  Form,
  Card,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Col,
  Button,
  RSelect,
} from "../../../components/Component";
import { userData } from "../../pre-built/user-manage/UserData";
import { useForm } from "react-hook-form";
import { UserContext } from "../../pre-built/user-manage/UserContext";
import api from "../../../api";
import { statusOptions } from "../../pre-built/trans-list/TransData";

const Students_Coo = () => {

  const [selectedFile,SetselectedFile]=useState(null);

  // On file select (from the pop up) 
  const onFileChange = event => { 
    // Update the state 
    SetselectedFile( event.target.files[0] ); 
  }; 
   
  // On file upload (click the upload button) 
  const onFileUpload = () => { 
    // Create an object of formData 
   let formData = new FormData(); 
   
   formData = {...formData , "file" : selectedFile}
    // Send formData object 
    const url =  'http://127.0.0.1:8000/app/upload/student/';

    axios({
      method: 'POST',
      url: url,
      headers: {
          "Content-Type": 'multipart/form-data'
      },
      data: formData,
  })}; 

  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;

  const [sm, updateSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
    import: false,
  });
  const [formData, setFormData] = useState({
    EtudiantName: "",
    EtudiantClass: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [etudiants, SetEtudiants] = useState([]);

  const retrieveEtudiants = async () => {
    const response = await api.get("/etudiant");
    return response.data;
  }
  useEffect(() => {
    const getAllEtudiant = async () => {
      const allEtudiant = await retrieveEtudiants();
      if (allEtudiant) {SetEtudiants(allEtudiant); setData(allEtudiant)};
    };
    getAllEtudiant();
  }, []);
  const onFormAddSubmit = async () => {
    const response = await api.post("/etudiant",formData);
  };

  // unselects the data on mount
  useEffect(() => {
    let newData;
    newData = userData.map((item) => {
      item.checked = false;
      return item;
    });
    setData([...newData]);
  }, []);

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = userData.filter((item) => {
        return (
          item.name.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.email.toLowerCase().includes(onSearchText.toLowerCase())
        );
      });
      setData([...filteredObject]);
    } else {
      setData([...userData]);
    }
  }, [onSearchText, setData]);
  
  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
        EtudiantName: "",
        EtudiantClass: "",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false, import: false });
    resetForm();
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = etudiants.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register } = useForm();
  return (
    <React.Fragment>
      <Head title="User List - Regular"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Students_Coo
              </BlockTitle>
              {/* <BlockDes className="text-soft">
                <p>You have total 2,595 users.</p>
              </BlockDes> */}
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button color="light" outline className="btn-white" onClick={() => setModal({ import: true })}>
                        <Icon name="download-cloud"></Icon>
                        <span>Import</span>
                      </Button>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button color="primary" className="btn-icon" onClick={() => setModal({ add: true })}>
                        <Icon name="plus"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Card className="card-bordered card-stretch">
            <div className="card-inner-group">
              <div className="card-inner">
                <div className="card-title-group">
                  <div className="card-title">
                    <h5 className="title">All Students</h5>
                  </div>
                  <div className="card-tools mr-n1">
                    <ul className="btn-toolbar">
                      <li>
                        <Button onClick={toggle} className="btn-icon search-toggle toggle-search">
                          <Icon name="search"></Icon>
                        </Button>
                      </li>
                      <li className="btn-toolbar-sep"></li>
                      <li>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                            <Icon name="setting"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
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
                                    sortingFunc("dsc");
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
                                    sortingFunc("asc");
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
                  <div className={`card-search search-wrap ${!onSearch ? "active" : ""}`}>
                    <div className="search-content">
                      <Button
                        className="search-back btn-icon toggle-search"
                        onClick={() => {
                          setSearchText("");
                          toggle();
                        }}
                      >
                        <Icon name="arrow-left"></Icon>
                      </Button>
                      <input
                        type="text"
                        className="form-control border-transparent form-focus-none"
                        placeholder="Search by bill name"
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
              <div className="card-inner p-0">
                <table className="table table-tranx">
                  <thead>
                    <tr className="tb-tnx-head">
                      <th className="tb-tnx-id">
                        <span className="">#</span>
                      </th>
                      <th className="tb-tnx-info">
                        <span className="tb-tnx-desc d-none d-sm-inline-block">
                          <span>Nom & Prénom </span>
                        </span>
                        <span className="tb-tnx-date d-md-inline-block d-none">
                          {/* <span className="d-md-none">Date</span> */}
                          <span className="d-none d-md-block">
                            <span>Classe</span>
                            <span>Nom d'équipe</span>
                          </span>
                        </span>
                      </th>
                      {/* <th className="tb-tnx-amount is-alt">
                        <span className="tb-tnx-total">Total</span>
                        <span className="tb-tnx-status d-none d-md-inline-block">Status</span>
                      </th> */}
                      <th className="tb-tnx-action">
                        <span>&nbsp;</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0
                      ? etudiants.map((etudiant) => {
                        return (
                          <tr key={etudiant.EtudiantId} className="tb-tnx-item">
                            <td className="tb-tnx-id">
                              <a
                                href="#ref"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>{etudiant.EtudiantId}</span>
                              </a>
                            </td>
                            <td className="tb-tnx-info">
                              <div className="tb-tnx-desc">
                                <span className="title">{etudiant.EtudiantName}</span>
                              </div>
                              <div className="tb-tnx-date">
                                <span className="date">{etudiant.EtudiantClass}</span>
                                <span className="date">....</span>
                              </div>
                            </td>
                            {/* <td className="tb-tnx-amount is-alt">
                              <div className="tb-tnx-total">
                                <span className="amount">$...</span>
                              </div>
                              <div className="tb-tnx-status">
                                <span
                                  className={`badge badge-dot badge-${item.status === "Paid" ? "success" : item.status === "Due" ? "warning" : "danger"
                                    }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                            </td> */}
                            <td className="tb-tnx-action">
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  tag="a"
                                  className="text-soft dropdown-toggle btn btn-icon btn-trigger"
                                >
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-plain">
                                    <li
                                      onClick={() => {
                                        loadDetail(item.id);
                                        setViewModal(true);
                                      }}
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#view"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        View
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#print"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        Print
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        );
                      })
                      : null}
                  </tbody>
                </table>
              </div>
              <div className="card-inner">
                {etudiants.length > 0 ? (
                  // <PaginationComponent
                  //   noDown
                  //   itemPerPage={itemPerPage}
                  //   totalItems={data.length}
                  //   paginate={paginate}
                  //   currentPage={currentPage}
                  // />
                  <div></div>
                ) : (
                  <div className="text-center">
                    <span className="text-silent">No data found</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Block>
        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add Student</h5>
              <div className="mt-4">
                <Form className="row gy-4 mt-4" onSubmit={onFormAddSubmit}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Nom & Prénom</label>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="text"
                        name="EtudiantName"
                        value={formData.EtudiantName}
                        onChange={(e) => setFormData({ ...formData, EtudiantName: e.target.value })}
                        placeholder="Enter name"
                      />
                      {errors.bill && <span className="invalid">{errors.bill.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Classe</label>
                      <input
                        className="form-control"
                        // ref={register({ required: "This field is required" })}
                        type="text"
                        name="EtudiantClass"
                        placeholder="Enter class"
                        value={formData.EtudiantClass}
                        onChange={(e) => setFormData({ ...formData, EtudiantClass: e.target.value })}
                      />
                      {errors.total && <span className="invalid">{errors.total.message}</span>}
                    </FormGroup>
                  </Col>
                  {/* <Col md="6">
                    <FormGroup>
                      <label className="form-label">Issue Date</label>
                      <DatePicker
                        selected={formData.issue}
                        className="form-control"
                        onChange={(date) => setFormData({ ...formData, issue: date })}
                        minDate={new Date()}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Due Date</label>
                      <DatePicker
                        selected={formData.due}
                        className="form-control"
                        onChange={(date) => setFormData({ ...formData, due: date })}
                        minDate={new Date()}
                      />
                    </FormGroup>
                  </Col> */}
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Groupe</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={statusOptions}
                          // defaultValue={{ value: "Paid", label: "Paid" }}
                          // onChange={(e) => setFormData({ ...formData, status: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add Student
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
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={modal.import}
          toggle={() => setModal({ import: false })}
          className="modal-dialog-centered"
          size="lg"
        >
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
              <h5 className="title">Import Student</h5>
              <div className="mt-4">
                <Form className="row gy-4" noValidate>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Import</label>
                      <div>
                        <input type={"file"} id={"csvFileInput"} accept={".csv"} onChange={onFileChange} />
                      </div>
                      {/* <input type="file" onChange={this.onFileChange} /> 
                <button onClick={this.onFileUpload}> 
                  Upload! 
                </button>  */}
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button
                          color="primary"
                          size="md"
                          onClick={onFileUpload}
                        >
                         Import
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
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update User</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "This field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Balance</label>
                      <input
                        className="form-control"
                        type="number"
                        name="balance"
                        disabled
                        defaultValue={parseFloat(formData.balance.replace(/,/g, ""))}
                        placeholder="Balance"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.balance && <span className="invalid">{errors.balance.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        defaultValue={Number(formData.phone)}
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus}
                          defaultValue={{
                            value: formData.status,
                            label: formData.status,
                          }}
                          onChange={(e) => setFormData({ ...formData, status: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Update User
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
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal> */}
      </Content>
    </React.Fragment>
  );
};
export default Students_Coo;
