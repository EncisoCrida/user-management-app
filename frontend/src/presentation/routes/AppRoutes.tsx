import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UsersPage from "../pages/UsersPage";
import CreateUserPage from "../pages/CreateUserPage";
import EditUserPage from "../pages/EditUserPage";
import ProfilePage from "../pages/ProfilePage";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLICAS */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* PRIVADAS */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/users/new"
          element={
            <PrivateRoute>
              <CreateUserPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/users/:id/edit"
          element={
            <PrivateRoute>
              <EditUserPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}