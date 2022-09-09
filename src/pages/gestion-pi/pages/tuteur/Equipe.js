import React, { useContext, useState, useEffect } from "react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import api from "../../../../api/index";
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
} from "../../../../components/Component";
import { Option } from "../../Options";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../pre-built/user-manage/UserContext";

const Equipe = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;

  const [editId, setEditedId] = useState();
  const [smOption, setSmOption] = useState(false);
  const [equipes, SetEquipes] = useState([])
  const [projects, SetProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [id, setId] = useState(0);
  const [classes, SetClasses] = useState([]);
  const [advancedFilter, SetAdvancedFilter] = useState("Any Class");
  const [formData, setFormData] = useState({
    label: "",
    EquipeClass: "",
    EquipeOption: "",
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
      label: "",
      EquipeClass: "",
      EquipeOption: "",
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
    equipes.forEach((item) => {
      if (item.EquipeId === id) {
        setFormData({
          label: item.label,
          EquipeClass: item.EquipeClass,
          EquipeOption: item.EquipeOption,
          Project: item.Project,
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
    if (id != null) {
      const response = await api.get(`/equipe/${id}`);
      return response.data;
    }
  };

  const retrieveClasses = async () => {
    const response = await api.get("/classe");
    console.log(response.data)
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

  const getNameProject = (id) => {

    const project = projects.filter((p) => p.ProjectId === id)[0];
    console.log(project)
    if (project) { return project.label } else return null;
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
  }, [id, advancedFilter]);
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
                                  <span>Edit Team</span>
                                </DropdownItem>
                              </li>
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
                      </div>
                      <div className="team-details">
                        <p><strong>{equipe.label}</strong></p>
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
                          <span>{getNameProject(equipe.Project)}</span>
                        </li>
                      </ul>
                      <div className="team-view">
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
                        name="label"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.label}
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
              <h5 className="title">Update Team</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={onEditSubmit} noValidate>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="text"
                        name="label"
                        defaultValue={formData.label}
                        placeholder="Enter name"
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label"> Option </label>
                      <RSelect
                        options={Option}
                        onChange={(e) => {
                          setFormData({ ...formData, EquipeOption: e.value })
                          SetAdvancedFilter(e.value)
                        }
                        }
                        defaultValue={{
                          label: formData.EquipeOption,
                        }}
                      />
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
