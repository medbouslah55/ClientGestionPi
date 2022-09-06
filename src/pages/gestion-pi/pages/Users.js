import React, { useContext, useEffect, useState } from "react";
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
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  UserAvatar,
  PaginationComponent,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  TooltipComponent,
  RSelect,
} from "../../../components/Component";
import { filterRole, filterStatus, userData } from "../../pre-built/user-manage/UserData";
import { bulkActionOptions, findUpper } from "../../../utils/Utils";
import { TuteurOptions, TuteurOption } from "../Options"
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserContext } from "../../pre-built/user-manage/UserContext";
import api from '../../../api'

const Users = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;

  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCoordinator, SetIsCoordinator] = useState(false);
  const [formData, setFormData] = useState({
    TuteurName: "",
    TuteurEmail: ""
  });
  const [formDataa, setFormDataa] = useState({
    id:"",
    name: "",
    email: "",
    isCoordinator: ""
  });
  const [label, setLabel] = useState("");

  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [users, SetUsers] = useState([]);

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };

  // unselects the data on mount
  useEffect(() => {
    let newData;
    newData = userData.map((item) => {
      item.checked = false;
      return item;
    });
    setData([...newData]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = users.filter((item) => {
        return (
          item.name.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.email.toLowerCase().includes(onSearchText.toLowerCase())
        );
      });
      SetUsers([...filteredObject]);
    } else {
      SetUsers([...users]);
    }
  }, [onSearchText, SetUsers]);

  // function to set the action to be taken in table header
  const onActionText = (e) => {
    setActionText(e.value);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  const retrieveUsers = async () => {
    const response = await api.get("/alluser");
    return response.data;
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await retrieveUsers();

      if (allUsers) {
        SetUsers(allUsers);
      }
    };
    getAllUsers();
  }, []);
  console.log(formDataa);

  useEffect(() => {
    if (formDataa.isCoordinator === false) { setLabel("Tutor") }
    else { setLabel("Coordinator") }
  }, [formDataa])

  // function to change the selected property of an item
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].checked = e.currentTarget.checked;
    setData([...newData]);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      balance: "",
      phone: "",
      status: "Active",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = async (e) => {
    e.preventDefault();
    console.log({
      name,
      email
    })

    await fetch('http://localhost:8000/app/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        isCoordinator
      })
    });
    await api.post("/tuteur", formData);
    // setTimeout(() => Redirect(`${process.env.PUBLIC_URL}/user-list-regular`), 2000);
    resetForm();
    setModal({ add: false });
    // history.push("/demo1/user-list-regular");
  };

  // submit function to update a new item
  const onEditSubmit = async () => {
    await api.put("/updateuser", formDataa);
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    users.forEach((item) => {
      if (item.id === id) {
        setFormDataa({
          id:item.id,
          name: item.name,
          email: item.email,
          isCoordinator: item.isCoordinator
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });

  };

  // function which fires on applying selected action
  const onActionClick = async (e) => {
    if (actionText === "false") {
      // const allUsers = await retrieveUsers();
      // SetUsers(allUsers);
      let newData;
      // SetUsers(allUsers);
      newData = users.filter((item) => item.isCoordinator === false);
      SetUsers([...newData]);
    } else if (actionText === "true") {
      // const allUsers = await retrieveUsers();
      // SetUsers(allUsers);
      let newData;
      newData = users.filter((item) => item.isCoordinator === true);
      SetUsers([...newData]);
    }
    else if (actionText === "any") {
      const allUsers = await retrieveUsers();
      SetUsers(allUsers);
      // let newData;
      // newData = users.filter((item) => item.isCoordinator === true);
      // SetUsers([...newData]);
    }
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="User List - Regular"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {users.length} users.</p>
              </BlockDes>
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
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap">
                      <RSelect
                        options={TuteurOptions}
                        className="w-130px"
                        // placeholder="Choice Role"
                        defaultValue={{ value: "any", label: "Any" }}
                        onChange={(e) => onActionText(e)}
                      />
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          disabled={actionText !== "" ? false : true}
                          color="light"
                          outline
                          className="btn-dim"
                          onClick={(e) => onActionClick(e)}
                        >
                          Apply
                        </Button>
                      </span>
                      <span className="d-md-none">
                        <Button
                          color="light"
                          outline
                          disabled={actionText !== "" ? false : true}
                          className="btn-dim btn-icon"
                          onClick={(e) => onActionClick(e)}
                        >
                          <Icon name="arrow-right"></Icon>
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                            <li>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle color="tranparent" className="btn btn-trigger btn-icon dropdown-toggle">
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
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
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
            <DataTableBody>
              <DataTableHead>
                {/* <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      onChange={(e) => selectorCheck(e)}
                      id="uid"
                    />
                    <label className="custom-control-label" htmlFor="uid"></label>
                  </div>
                </DataTableRow> */}
                <DataTableRow>
                  <span className="sub-text">ID</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text"> </span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow>
                {/* <DataTableRow size="mb">
                  <span className="sub-text">Balance</span>
                </DataTableRow> */}
                <DataTableRow size="md">
                  <span className="sub-text">Email</span>
                </DataTableRow>
                {/* <DataTableRow size="lg">
                  <span className="sub-text">Verified</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Last Login</span>
                </DataTableRow> */}
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color="tranparent"
                      className="btn btn-xs btn-outline-light btn-icon dropdown-toggle"
                    >
                      <Icon name="plus"></Icon>
                    </DropdownToggle>

                  </UncontrolledDropdown>
                </DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {currentItems.length > 0
                ? currentItems.map((item) => {
                  return (
                    <DataTableItem key={item.id}>
                      <DataTableRow size="mb">
                        <span className="tb-amount">
                          <span className="currency">{item.id} </span>
                        </span>
                      </DataTableRow>
                      {/* <DataTableRow className="nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              defaultChecked={item.checked}
                              id={item.id + "uid1"}
                              key={Math.random()}
                              onChange={(e) => onSelectChange(e, item.id)}
                            />
                            <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                          </div>
                        </DataTableRow> */}
                      <DataTableRow>
                        <div className="user-card">
                          <UserAvatar
                            theme={item.avatarBg}
                            text={findUpper(item.name)}
                            image={item.image}
                          ></UserAvatar>
                        </div>

                      </DataTableRow>
                      <DataTableRow size="mb">
                        <div className="user-info">
                          <span className="tb-lead">
                            {item.name}
                          </span>
                        </div>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>{item.email}</span>
                      </DataTableRow>

                      <DataTableRow size="md">
                        <span>
                          {item.isCoordinator === true ? "Coordinateur" : "Tuteur"}
                        </span>
                      </DataTableRow>
                      <DataTableRow className="nk-tb-col-tools">
                        <ul className="nk-tb-actions gx-1">

                          <li>
                            <UncontrolledDropdown>
                              <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                <Icon name="more-h"></Icon>
                              </DropdownToggle>
                              <DropdownMenu right>
                                <ul className="link-list-opt no-bdr">
                                  <li onClick={() => onEditClick(item.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="edit"></Icon>
                                      <span>Edit User</span>
                                    </DropdownItem>
                                  </li>
                                  <li onClick={() => onDeleteClick(projet.ProjectId)}>
                                <DropdownItem
                                  tag="a"
                                  href="#delete"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="delete"></Icon>
                                  <span>Delete User</span>
                                </DropdownItem>
                              </li>
                                </ul>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </li>
                        </ul>
                      </DataTableRow>
                    </DataTableItem>
                  );
                })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={users.length}
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
              <h5 className="title">Add User</h5>
              <div className="mt-4">
                <Form className="row gy-4" noValidate onSubmit={onFormSubmit}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        // defaultValue={formData.name}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                        onChange={e => setName(e.target.value) & setFormData({ ...formData, TuteurName: e.target.value })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        // defaultValue={formData.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "This field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                        onChange={e => setEmail(e.target.value) & setFormData({ ...formData, TuteurEmail: e.target.value })}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Password</label>
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        // defaultValue={formData.balance}
                        placeholder="Password"
                        ref={register({ required: "This field is required" })}
                        onChange={e => setPassword(e.target.value)}
                      />
                      {errors.password && <span className="invalid">{errors.password.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={TuteurOption}
                          defaultValue={{ value: "false", label: "Tuteur" }}
                          // onChange={(e) => setFormData({ ...formData, status: e.value })}
                          onChange={e => SetIsCoordinator(e.value)}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add User
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

        <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
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
                <Form className="row gy-4" onSubmit={onEditSubmit}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={formDataa.name}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                        onChange={e=>setFormDataa({ ...formDataa, name: e.target.value })}
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
                        defaultValue={formDataa.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "This field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                        onChange={e=>setFormDataa({ ...formDataa, email: e.target.value })}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">

                        {/* {
                        formDataa.isCoordinator === true ? setLabel ("Tuteur"): setLabel ("Cordinateur")} */}
                        <RSelect
                          options={TuteurOption}
                          defaultValue={{
                            // value: formDataa.isCoordinator,
                            label: label,
                          }}
                          onChange={(e) => setFormDataa({ ...formDataa, isCoordinator: e.value })}
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
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default Users;
