import { useState } from 'react';
import api from '../../api/axiosConfig';
import { redirect } from 'react-router-dom';

export const RegisterForm = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpiar errores previos
    try {
        await api.post('/register', formData);
        alert("¡Registro éxito! Ahora loguéate.");
        redirect('/login'); // Redirigir al login tras registrarse
    } catch (err) {
        if (err.response && err.response.status === 400) {
            // Guardamos los errores que envía Laravel (email, password, etc)
            setErrors(err.response.data.errors || err.response.data);
        } else {
            console.error("Error inesperado", err);
        }
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