import { ChangeEvent, FC, FormEvent, useState } from "react";
import { login } from "../../services/auth2";
import { useAuthContext } from "../../hooks/useAuthContext";
import { LOGIN } from "../../constants/actions";
import { useNavigate } from "react-router-dom";
import style from "./SignIn.module.scss";

type FormDataType = {
  email: string;
  password: string;
};

const SignIn: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const { dispatch } = useAuthContext();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await login(formData);
      if (response) {
        localStorage.setItem("token", response.token);
        dispatch({
          type: LOGIN,
          payload: { token: response.token, user: response.user },
        });
      }
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login failed", error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className={style["signin"]} onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      {error && <p className={style["error"]}>{error}</p>}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        required
        placeholder="Password"
      />
      <button type="submit">Login</button>
      {/* <Link to="/reset-password">Forgot password?</Link> */}
    </form>
  );
};

export default SignIn;