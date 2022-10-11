import React, { useState } from "react";
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
} from "../../../../components/Component";
import { Option } from "../../Options";
import { findUpper } from "../../../../utils/Utils";
import {
    DropdownToggle,
    UncontrolledDropdown,
    Modal,
    ModalBody,
    FormGroup,
    Form,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Options_Coo = () => {
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        addGrille: false,
    });
    const [editId, setEditedId] = useState();

    // function to reset the form
    const resetForm = () => {
        setFormData({
            label: "",
            ProjectOption: "",
            ProjectDescription: "",
            Theme: 0,
        });
    };

    const [formDataGrille, setFormDataGrille] = useState({
        GrilleName: "",
        GrilleOption: ""
    });

    //Add Grille
    const onFormAddSubmitGrille = async () => {
        await api.post("/grille", formDataGrille);
        setModal({ AddGrille: false });
        resetForm();
    };

    const onAddClickGrille = (id) => {
        Option.forEach((item) => {
            if (item.value === id) {
                setFormDataGrille({ ...formDataGrille, GrilleOption: item.value });
                // console.log(item);
                setModal({ addGrille: true }, { add: false }, { edit: true });
                setEditedId(id);
            }
        });
    };

    // function to close the modal
    const onFormCancel = () => {
        setModal({ add: false }, { edit: false });
        resetForm();
    };

    console.log(formDataGrille);
    const { errors, register } = useForm();

    return (
        <React.Fragment>
            <Head title="Project Card"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle page> Options</BlockTitle>
                            <BlockDes className="text-soft">You have total {Option.length} options</BlockDes>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>

                <Block>
                    <Row className="g-gs">
                        {Option &&
                            Option.map((option) => {
                                return (
                                    <Col sm="6" lg="4" xxl="3" key={option.value + 1}>
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
                                                        theme={option.value}
                                                        text={findUpper(option.value)}
                                                    />
                                                    <div className="project-info">
                                                        <span className="sub-text">OPTION :</span>
                                                        <h6 className="title"> {option.value}</h6>
                                                    </div>
                                                </a>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle
                                                        tag="a"
                                                        className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                                                    >
                                                    </DropdownToggle>
                                                </UncontrolledDropdown>
                                            </div>
                                            <div className="project-details">
                                            </div>
                                            <div className="team-view">
                                                <Link to={`${process.env.PUBLIC_URL}/grilleproject/${option.value}`} >
                                                    <Button outline color="light" className="btn-round w-50px">
                                                        <span>View Grilles</span>
                                                    </Button>
                                                </Link>
                                                &nbsp;
                                                &nbsp;
                                                <Button
                                                    outline
                                                    color="light"
                                                    className="btn-round w-50px"
                                                    onClick={() => onAddClickGrille(option.value)}
                                                >
                                                    <span>Add Grille</span>
                                                </Button>
                                            </div>
                                        </ProjectCard>
                                    </Col>
                                );
                            })}
                    </Row>
                </Block>
                <Modal
                    isOpen={modal.addGrille}
                    toggle={() => setModal({ addGrille: false })}
                    className="modal-dialog-centered"
                    size="lg"
                >
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
                            <h5 className="title">Add Grille</h5>
                            <div className="mt-4">
                                <Form className="row gy-4" onSubmit={onFormAddSubmitGrille}>
                                    <Col md="6">
                                        <FormGroup>
                                            <label className="form-label">Grille Name</label>
                                            <input
                                                type="text"
                                                name="GrilleName"
                                                placeholder="Enter Title"
                                                onChange={(e) => setFormDataGrille({ ...formDataGrille, GrilleName: e.target.value })}
                                                ref={register({ required: "This field is required" })}
                                                className="form-control"
                                            />
                                            {errors.title && <span className="invalid">{errors.title.message}</span>}
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label className="form-label">Grille Option</label>
                                            <input
                                                disabled
                                                type="text"
                                                name="GrilleOption"
                                                placeholder="Enter Title"
                                                defaultValue={
                                                    formDataGrille.GrilleOption
                                                }
                                                ref={register({ required: "This field is required" })}
                                                className="form-control"
                                            />
                                            {errors.title && <span className="invalid">{errors.title.message}</span>}
                                        </FormGroup>
                                    </Col>
                                    <Col size="12">
                                        <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                            <li>
                                                <Button color="primary" size="md" type="submit">
                                                    Add Grille
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
export default Options_Coo;
