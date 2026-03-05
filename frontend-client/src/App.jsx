import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RegisterForm } from './components/Auth/RegisterForm';
import { LoginForm }    from './components/Auth/LoginForm';
import Dashboard  from './pages/Dashboard';
import GamePage   from './pages/GamePage';
import AIGamePage from './pages/AIGamePage';
import RankingPage  from './pages/RankingPage';
import ProfilePage  from './pages/ProfilePage';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login"    element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />

                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/game"      element={<PrivateRoute><GamePage /></PrivateRoute>} />
                        <Route path="/ai-game"   element={<PrivateRoute><AIGamePage /></PrivateRoute>} />
                        <Route path="/ranking"   element={<PrivateRoute><RankingPage /></PrivateRoute>} />
                        <Route path="/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

                        <Route path="/"  element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />
                        <Route path="*"  element={<Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;