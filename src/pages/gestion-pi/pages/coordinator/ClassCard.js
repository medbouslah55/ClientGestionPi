import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
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
 UserAvatar,
 Button,
 PreviewAltCard,
} from "../../../../components/Component";
import { useForm } from "react-hook-form";
 
const ClassCard = () => {
 const [selectedFile, SetselectedFile] = useState(null);
 // const state = {
 
 //   Initially, no file is selected
 //   selectedFile: null
 // };
 
 // On file select (from the pop up)
 const onFileChange = (event) => {
   // Update the state
   SetselectedFile(event.target.files[0]);
 };
 
 // On file upload (click the upload button)
 const onFileUpload = () => {
   // Create an object of formData
   let formData = new FormData();
 
   // Update the formData object
   //   formData.append(
   //     "myFile",
   //     this.state.selectedFile,
   //     this.state.selectedFile.name
   //   );
   formData = { ...formData, file: selectedFile };
   // Details of the uploaded file
   console.log(selectedFile);
   console.log("hiiii");
   console.log(formData);
   // Request made to the backend api
   // Send formData object
   const url = "http://127.0.0.1:8000/app/upload/classe/";
 
   axios({
     method: "POST",
     url: url,
     headers: {
       // application/x-www-form-urlencoded
       "Content-Type": "multipart/form-data",
     },
     data: formData,
   });
 };
 
 //   const { contextData } = useContext(UserContext);
 const [data, setData] = useState();
 
 const [editId, setEditedId] = useState();
 const [smOption, setSmOption] = useState(false);
 const [classes, SetClasses] = useState([]);
 const [formData, setFormData] = useState({
   label: "",
 });
 const [modal, setModal] = useState({
   add: false,
   edit: false,
 });
 
 // function to reset the form
 const resetForm = () => {
   setFormData({
     label: "",
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
 
 const retrieveClasses = async () => {
   const response = await api.get("/classe");
   return response.data;
 };
 //Add Classe
 const onFormAddSubmit = async () => {
   await api.post("/classe", formData);
 };
 
 // Delete project
 const onDeleteClick = async (id) => {
   console.log(id);
   const response = await api.delete(`/classe/${id}`);
 };
 
 useEffect(() => {
   const getAllClasse = async () => {
     const allClasse = await retrieveClasses();
     if (allClasse) {
       SetClasses(allClasse);
     }
   };
   getAllClasse();
 }, []);
 
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
               <div className="toggle-expand-content" style={{ display: smOption ? "block" : "none" }}>
                 <ul className="nk-block-tools g-3">
                   <li>
                     <Button color="light" outline className="btn-white" onClick={() => setModal({ import: true })}>
                       <Icon name="download-cloud"></Icon>
                       <span>Import Classes</span>
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
         <Row className="g-gs">
           {classes.map((classe) => {
             return (
               <Col sm="6" lg="4" xxl="3" key={classe.ClasseId}>
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
             <h5 className="title">Import Classes</h5>
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
                       <Button color="primary" size="md" onClick={onFileUpload}>
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
             <h5 className="title">Add User</h5>
             <div className="mt-4">
               <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
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
                       defaultValue={formData.performed}
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
                         Add User
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
export default ClassCard;