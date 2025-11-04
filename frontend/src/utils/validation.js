export const validateLogin = (mobile) => {
  if (!mobile) return "Please enter mobile number";
  if (mobile.length < 10) return "Please enter valid mobile number";
  return null;
};

export const validateRegister = (form) => {
  console.log("Validating form data:", form);

  if (!form.name || form.name.trim() === "") {
    console.log("Validation failed: name is empty");
    return "Please enter name";
  }
  if (!form.email || form.email.trim() === "") {
    console.log("Validation failed: email is empty");
    return "Please enter email";
  }
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    console.log("Validation failed: invalid email format");
    return "Please enter valid email";
  }
  if (!form.mobile || form.mobile.trim() === "") {
    console.log("Validation failed: mobile is empty");
    return "Please enter mobile number";
  }
  if (form.mobile.length < 10) {
    console.log("Validation failed: mobile number too short");
    return "Please enter valid mobile number";
  }
  if (!form.gender || form.gender.trim() === "") {
    console.log("Validation failed: gender not selected");
    return "Please select gender";
  }


  console.log("Validation passed");
  return null;
};
