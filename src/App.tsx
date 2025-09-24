import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "./components/screens/LoadingScreen/LoadingScreen"
import { Navbar } from "./components/UI/Navbar/Navbar"
import { AppRouter } from "./routes/AppRouter"
import { useEffect } from "react";
import { setNavigator } from "./routes/navigation";


export const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);
  return (
    <>
      <AppRouter />
    </>
  )
}
