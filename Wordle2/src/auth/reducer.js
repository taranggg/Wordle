export const initialState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
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
  if (!state.firstName?.trim()) errors.firstName = "First name is required.";
  if (!state.username?.trim()) errors.username = "Username is required.";
  if (!state.email?.trim()) errors.email = "Email is required.";
  if (!state.password) errors.password = "Password is required.";
  if (state.password && state.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (state.password !== state.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  if (state.gender) {
    const allowed = ["male", "female", "other", "preferNotToSay"];
    if (!allowed.includes(state.gender)) errors.gender = "Invalid selection.";
  }
  return errors;
}
