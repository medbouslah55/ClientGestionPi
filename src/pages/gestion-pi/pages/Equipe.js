import React, { useContext, useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import api from "../../../api/index";
import {
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Form,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  DropdownItem,
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
  Button,
  PreviewAltCard,
  RSelect,
} from "../../../components/Component";
import { Option } from "../Options";
import { useForm } from "react-hook-form";
import { UserContext } from "../../pre-built/user-manage/UserContext";

const Equipe = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;

  const [editId, setEditedId] = useState();
  const [smOption, setSmOption] = useState(false);
  const [equipes, SetEquipes] = useState([])
  const [projects, SetProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [id,setId] = useState (0);
  const [classes, SetClasses] = useState([]);
  const [advancedFilter, SetAdvancedFilter] = useState("Any Class");
  const [formData, setFormData] = useState({
    EquipeName: "",
    EquipeClass: "",
    EquipeOption: "",
    EquipeDescription: "",
    Project: 0,
  });
  const [modal, setModal] = useState({
    add: false,
    edit: false,
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      EquipeName: "",
      EquipeClass: "",
      EquipeOption: "",
      EquipeDescription: "",
      Project: 0,
    });
  };

  // submit function to add a new item
  const onFormSubmit = async () => {
    await api.post("/equipe", formData);
  };

  // submit function to update a new item
  const onEditSubmit = (formData) => {
    const { name, designation, projects, performed, tasks } = formData;
    let submittedData;
    let newitems = data;
    newitems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          ...item,
          id: item.id,
          avatarBg: item.avatarBg,
          name: name,
          status: "Active",
          email: item.email,
          designation: designation,
          projects: projects,
          performed: performed,
          tasks: tasks,
        };
      }
    });
    let index = newitems.findIndex((item) => item.id === editId);
    newitems[index] = submittedData;
    setData(newitems);
    setModal({ edit: false });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          name: item.name,
          designation: item.designation,
          projects: item.projects,
          performed: item.performed,
          tasks: item.tasks,
        });
        setModal({ edit: true, add: false });
        setEditedId(id);
      }
    });
  };

  // function to change to suspend property for an item
  const suspendUser = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Suspend";
    setData([...newData]);
  };

  const retrieveEquipes = async () => {
    const response = await api.get(`/equipe/${id}`);
    return response.data;
  };

  const retrieveClasses = async () => {
    const response = await api.get("/classe");
    return response.data;
  };

  const retrieveProjects = async () => {
    if (advancedFilter === "Any Class") {
      const response = await api.get("/project");
      return response.data;
    }
    else {
      const response = await api.get("/project/" + advancedFilter);
      return response.data;
    }
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("user"));
    if (items) {
      setItems(items);
      setId(items.id);
    }

    const getAllEquipe = async () => {
      const allEquipe = await retrieveEquipes();
      if (allEquipe) {
        SetEquipes(allEquipe);
      };
    };
    const getAllProjects = async () => {
      const allProjets = await retrieveProjects();
      if (allProjets) {
        SetProjects(allProjets);
      }
    };
    const getAllClasse = async () => {
      const allClasse = await retrieveClasses();
      if (allClasse) {
        SetClasses(allClasse);
      };
    };
    getAllEquipe();
    getAllProjects();
    getAllClasse();
  }, [id,advancedFilter]);
  console.log(formData);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="User Contact - Card"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Teams List</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {equipes.length} teams.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#toggle"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setSmOption(!smOption);
                  }}
                  className="btn btn-icon btn-trigger toggle-expand mr-n1"
                >
                  <Icon name="menu-alt-r"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: smOption ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    {/* <li>
                      <Button color="light" outline className="btn-white">
                        <Icon name="download-cloud"></Icon>
                        <span>Export</span>
                      </Button>
                    </li> */}
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
          <Row className="g-gs">
            {equipes.map((equipe) => {
              return (
                <Col sm="6" lg="4" xxl="3" key={equipe.EquipeId}>
                  <PreviewAltCard>
                    <div className="team">
                      {/* <div
                        className={`team-status ${
                          item.status === "Active"
                            ? "bg-success text-white"
                            : item.status === "Pending"
                            ? "bg-warning text-white"
                            : "bg-danger text-white"
                        } `}
                      >
                        <Icon
                          name={`${
                            item.status === "Active" ? "check-thick" : item.status === "Pending" ? "clock" : "na"
                          }`}
                        ></Icon>
                      </div> */}
                      <div className="team-options">
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                            <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-list-opt no-bdr">
                              <li onClick={() => onEditClick(equipe.EquipeId)}>
                                <DropdownItem
                                  tag="a"
                                  href="#edit"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="edit"></Icon>
                                  <span>Edit</span>
                                </DropdownItem>
                              </li>
                              {/* {item.status !== "Suspend" && ( */}
                              <React.Fragment>
                                <li className="divider"></li>
                                <li onClick={() => suspendUser(theme.ThemeId)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#suspend"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="na"></Icon>
                                    <span>Suspend User</span>
                                  </DropdownItem>
                                </li>
                              </React.Fragment>

                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                      <div className="user-card user-card-s2">
                        {/* <UserAvatar theme={item.avatarBg} className="md" text={findUpper(item.name)} image={item.image}>
                          <div className="status dot dot-lg dot-success"></div>
                        </UserAvatar> */}
                        {/* <div className="user-info">
                          <h6>{theme.T}</h6>
                          <span className="sub-text">@{item.name.split(" ")[0].toLowerCase()}</span>
                        </div> */}
                      </div>
                      <div className="team-details">
                        <p><strong>{equipe.EquipeName}</strong></p>
                      </div>
                      <ul className="team-statistics">
                        <li>
                          <span>Option</span>
                          <span>{equipe.EquipeOption}</span>
                        </li>
                        <li>
                          <span>Classe</span>
                          <span>{equipe.EquipeClass}</span>
                        </li>
                        <li>
                          <span>Project</span>
                          <span>{equipe.Project}</span>
                        </li>
                      </ul>
                      <div className="team-view">
                        {/* <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}>
                          <Button outline color="light" className="btn-round w-150px">
                            <span>View Profile</span>
                          </Button>
                        </Link> */}
                      </div>
                    </div>
                  </PreviewAltCard>
                </Col>
              );
            })}
          </Row>
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
              <h5 className="title">Add Team</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={onFormSubmit}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="text"
                        name="EquipeName"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.EquipeName}
                        placeholder="Enter name"
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label"> Option </label>
                      <RSelect options={Option} onChange={(e) => {
                        setFormData({ ...formData, EquipeOption: e.value })
                         SetAdvancedFilter(e.value)
                      }
                      }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label"> Class </label>
                      <FormGroup>
                      <RSelect options={classes} onChange={(e) => setFormData({ ...formData, EquipeClass: e.label })} />
                    </FormGroup>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <label className="form-label">Project</label>
                    <FormGroup>
                      <RSelect options={projects} onChange={(e) => setFormData({ ...formData, Project: e.ProjectId })} />
                    </FormGroup>
                  </Col>
                  {/* <Col size="12">
                      <FormGroup>
                      <label className="form-label">Team Description</label>
                      <textarea
                        name="EquipeDescription"
                        defaultValue={formData.EquipeDescription}
                        placeholder="Your description"
                        onChange={(e) => onInputChange(e)}
                        className="form-control-xl form-control no-resize"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.description && <span className="invalid">{errors.description.message}</span>}
                    </FormGroup>
                  </Col> */}
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button type="submit" color="primary" size="md">
                          Add Team
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </Button>
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
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)} noValidate>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter name"
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label"> Designation </label>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="text"
                        name="designation"
                        defaultValue={formData.designation}
                        placeholder="Enter Designation"
                      />
                      {errors.designation && <span className="invalid">{errors.designation.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <label className="form-label">Projects</label>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="number"
                        name="projects"
                        defaultValue={formData.projects}
                      />
                      {errors.projects && <span className="invalid">{errors.projects.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <label className="form-label">Performed</label>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="number"
                        name="performed"
                        max={100}
                        defaultValue={Number(formData.performed)}
                      />
                      {errors.performed && <span className="invalid">{errors.performed.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <label className="form-label">Tasks</label>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="number"
                        name="tasks"
                        defaultValue={formData.tasks}
                      />
                      {errors.tasks && <span className="invalid">{errors.tasks.message}</span>}
                    </FormGroup>
                  </Col>
                  {/* <Col size="12">
                    <FormGroup>
                      <label className="form-label">Project Description</label>
                      <textarea
                        name="ProjectDescription"
                        defaultValue={formData.ProjectDescription}
                        placeholder="Your description"
                        onChange={(e) => onInputChange(e)}
                        className="form-control-xl form-control no-resize"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.description && <span className="invalid">{errors.description.message}</span>}
                    </FormGroup>
                  </Col> */}
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button type="submit" color="primary" size="md">
                          Update User
                        </Button>
                      </li>
                      <li>
                        <Button
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </Button>
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
export default Equipe;
