import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Input, Button, Typography, Alert, Space } from 'antd';
import './Register.css';
import {useNavigate} from "react-router-dom"
import { useAuth } from './context/AuthContext';

const { Title } = Typography;

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
   const navigate= useNavigate();
   const {isLoggedIn, setIsLoggedIn}=useAuth();

  useEffect(()=>{
    if(isLoggedIn)navigate('/');
  },[])
  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    console.log("Submitting registration form", values);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/auth/local/register`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });


      localStorage.setItem("user", JSON.stringify(response.data?.user));
      localStorage.setItem('jwtToken', response.data.jwt);
      setIsLoggedIn(true);
      navigate('/');

      resetForm();
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setErrors({ api: 'Registration failed. Please try again later.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="register-container">
      <Title level={2} className="register-title">Register</Title>
      <Formik
        initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="register-form">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <label>Username</label>
                <Field as={Input} name="username" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>
              <div>
                <label>Email</label>
                <Field as={Input} name="email" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>
              <div>
                <label>Password</label>
                <Field as={Input.Password} name="password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <div>
                <label>Confirm Password</label>
                <Field as={Input.Password} name="confirmPassword" />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>
              {errors.api && <Alert message={errors.api} type="error" />}
              <Button type="primary" htmlType="submit" disabled={isSubmitting} block>
                Register
              </Button>
            </Space>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
