import type { ChangeEventHandler, FormEventHandler } from "react";
import { NavLink } from "react-router-dom";

interface FormProps {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleFirstName: ChangeEventHandler<HTMLInputElement>;
  handleLastName: ChangeEventHandler<HTMLInputElement>;
  handleCountry: ChangeEventHandler<HTMLInputElement>;
  handleProvince: ChangeEventHandler<HTMLInputElement>;
  handleMunicipality: ChangeEventHandler<HTMLInputElement>;
  handlePhone: ChangeEventHandler<HTMLInputElement>;
  handleEmail: ChangeEventHandler<HTMLInputElement>;
  handleUsername: ChangeEventHandler<HTMLInputElement>;
  handlePassword: ChangeEventHandler<HTMLInputElement>;
  showPassword: boolean;
  handleShowPassword: ChangeEventHandler<HTMLInputElement>;
  password: string;
}

export function FormComp({
  handleSubmit,
  handleFirstName,
  handleLastName,
  handleCountry,
  handleProvince,
  handleMunicipality,
  handlePhone,
  handleEmail,
  handleUsername,
  handlePassword,
  showPassword,
  handleShowPassword,
  password,
}: FormProps) {
  return (
    <main>
      <NavLink to="/junk">Junk</NavLink>
      <div className="container">
        <h1>Form</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Personal Details</legend>
            <div>
              <label htmlFor="fname">First Name:</label>
              <input
                type="text"
                name="fname"
                id="fname"
                onChange={handleFirstName}
                required
              />
            </div>
            <div>
              <label htmlFor="lname">Last Name:</label>
              <input
                type="text"
                name="lname"
                id="lname"
                onChange={handleLastName}
                required
              />
            </div>
            <div>
              <label htmlFor="country">
                <span>Country:</span>
              </label>
              <input
                type="text"
                name="country"
                id="country"
                onChange={handleCountry}
                required
              />
            </div>
            <div>
              <label htmlFor="province">Province:</label>
              <input
                type="text"
                name="province"
                id="province"
                onChange={handleProvince}
                required
              />
            </div>
            <div>
              <label htmlFor="municipality">Municipality:</label>
              <input
                type="text"
                name="municipality"
                id="municipality"
                onChange={handleMunicipality}
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                onChange={handlePhone}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Account Details</legend>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleEmail}
                required
              />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={handleUsername}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  onChange={handlePassword}
                  required
                  value={password}
                />
                <input
                  type="checkbox"
                  name="togglePassword"
                  id="togglePassword"
                  onChange={handleShowPassword}
                  checked={showPassword}
                  hidden={false}
                />
              </div>
            </div>
          </fieldset>

          <div className="button-group">
            <button type="reset" id="reset-btn">
              Reset
            </button>
            <button type="submit" id="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}