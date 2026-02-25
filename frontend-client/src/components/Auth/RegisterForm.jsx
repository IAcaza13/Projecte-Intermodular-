import { useState } from 'react';
import api from '../../api/axiosConfig';

export const RegisterForm = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', formData);
            alert("Registro completado. Ahora puedes iniciar sesión.");
        } catch (err) {
            setErrors(err.response.data); // Muestra errores de validación de Laravel [cite: 65]
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
            <input 
                type="text" placeholder="Username" 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                className="p-2 border"
            />
            {errors.username && <span className="text-red-500">{errors.username[0]}</span>}
            
            <input 
                type="email" placeholder="Email" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="p-2 border"
            />
            
            <input 
                type="password" placeholder="Contraseña (mín. 6 caracteres)" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="p-2 border"
            />
            
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Registrarse</button>
        </form>
    );
};