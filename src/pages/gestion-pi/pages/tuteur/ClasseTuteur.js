import React, { useState, useEffect } from "react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import api from "../../../../api/index";
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
} from "../../../../components/Component";
import { Link } from "react-router-dom";

const ClasseTuteur = () => {

  const [smOption, setSmOption] = useState(false);
  const [classes, SetClasses] = useState([]);
  const [items, setItems] = useState([]);
  const [etudiants, SetEtudiants] = useState([]);
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

  const retrieveClasses = async () => {
    const response = await api.get(`/tuteur/${id}`);
    return response.data;
  };

  const retrieveEtudiants = async () => {
    const response = await api.get("/etudiant");
    return response.data;
  };

  const retrieveClassesTuteurs = async () => {
    const response = await api.get("/classetuteur");
    return response.data;
  };

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
    const getAllEtudiant = async () => {
      const allEtudiant = await retrieveEtudiants();
      if (allEtudiant) {
        SetEtudiants(allEtudiant);
      }
    };
    const getAllClasseTuteurs = async () => {
      const allClasseTuteurs = await retrieveClassesTuteurs();
      if (allClasseTuteurs) {
        SetClassesTuteurs(allClasseTuteurs);
      }
    };

    getAllEtudiant();
    getAllClasse();
    getAllClasseTuteurs();
  }, [id]);

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
                      <div className="user-card user-card-s2">
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

                        <Link to={`${process.env.PUBLIC_URL}/Students`}>
                         <Button outline color="light" className="btn-round w-50px"  >
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
