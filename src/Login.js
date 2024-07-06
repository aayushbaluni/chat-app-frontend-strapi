import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Input, Button, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import { useAuth } from './context/AuthContext';

const { Title } = Typography;

const validationSchema = Yup.object({
  identifier: Yup.string().required('Email or username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const {isLoggedIn,setIsLoggedIn}=useAuth();


  useEffect(()=>{
    if(isLoggedIn)navigate('/');
  },[])

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/auth/local`, {
        identifier: values.identifier,
        password: values.password,
      });

      localStorage.setItem("user", JSON.stringify(response.data?.user));
      localStorage.setItem('jwtToken', response.data.jwt);

      resetForm();
      setIsLoggedIn(true);

      navigate('/'); 
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ api: 'Login failed. Please check your credentials and try again.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <Title level={2} className="login-title">Login</Title>
      <Formik
        initialValues={{ identifier: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="login-form">
            <div className="form-field">
              <label htmlFor="identifier">Email or Username</label>
              <Field as={Input} id="identifier" name="identifier" />
              <ErrorMessage name="identifier" component="div" className="error-message" />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <Field as={Input.Password} id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>
            {errors.api && <Alert message={errors.api} type="error" />}
            <Button type="primary" htmlType="submit" disabled={isSubmitting} block>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
