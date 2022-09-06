import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
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
  UserAvatar,
  Button,
  PreviewAltCard,
} from "../../../components/Component";
import { Link } from "react-router-dom";
import { userData } from "../../pre-built/user-manage/UserData";
import { findUpper } from "../../../utils/Utils";
import { useForm } from "react-hook-form";
import { UserContext } from "../../pre-built/user-manage/UserContext";


const ClasseTuteur = () => {
  //   const { contextData } = useContext(UserContext);
  const [data, setData] = useState();

  const [editId, setEditedId] = useState();
  const [smOption, setSmOption] = useState(false);
  const [classes, SetClasses] = useState([]);
  const [id,setId]=useState(0);
  const [classesTuteurs, SetClassesTuteurs] = useState([]);

  const [formData, setFormData] = useState({
    ClasseName: "",
  });
  const [modal, setModal] = useState({
    add: false,
    edit: false,
  });

  // function to reset the form
  const resetForm = () => {
    setFormData({
      ClasseName: "",
    });
  };

  // submit function to add a new item
  const onFormSubmit = (formData) => {
    const { name, designation, projects, performed, tasks } = formData;
    let submittedData = {
      id: data.length + 1,
      avatarBg: "success",
      name: name,
      status: "Active",
      designation: designation,
      projects: projects,
      performed: performed,
      tasks: tasks,
    };
    setData([submittedData, ...data]);
    resetForm();
    setModal({ add: false });
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
    setModal({ edit: false, add: false, import: false });
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

  const [items, setItems] = useState([]);
  console.log(id);
  const retrieveClasses = async () => {
    // const response = await api.get(`/tuteur/${parseInt(items.id)}`);
    const response = await api.get(`/tuteur/${id}`);
    return response.data;
  };
  const retrieveClassesTuteurs = async () => {
    const response = await api.get("/classetuteur");
    return response.data;
  };
  //   console.log(classesTuteurs);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("user"));
    if (items) {
      setItems(items);
      setId(items.id);
    }
    const getAllClasse = async () => {
      const allClasse = await retrieveClasses();
      if (allClasse) {
        SetClasses(allClasse);
      }
    };
    const getAllClasseTuteurs = async () => {
      const allClasseTuteurs = await retrieveClassesTuteurs();
      if (allClasseTuteurs) {
        SetClassesTuteurs(allClasseTuteurs);
      }
    };

    // const getClasses = async () => {
    //   classesTuteurs.map((classeTuteur) => {
    //     return (
    //       console.log(classeTuteur.Tuteurs)
    //     //   classeTuteur.Tuteurs.map((x) => {
    //     //         return(console.log(x.TuteurId))
    //     //   })
    //     );
    //   });
    // };
    // getClasses();
    getAllClasse();
    getAllClasseTuteurs();
  }, [id]);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="User Contact - Card"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Class List</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {classes.length} classes.</p>
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
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs" >
            
            {classes.map((classe) => {
              return (
                <Col sm="6" lg="4" xxl="3" key={classe.ClasseId} >
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
                              <li onClick={() => onEditClick(classe.ClasseId)}>
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
                                <li onClick={() => suspendUser(classe.ClasseId)}>
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
                        <p>{classe.label}</p>
                      </div>
                      <ul className="team-statistics">
                        <li>
                          <span>Classe</span>
                          <span>{classe.label}</span>
                        </li>
                        <li>
                          <span>Nombre des Etudiants </span>
                          <span>31</span>
                        </li>
                      </ul>
                      <div className="team-view">
                        <Link to={`${process.env.PUBLIC_URL}/students_tuteur`}>
                         <Button outline color="light" className="btn-round w-150px" state={{ Students: classe }} >
                           <span>View Students</span>
                         </Button>
                       </Link>
                      </div>
                    </div>
                  </PreviewAltCard>
                </Col>
              );
            })}
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default ClasseTuteur;
