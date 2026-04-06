import { useState, type ChangeEvent, type FormEvent } from "react";

export default function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleShowPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setShowPassword(e.target.checked);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ firstName, lastName, username, password });
  };

  return (
    <div>
      <h1>Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fname">
          First Name:
          <input
            type="text"
            name="fname"
            id="fname"
            onChange={handleFirstName}
          />
        </label>
        <label htmlFor="lname">
          Last Name:
          <input
            type="text"
            name="lname"
            id="lname"
            onChange={handleLastName}
          />
        </label>
        <br />

        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleUsername}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            onChange={handlePassword}
            value={password}
          />
          <input
            type="checkbox"
            name="togglePassword"
            id="togglePassword"
            onChange={handleShowPassword}
            checked={showPassword}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
