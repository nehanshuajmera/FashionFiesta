import "./sign-up.styles.scss";
import { useState } from "react";
import axios from "axios";
import { encryptPassword } from "../../utils/encrypt";
import { FormInput } from "../form-input/form-input.component";
import { CustomButton } from "../custom-button/custom-button.component";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    displayname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Encrypt the password before sending it
    const encryptedPassword = encryptPassword(password);

    // Create an object with the encrypted password
    const signUpData = {
      displayName: formData.displayname,
      userName: formData.username,
      email: formData.email,
      encryptedPassword: encryptedPassword, // Use the encrypted password
    };

    // console.log("Sign Up Data: ", signUpData);
    // console.log("Password: ",password)
    // console.log("Encrypted Password: ",encryptedPassword)

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/signup`,
        signUpData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Clear form fields on successful signup
      setFormData({
        displayname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during signup");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up">
      <h2 className="title">I do not have a account</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="displayname"
          label="Name"
          value={formData.displayname}
          handleChange={handleChange}
          required
        />
        <FormInput
          type="text"
          name="username"
          label="Username"
          value={formData.username}
          handleChange={handleChange}
          required
        />
        <FormInput
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          handleChange={handleChange}
          required
        />
        <FormInput
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          handleChange={handleChange}
          required
        />
        <FormInput
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          handleChange={handleChange}
          required
        />
        <CustomButton type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </CustomButton>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};
