import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../../api/index";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
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
} from "../../../../components/Component";
import { Option } from "../../Options";
import { findUpper } from "../../../../utils/Utils";
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
 
const AllGrilles = () => {

 const { id } = useParams();
 const [sm, updateSm] = useState(false);
 const [modal, setModal] = useState({
   add: false,
   edit: false,
   addDetail:false
 });
 const [editId, setEditedId] = useState();
 const [grilles, SetGrilles] = useState([]);
 const [formData, setFormData] = useState({
   CritereName: "",
   Grille: 0,
 });
 const [formDetailData, setFormDetailData] = useState({
  DetailIntervalle: "",
  DetailDescription: "",
  Critere: 0,
});
 
 // OnChange function to get the input data
 const onInputChange = (e) => {
   setFormData({ ...formData, [e.target.name]: e.target.value });
 };
 
 // function to reset the form
 const resetForm = () => {
   setFormData({
     CritereName: "",
     Grille: 0,
   });
 };
 
 const retrieveGrilles = async () => {
   const response = await api.get(`/grille/${id}`);
   return response.data;
 };
 
 useEffect(() => {
   const getAllGrilles = async () => {
     const allGrilles = await retrieveGrilles();
     if (allGrilles) {
       SetGrilles(allGrilles);
     }
   };
   getAllGrilles();
 },[]);

 const onAddClickHisDetails = ()=> {
  // setFormDetailData({ ...formDetailData, Critere: item.CritereId });
  setModal({ addDetail: true }, { add: false }, { edit: false });
}

 const onFormAddDetailSubmit = async () => {
  await api.post("/detail", formDetailData);
  // setModal({ aadDetail: true });
};

 //Add Critere
 const onFormAddSubmit = async () => {
   await api.post("/critere", formData);
   onAddClickHisDetails();
 };
 
 // Delete project
 const onDeleteClick = async (id) => {
   await api.delete(`/grille/${id}`);
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
   grilles.forEach((item) => {
     if (item.ProjectId === id) {
       setFormData({
         ProjectId: item.ProjectId,
         label: item.label,
         ProjectOption: item.ProjectOption,
         ProjectDescription: item.ProjectDescription,
         Theme: item.Theme,
       });
       // console.log(item);
       setModal({ edit: true }, { add: false });
       setEditedId(id);
     }
   });
 };

 const onAddClickCritere = (id) => {
   grilles.forEach((item) => {
     if (item.GrilleId === id) {
       setFormData({ ...formData, Grille: item.GrilleId });
       setModal({ add: true }, { edit: false });
       setEditedId(id);
     }
   });
 };
 
 const { errors, register } = useForm();
 
 return (
   <React.Fragment>
     <Head title="Project Card"></Head>
     <Content>
       <BlockHead size="sm">
         <BlockBetween>
           <BlockHeadContent>
             <BlockTitle page> Grilles</BlockTitle>
             <BlockDes className="text-soft">You have total {grilles.length} Grilles</BlockDes>
           </BlockHeadContent>
           <BlockHeadContent>
             <div className="toggle-wrap nk-block-tools-toggle">
               <Button
                 className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                 onClick={() => updateSm(!sm)}
               >
                 <Icon name="menu-alt-r"></Icon>
               </Button>
             </div>
           </BlockHeadContent>
         </BlockBetween>
       </BlockHead>
 
       <Block>
         <Row className="g-gs">
           {grilles &&
             grilles.map((grille) => {
               return (
                 <Col sm="6" lg="4" xxl="3" key={grille.GrilleId}>
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
                           theme={grille.GrilleOption}
                           text={findUpper(grille.GrilleOption)}
                         />
                         <div className="project-info">
                           <h6 className="title">{grille.GrilleName}</h6>
                           <span className="sub-text">{grille.GrilleOption}</span>
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
                             <li onClick={() => onEditClick(grille.GrilleId)}>
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
                             <li onClick={() => onDeleteClick(grille.GrilleId)}>
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
                     <div className="project-details"></div>
 
                     <div className="team-view">
                       <Link to={`${process.env.PUBLIC_URL}/grille/${grille.GrilleId}`}>
                         <Button outline color="light" className="btn-round w-50px">
                           <span>View This Grille</span>
                         </Button>
                       </Link>
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
             <h5 className="title">Add Critere</h5>
             <div className="mt-4">
               <Form className="row gy-4" onSubmit={onFormAddSubmit}>
                 <Col md="12">
                   <FormGroup>
                     <label className="form-label">Critere Description</label>
                     <textarea
                       type="text"
                       name="CritereName"
                       defaultValue={formData.CritereName}
                       placeholder="Enter Critere Description"
                       onChange={(e) => onInputChange(e)}
                       className="form-control"
                       ref={register({ required: "This field is required" })}
                     />
                     {errors.title && <span className="invalid">{errors.title.message}</span>}
                   </FormGroup>
                 </Col>
 
                 <Col size="12">
                   <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                     <li>
                       <Button color="primary" size="md" type="submit">
                         Add His Details
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
                       onChange={(e) => {
                         setFormData({ ...formData, ProjectOption: e.value });
                         SetAdvancedFilter(e.value);
                       }}
                       defaultValue={{
                         label: formData.ProjectOption,
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
       <Modal isOpen={modal.addDetail} toggle={() => setModal({ aadDetail: false })} className="modal-dialog-centered" size="lg">
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
             <h5 className="title">Add Detail</h5>
             <div className="mt-4">
               <Form className="row gy-4" onSubmit={onFormAddDetailSubmit}>
                 <Col md="6">
                   <FormGroup>
                     <label className="form-label">Detail Intervalle</label>
                     <input
                       type="text"
                       name="DetailIntervalle"
                       defaultValue={formDetailData.DetailIntervalle}
                       placeholder="Enter Interval Name"
                       onChange={(e) => onInputChange(e)}
                       className="form-control"
                       ref={register({ required: "This field is required" })}
                     />
                     {errors.title && <span className="invalid">{errors.title.message}</span>}
                   </FormGroup>
                 </Col>
                 <Col md="6">
                   <FormGroup>
                     <label className="form-label">Detail Description</label>
                     <input
                       type="text"
                       name="DetailDescription"
                       defaultValue={formDetailData.DetailDescription}
                       placeholder="Enter Description Name"
                       onChange={(e) => onInputChange(e)}
                       className="form-control"
                       ref={register({ required: "This field is required" })}
                     />
                     {errors.title && <span className="invalid">{errors.title.message}</span>}
                   </FormGroup>
                 </Col>
 
                 <Col size="12">
                   <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                     <li>
                       <Button color="primary" size="md" type="submit">
                         Add
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
export default AllGrilles;
