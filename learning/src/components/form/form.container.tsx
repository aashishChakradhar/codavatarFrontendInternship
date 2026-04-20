import { useState, type ChangeEvent, type FormEvent } from "react";
import usePrompt from "../../pages/prompt.page";
import "../../styles/form/form.styles.css";
import { FormComp } from "./form.component.tsx";
import ErrorBoundary from "../errorBoundry/errorBoundry";

function FormContent() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const handleFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    setIsDirty(true);
  };
  const handleLastName = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setIsDirty(true);
  };
  const handleCountry = (e: ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
    setIsDirty(true);
  };
  const handleProvince = (e: ChangeEvent<HTMLInputElement>) => {
    setProvince(e.target.value);
    setIsDirty(true);
  };
  const handleMunicipality = (e: ChangeEvent<HTMLInputElement>) => {
    setMunicipality(e.target.value);
    setIsDirty(true);
  };
  const handlePhone = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setIsDirty(true);
  };
  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsDirty(true);
  };
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsDirty(true);
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsDirty(true);
  };
  const handleShowPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setShowPassword(e.target.checked);
    setIsDirty(true);
  };

  const resetFormState = () => {
    setFirstName("");
    setLastName("");
    setCountry("");
    setProvince("");
    setMunicipality("");
    setPhone("");
    setUsername("");
    setPassword("");
    setEmail("");
    setShowPassword(false);
    setIsDirty(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submittedData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      password,
      country: country.trim(),
      province: province.trim(),
      municipality: municipality.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };
    console.log(submittedData);
    e.currentTarget.reset();
    resetFormState();
  };

  usePrompt(
    "You have unsaved changes. Are you sure you want to leave?",
    isDirty,
  );

  return (
    <FormComp
      handleSubmit={handleSubmit}
      handleFirstName={handleFirstName}
      handleLastName={handleLastName}
      handleCountry={handleCountry}
      handleProvince={handleProvince}
      handleMunicipality={handleMunicipality}
      handlePhone={handlePhone}
      handleEmail={handleEmail}
      handleUsername={handleUsername}
      handlePassword={handlePassword}
      showPassword={showPassword}
      handleShowPassword={handleShowPassword}
      password={password}
    />
  );
}

export default function FormComponent() {
  return (
    <ErrorBoundary>
      <FormContent />
    </ErrorBoundary>
  );
}
