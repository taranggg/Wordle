import LoginPage from "../components/LoginPage";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const { isDark } = useTheme();
  return <LoginPage isDark={true} />;
}
