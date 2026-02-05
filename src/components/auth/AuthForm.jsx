import React, { useState } from 'react';
import { useAuth } from '../../context/auth-context';

const AuthForm = ({ mode = 'login', onToggleMode }) => {
    const { login, register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            let result;
            if (mode === 'login') {
                result = await login(formData.email, formData.password);
            } else {
                result = await register({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    deviceId: localStorage.getItem('device_id')
                });
            }

            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: 'white' }}>
                {mode === 'login' ? 'Bienvenido de nuevo' : 'Crear Cuenta'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {mode === 'register' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text" name="firstName" placeholder="Nombre" required
                            className="input-text" autoComplete="given-name"
                            value={formData.firstName} onChange={handleChange}
                            style={{ flex: 1 }}
                        />
                        <input
                            type="text" name="lastName" placeholder="Apellido"
                            className="input-text" autoComplete="family-name"
                            value={formData.lastName} onChange={handleChange}
                            style={{ flex: 1 }}
                        />
                    </div>
                )}

                <input
                    type="email" name="email" placeholder="Correo electrónico" required
                    className="input-text" autoComplete="email"
                    value={formData.email} onChange={handleChange}
                />

                <div>
                    <input
                        type="password" name="password" placeholder="Contraseña" required
                        className="input-text"
                        autoComplete={mode === 'login' ? "current-password" : "new-password"}
                        value={formData.password} onChange={handleChange}
                        style={{ width: '100%' }}
                    />
                    {mode === 'register' && (
                        <div style={{ marginTop: '5px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                            <p style={{ margin: 0 }}>⚠️ Requisitos:</p>
                            <ul style={{ margin: '2px 0 0 15px', padding: 0 }}>
                                <li>Mínimo 6 caracteres</li>
                                <li>1 Mayúscula, 1 Minúscula, 1 Número</li>
                            </ul>
                        </div>
                    )}
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '10px',
                        color: '#fca5a5',
                        fontSize: '0.85rem'
                    }}>
                        {Array.isArray(error) ? (
                            <ul style={{ margin: '0 0 0 15px', padding: 0 }}>
                                {error.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        ) : (
                            <span>{error}</span>
                        )}
                    </div>
                )}

                <button type="submit" className="btn-upload" disabled={loading}
                    style={{
                        justifyContent: 'center',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        marginTop: '5px',
                        opacity: loading ? 0.7 : 1
                    }}>
                    {loading ? 'Procesando...' : (mode === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
                </button>
            </form>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button onClick={onToggleMode}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                    {mode === 'login' ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;