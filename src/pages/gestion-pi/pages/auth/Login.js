import React, { useState } from "react";
import Logo from "../../../../images/logo.png";
import LogoDark from "../../../../images/logo-dark.png";
import PageContainer from "../../../../layout/page-container/PageContainer";
import Head from "../../../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import Navigate from 'react-router-dom'
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../../../components/Component";
import { Form, FormGroup, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  // const onFormSubmit = (formData) => {
  //   setLoading(true);
  //   const loginName = "info@softnio.com";
  //   const pass = "123456";
  //   if (formData.name === loginName && formData.passcode === pass) {
  //     localStorage.setItem("accessToken", "token");
  //     setTimeout(() => {
  //       window.history.pushState(
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
  //         "auth-login",
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
  //       );
  //       window.location.reload();
  //     }, 2000);
  //   } else {
  //     setTimeout(() => {
  //       setError("Cannot login with credentials");
  //       setLoading(false);
  //     }, 2000);
  //   }
  // };

  const onFormSubmit = async (e) => {
      e.preventDefault();
      // localStorage.setItem("accessToken", jwt);
      const response = await fetch('http://localhost:8000/app/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
              email,
              password
          })
      });
      const content = await response.json();
      console.log(content);
      

      if (content.jwt){
      localStorage.setItem("accessToken", content.jwt);
      localStorage.setItem('user', JSON.stringify(content));
      setRedirect(true);
      setLoading(true);
      
      }else{
        setError("Verify your email and password");
        setLoading(false);
      }
  }

  if (redirect) {
    setTimeout(() => {
            window.history.pushState(
              `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
              "auth-login",
              `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
            );
            window.location.reload();
          }, 500);
}

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Sign-In</BlockTitle>
                <BlockDes>
                  <p>Access using your email and password.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> {errorVal}
                </Alert>
              </div>
            )}
            <Form className="is-alter" onSubmit={onFormSubmit}>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="default-01"
                    name="email"
                    ref={register({ required: "This field is required" })}
                    // defaultValue="info@softnio.com"
                    placeholder="Enter your email address"
                    className="form-control-lg form-control"
                    onChange={e => setEmail(e.target.value)}
                  />
                  {/* {errors.name && <span className="invalid">{errors.name.message}</span>} */}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot Code?
                  </Link>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="passcode"
                    // defaultValue="123456"
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your password"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    onChange={e => setPassword(e.target.value)}  
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </Button>
              </FormGroup>
            </Form>
            <div className="form-note-s2 text-center pt-4">
              {" "}
              New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
            </div>
            <div className="text-center pt-4 pb-3">
              <h6 className="overline-title overline-title-sap">
                <span>OR</span>
              </h6>
            </div>
            <ul className="nav justify-center gx-4">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Facebook
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Google
                </a>
              </li>
            </ul>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;
