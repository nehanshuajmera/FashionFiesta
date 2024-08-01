import { useState } from 'react';
import './sign-in.styles.scss';

export const SignIn = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Logging the details on console
    console.log("Email:", formData.email);
    console.log("Password:", formData.password);

    // clear the form fields
    setFormData({
      email: '',
      password: ''
    })
  }

  const handleChange = e => {
    const { value, name } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name] : value
    }))
  }

  return (
    <div className="sign-in">
      <h2>I already have an account.</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>

        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}