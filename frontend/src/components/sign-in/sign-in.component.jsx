import { useState } from "react";
import "./sign-in.styles.scss";
import { FormInput } from "../form-input/form-input.component";
import { CustomButton } from "../custom-button/custom-button.component";
import { auth, googleProvider } from "../../firebase/firebase.utils";
import { signInWithPopup } from "firebase/auth";

export const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Logging the details on console
    // console.log("Email:", formData.email);
    // console.log("Password:", formData.password);

    // clear the form fields
    setFormData({
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User Info:", user);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="sign-in">
      <h2>I already have an account.</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          type="email"
          name="email"
          value={formData.email}
          handleChange={handleChange}
          label="Email"
          required
        />

        <FormInput
          type="password"
          name="password"
          value={formData.password}
          handleChange={handleChange}
          label="Password"
          required
        />

        <CustomButton type="submit">Sign In</CustomButton>
        <CustomButton onClick={handleClick}>Sign In With Google</CustomButton>
      </form>
    </div>
  );
};
