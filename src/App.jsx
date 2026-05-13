import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext.jsx';
import Header from './components/layout/Header.jsx';
import Navigation from './components/layout/Navigation.jsx';
import ToastContainer from './components/common/Toast.jsx';
import Hoje from './pages/Hoje.jsx';
import EditaisObjetiva from './pages/EditaisObjetiva.jsx';
import EditaisDiscursiva from './pages/EditaisDiscursiva.jsx';
import Desempenho from './pages/Desempenho.jsx';
import Conquistas from './pages/Conquistas.jsx';
import Ajustes from './pages/Ajustes.jsx';

export default function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <Header />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/hoje" replace />} />
            <Route path="/hoje" element={<Hoje />} />
            <Route path="/editais-objetiva" element={<EditaisObjetiva />} />
            <Route path="/editais-discursiva" element={<EditaisDiscursiva />} />
            <Route path="/desempenho" element={<Desempenho />} />
            <Route path="/conquistas" element={<Conquistas />} />
            <Route path="/ajustes" element={<Ajustes />} />
            <Route path="*" element={<Navigate to="/hoje" replace />} />
          </Routes>
        </main>
        <Navigation />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
