import { useState } from 'react';
import './sign-in.styles.scss';

export const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    email = ""
    password = ""
  }

  const handleChange = e => {
    const { value, name } = e.target;

    
  }

  return (
    <div className="sign-in">
      <h2>I already have an account.</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
        />
        <label htmlFor="">Email</label>

        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        />
        <label htmlFor="">Password</label>

        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}