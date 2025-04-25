import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SoundMixPage from "../pages/soundMixPage";
import ProtectedRoute from "../HOC/protectedRoute";

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/mix"
          element={
            <ProtectedRoute>
              <SoundMixPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mix/:id"
          element={
            <ProtectedRoute>
              <SoundMixPage />
            </ProtectedRoute>
          }
        />{" "}
      </Routes>
    </>
  );
};

export default MainRoutes;
