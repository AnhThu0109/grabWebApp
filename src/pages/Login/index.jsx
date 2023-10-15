import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginUser from '../../utils/loginUser';
import { Input, Checkbox } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './style.css'; 
import "./../style.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(true);
  const [errMess, setErrMess] = useState("");
  const [token, setToken] = useState(1);
  const navigate = useNavigate();
  const setRootBackground = () => {
    document.documentElement.style.setProperty(
      '--bg-color1',
      '#BFEBE3' // Replace with your desired background color for the login page
    );
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCheckboxChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };


  //Submit function for login form
  const handleSubmit = async (event) => {
    event.preventDefault();
    let user = {
      "username": username,
      "password": password,
    }
    try {
      const response = await loginUser(user);
      console.log(response);
      if (response.ok){
        const data = await response.json();

        //Set needed localStorage (token, id, firstname, active of side nav, isAdmin)
        localStorage.setItem("token", data.accessToken);
        setToken(data.accessToken);
        localStorage.setItem("id", data._id);
        localStorage.setItem("isAdmin", data.isAdmin);
        setToken(data.accessToken);       
        navigate("/home");
      }   
      else if (response.status === 404) { // handle 404 error for checking wrong password
        setIsAuth(false);
        setErrMess("Incorrect password");
      } else { //wrong username ==> error 500
        setIsAuth(false);
        setErrMess("User not found");
      }
    } catch (error) {
      console.error(error);   
    }
  };

  useEffect(() => {
    setRootBackground();
  }, [])

  return (
    <div className='loginPage py-5 px-3 row justify-content-around align-items-center'>
      <div className='col-6'>    
        <div className='loginForm'>
        <form onSubmit={handleSubmit} className="p-5 rounded-3 bg-white">
          <h4 className='text-center textGreen1'>Login to GrabApp</h4> 
          <div className='mb-sm-2 mb-lg-3 login-input-div'>
            <label htmlFor="text" className='form-label textBlue3'>Username:</label>
            <Input placeholder="Your Username" id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              required/>
          </div>
          
          <div className='mb-sm-2 mb-lg-3 login-input-div'>
            <label htmlFor="password" className='form-label textBlue3'>Password:</label>
            <Input.Password
              placeholder="Your Password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className='d-flex justify-content-between'>
            <Checkbox className='textGrey2' onChange={handleCheckboxChange}>Remember me</Checkbox>
            <Link className='textGrey2'><small>Forgot Password</small></Link>
          </div>
          <button type="submit" className='mt-3 mb-3 btn formLoginBtn'>Login</button>
        </form>
        </div>     

        {/* Show error message if wrong username or wrong password */}
        {
          isAuth === false && (
            <h5 className='text-danger pt-4 text-center'>{errMess}. Please type again.</h5>
          )
        }
      </div>
      <div className='col-5'>
        <img className='loginImg' src='images/gifDriver.gif' alt='loginImage'/>
        <h3 className='text-center textGrey1'><b>YOUR FUTURE<br/>is created by what you do<br/>TODAY</b></h3>
      </div>
    </div>
  );
};

export default Login;
