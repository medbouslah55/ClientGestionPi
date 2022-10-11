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
  Col,
  RSelect,
} from "../../../../components/Component";
import {
  FormGroup,
} from "reactstrap";
import { useForm } from "react-hook-form";

const Grille = () => {
  //  const { id } = useParams();

  const { id } = useParams();
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    add: false,
    edit: false,
  });
  const [editId, setEditedId] = useState();
  const [criters, setCriteres] = useState([]);
  const [detailes, setDetailes] = useState([]);
  const [items, setItems] = useState([]);
  const [idd,setIdd]=useState(0);
  const [classes, SetClasses] = useState([]);
  const [etudiants, SetEtudiants] = useState([]);
  const [formData, setFormData] = useState({
    DetailIntervalle: "",
    DetailDescription: "",
    Critere: 0,
  });

  // function to reset the form
  const resetForm = () => {
    setFormData({
      CritereName: "",
      Grille: 0,
    });
  };
  const retrieveClasses = async () => {
    const response = await api.get(`/tuteur/${idd}`);
    return response.data;
  };

  const retrieveCriteres = async () => {
    const response = await api.get(`/critere/${id}`);
    // console.log(response.data);
    return response.data;
  };
  const retrieveDetailes = async () => {
    const response = await api.get(`/detail`);
    // console.log(response.data);
    return response.data;
  };
  const retrieveEtudiants = async () => {
    if (id != null) {
      const response = await api.get(`/etudiant/${idd}`);
      return response.data
    };
  }

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("user"));
    if (items) {
      setItems(items);
      setIdd(items.id);
    }

    const getAllCriteres = async () => {
      const allCriters = await retrieveCriteres();
      if (allCriters) {
        setCriteres(allCriters);
      }
    };
    const getAllDetailss = async () => {
      const allDetailes = await retrieveDetailes();
      if (allDetailes) {
        setDetailes(allDetailes);
      }
    };
    const getAllClasse = async () => {
      const allClasse = await retrieveClasses();
      if (allClasse) {
        SetClasses(allClasse);
      }
    };
    const getAllEtudiant = async () => {
      const allEtudiant = await retrieveEtudiants();
      if (allEtudiant) { SetEtudiants(allEtudiant); setData(allEtudiant) };
    };

    getAllEtudiant();
    getAllClasse();
    getAllCriteres();
    getAllDetailss();
  }, [idd]);
  console.log(criters);

  // submit function to update a new item
  const onEditSubmit = async () => {
    await api.put("/project", formData);
    setModal({ edit: false });
    resetForm();
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    criters.forEach((item) => {
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
  const onAddClickDetail = (id) => {
    criters.forEach((item) => {
      if (item.CritereId === id) {
        setFormData({ ...formData, Critere: item.CritereId });
        // console.log(item);
        setModal({ add: true }, { edit: false });
        setEditedId(id);
      }
    });
  };
console.log(etudiants);
  const { errors, register } = useForm();
  return (
    <React.Fragment>
      <Head title="Project Card"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> All Criteres</BlockTitle>

              <BlockDes className="text-soft">You have total {criters.length} Criteres</BlockDes>
              <br />
                <RSelect options={etudiants} placeholder="Students"/>
                <Col >
                    <FormGroup>
                      <input
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="text"
                        name="label"
                        // defaultValue={formData.label}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
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
            {criters &&
              criters.map((criter) => {
                return (
                  <table className="table table-bordered"
                    style={{ marginBottom: "0rem !important;" }}
                  >
                    <thead>
                      <tr>
                        <th scope="col">Note</th>
                        <th scope="col">Criteres</th>
                        {criter.details.map((detaile) => {
                          return <th scope="col">{detaile.DetailIntervalle}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">
                        <input size={1}
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                        type="text"
                        name="note"
                        // defaultValue={formData.label}
                      />

                        </th>
                        <td>{criter.CritereName}</td>
                        {criter.details.map((detaile) => {
                          return <td>{detaile.DetailDescription}</td>;
                        })}
                      </tr>
                    </tbody>
                  </table>
                );
              })}
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default Grille;
