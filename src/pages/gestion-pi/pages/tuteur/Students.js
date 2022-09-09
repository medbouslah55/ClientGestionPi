import React, { useState, useEffect } from "react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import api from '../../../../api'
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Card,
  FormGroup,
  Modal,
  ModalBody,
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
  Col,
  PaginationComponent,
  RSelect,
} from "../../../../components/Component";
import { dateFormatterAlt } from "../../../../utils/Utils";
import { useForm } from "react-hook-form";

const Students = () => {
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [editId, setEditedId] = useState();
  const [modal, setModal] = useState({
    add: false,
  });
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [equipes, SetEquipes] = useState([]);
  const [classes, SetClasses] = useState([]);
  const [advancedFilter, SetAdvancedFilter] = useState("Any Class");
  const [id, setId] = useState();
  const [formData, setFormData] = useState({
    // EtudiantId:"",
    EtudiantName: "",
    EtudiantClass: "",
    Equipe: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [etudiants, SetEtudiants] = useState([]);

  const retrieveEquipes = async () => {
    if (advancedFilter === "Any Class") {
      const response = await api.get("/equipe");
      return response.data;
    }
    else {
      const response = await api.get("/equipe2/" + advancedFilter);
      return response.data;
    }
  };

  const retrieveClasses = async () => {
    const response = await api.get("/classe");
    return response.data;
  };

  const retrieveEtudiants = async () => {
    if (id != null) {
      const response = await api.get(`/etudiant/${id}`);
      return response.data
    };
  }

  const getNameEquipe = (id) => {

    const equipe = equipes.filter((p)=>p.EquipeId === id)[0];
    console.log(equipe)
    if(equipe){return equipe.label}  else return null ;
  };

  // console.log(items.id)
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("user"));
    if (items) {
      setItems(items);
      setId(items.id);
    }

    const getAllEtudiant = async () => {
      const allEtudiant = await retrieveEtudiants();
      if (allEtudiant) { SetEtudiants(allEtudiant); setData(allEtudiant) };
    };
    const getAllEquipe = async () => {
      const allEquipe = await retrieveEquipes();
      if (allEquipe) {
        SetEquipes(allEquipe);
      };
    };
    const getAllClasse = async () => {
      const allClasse = await retrieveClasses();
      if (allClasse) {
        SetClasses(allClasse);
      };
    };
    getAllClasse();
    getAllEquipe();
    getAllEtudiant();
  }, [id, advancedFilter]);

  const sortingFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = [...defaultData].sort((a, b) => parseFloat(a.ref) - parseFloat(b.ref));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = [...defaultData].sort((a, b) => parseFloat(b.ref) - parseFloat(a.ref));
      setData([...sortedData]);
    }
  };

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = etudiants.filter((item) => {
        return item.EtudiantName.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...etudiants]);
    }
  }, [onSearchText]);

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
  console.log(id)
  // function to close the form modal
  const onFormCancel = () => {
    setModal({ add: false });
    resetForm();
  };

  const onEditSubmit = async () => {
    await api.put("/etudiant", formData);
  };

  const onFormAddSubmit = async () => {
    const response = await api.post("/etudiant", formData);
  };
  console.log(formData);
  // submit function to add a new item
  const onFormSubmit = (submitData) => {
    const { bill, total } = submitData;
    let submittedData = {
      id: data.length + 1,
      ref: 4970 + data.length,
      bill: bill,
      issue: dateFormatterAlt(formData.issue, true),
      due: dateFormatterAlt(formData.due, true),
      total: total + ".00",
      status: formData.status,
    };
    setData([submittedData, ...data]);

    resetForm();
    setModal({ add: false });
  };

  const onEditClick = (id) => {
    etudiants.forEach((item) => {
      if (item.EtudiantId === id) {
        setFormData({
          EtudiantId: item.EtudiantId,
          EtudiantName: item.EtudiantName,
          EtudiantClass: item.EtudiantClass,
          Equipe: item.Equipe
          // isCoordinator: item.isCoordinator
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });

  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register } = useForm();

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = etudiants.slice(indexOfFirstItem, indexOfLastItem);
  // console.log(etudiants);
  return (
    <React.Fragment>
      <Head title="Transaction Lists - Basic"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>List Etudiant</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {etudiants.length} students.</p>
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
                          <span className="d-none d-md-block">
                            <span>Classe</span>
                            <span>Nom d'équipe</span>
                          </span>
                        </span>
                      </th>
                      <th className="tb-tnx-action">
                        <span>&nbsp;</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0
                      ? currentItems.map((etudiant) => {
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
                                <span className="date">{getNameEquipe(etudiant.Equipe)}</span>
                              </div>
                            </td>
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
                                    <li onClick={() => onEditClick(etudiant.EtudiantId)}>
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Affect Student</span>
                                      </DropdownItem>
                                    </li>
                                    {/* <li
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
                                    </li> */}
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
                  <PaginationComponent
                    noDown
                    itemPerPage={itemPerPage}
                    totalItems={data.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-silent">No data found</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Block>
        {/* ******************************** Add Student *************************************** */}

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
                    <label className="form-label">Classe</label>
                    <FormGroup>
                      <RSelect
                        options={classes}
                        onChange={(e) => {
                          setFormData({ ...formData, EtudiantClass: e.label })
                          SetAdvancedFilter(e.label)
                        }} />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Equipe</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={equipes}
                          onChange={(e) => setFormData({ ...formData, Equipe : e.EquipeId })}

                        // defaultValue={{ value: "Paid", label: "Paid" }}
                        // onChange={(e) => setFormData({ ...formData, status: e.value })}*

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
              <h5 className="title">Affect Student</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={onEditSubmit}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Nom & Prénom</label>
                      <input
                      disabled
                        className="form-control"
                        type="text"
                        name="EtudiantName"
                        defaultValue={formData.EtudiantName}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                        onChange={e => setFormData({ ...formData, EtudiantName: e.target.value })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Equipe</label>
                      <RSelect
                        options={equipes}
                        onChange={(e) => setFormData({ ...formData, Equipe: e.EquipeId })}
                        defaultValue={{
                          label: getNameEquipe(formData.Equipe),
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Affect Student
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

export default Students;
