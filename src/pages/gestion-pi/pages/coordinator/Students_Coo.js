import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
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
  BlockDes,
  Col,
  Row,
  Button,
  RSelect,
} from "../../../../components/Component";
import { userData } from "../../../pre-built/user-manage/UserData";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../pre-built/user-manage/UserContext";
import api from "../../../../api";

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
  const [classes, SetClasses] = useState([]);
  const [equipes, SetEquipes] = useState([]);
  const [editId, setEditedId] = useState();
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
    import: false,
  });
  const [formData, setFormData] = useState({
    label: "",
    EtudiantClass: "",
    Equipe: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedFilter, SetAdvancedFilter] = useState("Any Class");
  const [advancedGetFilter, SetAdvancedGetFilter] = useState("Any Class");
  const [itemPerPage, setItemPerPage] = useState(10);
  const [etudiants, SetEtudiants] = useState([]);

  const retrieveEtudiants = async () => {
    if (advancedGetFilter === "Any Class") {
      const response = await api.get("/etudiant2");
      return response.data;
    }
    else {
      const response = await api.get("/etudiant2/"+ advancedGetFilter);
      return response.data;
    }
  }

  const retrieveClasses = async () => {
    const response = await api.get("/classe");
    return response.data;
  };

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

  useEffect(() => {
    const getAllEtudiant = async () => {
      const allEtudiant = await retrieveEtudiants();
      if (allEtudiant) {SetEtudiants(allEtudiant); setData(allEtudiant)};
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
    }
    getAllEquipe();
    getAllClasse();
    getAllEtudiant();
  }, [advancedFilter,advancedGetFilter]);
  const onFormAddSubmit = async () => {
    const response = await api.post("/etudiant",formData);
  };
  console.log(formData);
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
        label: "",
        EtudiantClass: "",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false, import: false });
    resetForm();
  };

  const onEditSubmit = async () => {
    await api.put("/etudiant", formData);
  };

  const onEditClick = (id) => {
    etudiants.forEach((item) => {
      if (item.EtudiantId === id) {
        setFormData({
          EtudiantId: item.EtudiantId,
          label: item.label,
          EtudiantClass: item.EtudiantClass,
          Equipe: item.Equipe
          // isCoordinator: item.isCoordinator
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });

  };
  console.log(advancedGetFilter);
  const getNameEquipe = (id) => {

    const equipe = equipes.filter((p)=>p.EquipeId === id)[0];
    if(equipe){return equipe.label}  else return null ;
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = etudiants.slice(indexOfFirstItem, indexOfLastItem);

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
              <BlockDes className="text-soft">
                <p>You have total {etudiants.length} students.</p>
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
                                  <label className="overline-title overline-title-alt">Classe</label>
                                  <RSelect options={classes} placeholder="Any Class"
                                    onChange={(e) => SetAdvancedGetFilter(e.label)}
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
                                <span className="title">{etudiant.label}</span>
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
                                        <span>Update Student</span>
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
                        name="label"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
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
              <h5 className="title">Update Student</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={onEditSubmit}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Nom & Prénom</label>
                      <input
                        className="form-control"
                        type="text"
                        name="label"
                        defaultValue={formData.label}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                        onChange={e => setFormData({ ...formData, label: e.target.value })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <label className="form-label">Class</label>
                    <FormGroup>
                      <RSelect
                        options={classes}
                        onChange={(e) => setFormData({ ...formData, EtudiantClass: e.label })}
                        defaultValue={{ label: formData.EtudiantClass }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
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
                          Update Student
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
export default Students_Coo;
