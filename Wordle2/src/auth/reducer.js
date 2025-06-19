export const initialState = {
  name: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: "",
  gender: "",
};

export function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}
export function validateForm(state) {
  const errors = {};
  if (!state.name) errors.name = "First name is required.";
  if (!state.lastName) errors.lastName = "Last name is required.";
  if (!state.username) errors.username = "Username is required.";
  if (!state.email) errors.email = "Email is required.";
  if (!state.password) errors.password = "Password is required.";
  if (state.password !== state.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  if (!state.age || isNaN(state.age) || state.age <= 0)
    errors.age = "Valid age is required.";
  if (!state.gender) errors.gender = "Gender is required.";
  return errors;
}
