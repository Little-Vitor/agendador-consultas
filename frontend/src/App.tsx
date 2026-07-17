import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { ConsultasPage } from "./pages/ConsultasPage";
import { MedicosPage } from "./pages/MedicosPage";
import { PacientesPage } from "./pages/PacientesPage";
import { Layout } from "./pages/components/Layout";
import { ProtectedRoute } from "./pages/components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/consultas"
            element={
              <ProtectedRoute>
                <Layout>
                  <ConsultasPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicos"
            element={
              <ProtectedRoute>
                <Layout>
                  <MedicosPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pacientes"
            element={
              <ProtectedRoute>
                <Layout>
                  <PacientesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/consultas" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
