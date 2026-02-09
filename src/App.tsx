import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";

import { setNavigator } from "./utils/navigation";
import { useEffect } from "react";
import "./App.css"
import DashBoardLayout from "./pages/DashBoardLayout";
import DashBoard from "./pages/DashBoard";
import Users from "./pages/Users";
import Games from "./pages/Games";
import GameUpload from "./pages/GameUpload";
function NavigatorSetup()
{
  const navigate = useNavigate();
  useEffect(()=>
  {
    setNavigator(navigate);
  },[navigate]);
  return null;
}

function App() {

  return(
    <BrowserRouter>
    <NavigatorSetup/>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route element={<PrivateRoute role="ROLE_ADMIN"/>}>
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route index element={<DashBoard />}></Route>
            <Route path="/dashboard/users" element={<Users/>}></Route>
            <Route path="/dashboard/games" element={<Games/>}></Route>
            <Route path="/dashboard/games/upload" element={<GameUpload />} />
          </Route>
          
      </Route>
     
      
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
