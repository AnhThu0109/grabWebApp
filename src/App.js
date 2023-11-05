import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/subParts/Layout";
import { publicRoutes, userRoutes, welcomeRoute } from "./routes";
import "./index.css";
import Login from "./pages/Login";
import NotFound from "./pages/NotFoundPage";
import Welcome from "./pages/Welcome";
import { UserRoutes } from "./utils/userRoutes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<UserRoutes Component={welcomeRoute.element} />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Layout />}>
            {publicRoutes.map((item, index) => {
              return <Route key={index} path={item.path} element={item.element} />
            })}

            {userRoutes.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={<UserRoutes Component={item.element} />}
                />
              );
            })}
          </Route>
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
