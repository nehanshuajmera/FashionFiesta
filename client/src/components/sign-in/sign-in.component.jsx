import { useState } from "react";
import "./sign-in.styles.scss";
import { FormInput } from "../form-input/form-input.component";
import { CustomButton } from "../custom-button/custom-button.component";
import { signInWithGoogle } from "../../firebase/firebase.utils";
import { encryptPassword } from "../../utils/encrypt";
import axios from "axios";

export const SignIn = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Encrypt the password before sending it
    const encryptedPassword = encryptPassword(formData?.password);

    // Create an object with the encrypted password
    const signInData = {
      usernameOrEmail: formData?.usernameOrEmail,
      encryptedPassword: encryptedPassword, // Use the encrypted password
    };

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        signInData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // clear the form fields
      setFormData({
        usernameOrEmail: "",
        password: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during signin");
      console.error("SignIn error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = () => {
    signInWithGoogle();
  };

  return (
    <div className="sign-in">
      <h2>I already have an account.</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="usernameOrEmail"
          value={formData?.usernameOrEmail}
          handleChange={handleChange}
          label="Username Or Email"
          required
        />

        <FormInput
          type="password"
          name="password"
          value={formData?.password}
          handleChange={handleChange}
          label="Password"
          required
        />
        <div className="buttons">
          <div className="sign-in-submit-btns">
            <CustomButton type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </CustomButton>
            {error && <p className="error-message">{error}</p>}
          </div>
          <CustomButton isGoogleSignIn onClick={handleClick}>
            Sign In With Google
          </CustomButton>
        </div>
      </form>
    </div>
  );
};
