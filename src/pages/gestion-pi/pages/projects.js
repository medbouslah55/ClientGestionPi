import React, { useState, useEffect } from "react";
import api from "../../../api/index";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  Row,
  ProjectCard,
  UserAvatar,
  Col,
  RSelect,
} from "../../../components/Component";
import { Option } from "../Options";
import { projectData} from "../../pre-built/projects/ProjectData";
import { findUpper} from "../../../utils/Utils";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  FormGroup,
  DropdownItem,
  Form,
} from "reactstrap";
import { useForm } from "react-hook-form";

const projects = () => {
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    add: false,
    edit: false,
  });
  const [editId, setEditedId] = useState();
  const [data, setData] = useState(projectData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [id,setId]=useState(0);
  const [projectss, SetProjectss] = useState([]);
  const [items, setItems] = useState([]);
  const [themes, SetThemes] = useState([]);
  const [advancedFilter, SetAdvancedFilter] = useState("Any Class");
  const [formData, setFormData] = useState({
    label: "",
    ProjectOption: "",
    ProjectDescription: "",
    Theme : 0,
  });

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      label: "",
      ProjectOption: "",
      ProjectDescription: "",
      Theme : 0,
    });
  };

  const retrieveProjects = async () => {
    const response = await api.get(`/project2/${id}`);
    // console.log(response.data);
    return response.data;
  };

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
    const items = JSON.parse(localStorage.getItem("user"));
    if (items) {
      setItems(items);
      setId(items.id);
    }

    const getAllProjects = async () => {
      const allProjets = await retrieveProjects();

      if (allProjets) {
        SetProjectss(allProjets);
      }
    };
    const getAllThemes = async () => {
      const allThemes = await retrieveThemes();
      if (allThemes) {
        SetThemes(allThemes);
      }
    };
    getAllProjects();
    getAllThemes();

  }, [id,advancedFilter]);

  console.log(formData)

  const retrieveThems = async () => {
    const response = await api.get("/theme");

  }
  //Add project
  const onFormAddSubmit = async () => {
    await api.post("/project", formData);
  };

  // Delete project
  const onDeleteClick = async (id) => {
    await api.delete(`/project/${id}`);
  };
  // function to close the modal
  const onFormCancel = () => {
    setModal({ add: false }, { edit: false });
    resetForm();
  };

  // submit function to update a new item
  const onEditSubmit = async () => {
    await api.put("/project", formData);
    setModal({ edit: false });
    resetForm();
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    projectss.forEach((item) => {
      if (item.ProjectId === id) {
        setFormData({
          ProjectId:item.ProjectId,
          label: item.label,
          ProjectOption: item.ProjectOption,
          ProjectDescription: item.ProjectDescription,
          Theme : item.Theme,
        });
        console.log(item);
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Project Card"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Projects</BlockTitle>
              <BlockDes className="text-soft">You have total {projectss.length} projects</BlockDes>
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
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add Project</span>
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
            {projectss &&
              projectss.map((projet) => {
                // var days = setDeadlineDays(projet.deadline);
                return (
                  <Col sm="6" lg="4" xxl="3" key={projet.ProjectId}>
                    <ProjectCard>
                      <div className="project-head">
                        <a
                          href="#title"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="project-title"
                        >
                          <UserAvatar
                            className="sq"
                            theme={projet.ProjectOption}
                            text={findUpper(projet.ProjectOption)}
                          />
                          <div className="project-info">
                            <h6 className="title">{projet.label}</h6>
                            <span className="sub-text">{projet.ProjectOption}</span>
                          </div>
                        </a>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="a"
                            className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                          >
                            <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-list-opt no-bdr">
                              <li onClick={() => onEditClick(projet.ProjectId)}>
                                <DropdownItem
                                  tag="a"
                                  href="#edit"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="edit"></Icon>
                                  <span>Edit Project</span>
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
                                  <span>Delete Project</span>
                                </DropdownItem>
                              </li>
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                      <div className="project-details">
                      </div>

                      <div className="project-meta">
                        <ul className="project-users g-1">
                          {projet.ProjectDescription}
                        </ul>
                      </div>
                    </ProjectCard>
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
              <h5 className="title">Add Project</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={onFormAddSubmit}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Project Name</label>
                      <input
                        type="text"
                        name="label"
                        defaultValue={formData.label}
                        placeholder="Enter Project Name"
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.title && <span className="invalid">{errors.title.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Project Option</label>
                      
                      <RSelect options={Option} onChange={(e) =>
                         {setFormData({ ...formData, ProjectOption : e.value })
                         SetAdvancedFilter(e.value)}
                        }
                         />
                    
                    </FormGroup>
                  </Col>
                  
                  <Col md="12">
                  <label className="form-label">Theme</label>
                    <FormGroup>
                      <RSelect options={themes} onChange={(e) => setFormData({ ...formData, Theme : e.ThemeId })} />
                    </FormGroup>
                  </Col>
                  <Col size="12">
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
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add Project
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
              <h5 className="title">Update Project</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={onEditSubmit}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Project Name</label>
                      <input
                        type="text"
                        name="label"
                        defaultValue={formData.label}
                        placeholder="Enter Title"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This field is required" })}
                        className="form-control"
                      />
                      {errors.title && <span className="invalid">{errors.title.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Project Option</label>
                      <RSelect 
                      options={Option} 
                      onChange={(e) =>
                         {setFormData({ ...formData, ProjectOption : e.value })
                         SetAdvancedFilter(e.value)}
                        }
                        defaultValue={{
                          label: formData.ProjectOption,
                        }}
                         />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                  <label className="form-label">Theme</label>
                  <FormGroup>
                      <RSelect 
                      options={themes} 
                      onChange={(e) => setFormData({ ...formData, Theme : e.ThemeId })}
                      defaultValue={{
                        label: formData.Theme,
                      }}
                       />
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <FormGroup>
                      <label className="form-label">Project Description</label>
                      <textarea
                        name="ProjectDescription"
                        defaultValue={formData.ProjectDescription}
                        placeholder="Your description"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This field is required" })}
                        className="form-control no-resize"
                      />
                      {errors.description && <span className="invalid">{errors.description.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Update Project
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
      </Content>
    </React.Fragment>
  );
};
export default projects;
