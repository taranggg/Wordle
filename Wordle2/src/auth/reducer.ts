export interface AuthFormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

export const initialState: AuthFormState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
};

type AuthFormAction =
  | { type: "UPDATE_FIELD"; field: keyof AuthFormState; value: string }
  | { type: "RESET_FORM" };

export function formReducer(
  state: AuthFormState,
  action: AuthFormAction,
): AuthFormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export function validateForm(
  state: AuthFormState,
): Partial<Record<keyof AuthFormState, string>> {
  const errors: Partial<Record<keyof AuthFormState, string>> = {};
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
