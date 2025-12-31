import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// PrimeReact imports
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the redirect path from location state (set by ProtectedRoute)
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Validation
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Navigate to the page they tried to access, or dashboard
                navigate(from, { replace: true });
            } else {
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
            <div
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className='grid grid-cols-1 items-center justify-center lg:grid-cols-2 shadow-lg max-w border border-gray-100 dark:border-slate-700 rounded-xl'
            >
                {/* Logo Section */}
                <div className='bg-emerald-700 h-full hidden lg:flex items-center justify-center p-10 relative'>
                    <svg id="Layer_1" className="w-50 h-50 logo-entry" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198.96 171.81">
                        <path fill="#fff" strokeWidth="0px" d="M198.96,133.58c0,16.1-9.96,29.89-24.07,35.52-4.38,1.75-9.16,2.71-14.17,2.71h-50.91c-5.01,0-9.91-.5-14.64-1.46-15.54-3.14-29.3-11.17-39.6-22.43.35.33.72.63,1.1.91,1.93,1.4,4.32,2.22,6.9,2.22,6.52,0,11.81-5.28,11.81-11.82,0-1.19-.18-2.34-.5-3.42-.36-1.19-.91-2.3-1.6-3.3,0-.03-.01-.05-.02-.08,7.61,8.13,17.89,13.71,29.44,15.35.38.06.77.11,1.15.15,1.96.24,3.94.36,5.96.36h50.37c.33,0,.65-.01.97-.03,2.75-.18,5.29-1.11,7.42-2.6,3.82-2.66,6.32-7.08,6.32-12.08s-2.5-9.43-6.32-12.09c-2.38-1.66-5.27-2.63-8.39-2.63h-41.65c-5.2,0-10.16-1.04-14.68-2.92-9.22-3.84-16.62-11.18-20.52-20.37-1.95-4.59-3.03-9.64-3.03-14.94v-42.42c0-.9-.08-1.78-.24-2.63-.68-3.77-2.8-7.05-5.77-9.23-2.43-1.79-5.45-2.85-8.7-2.85s-6.28,1.06-8.71,2.85c-1.88,1.38-3.42,3.2-4.46,5.3-.28.57-.54,1.16-.75,1.78-.14.41-.27.83-.37,1.25-.14.57-.25,1.15-.32,1.73-.07.59-.11,1.19-.11,1.8v42.42c0,5.16-1.02,10.08-2.88,14.57h-.15c-.05.12-.1.25-.15.37-5.82,13.69-19.38,23.29-35.2,23.29-.18,0-.36,0-.54-.01-.35,0-.69-.01-1.03-.02-.15,0-.31-.01-.46-.03-5.87-.6-10.46-5.56-10.46-11.59,0-6.44,5.22-11.64,11.65-11.64h.95c8.17,0,14.78-6.62,14.78-14.78v-44.02c.18-4.69,1.2-9.16,2.92-13.27C36.07,9.7,49.71,0,65.6,0s29.53,9.7,35.3,23.5c1.9,4.53,2.95,9.52,2.95,14.75v43.49c.46,7.71,6.86,13.83,14.68,13.83h46.36c2.94.31,5.77.96,8.47,1.91.52.18,1.03.37,1.53.57,14.11,5.63,24.07,19.42,24.07,35.53Z" />
                        <path fill="#55bd87" strokeWidth="0px" d="M75.38,139.23c0,6.54-5.29,11.82-11.81,11.82-2.58,0-4.97-.82-6.9-2.22-.38-.28-.75-.58-1.1-.91-.59-.53-1.13-1.13-1.59-1.78-.58-.79-1.05-1.65-1.41-2.57-.53-1.34-.82-2.81-.82-4.34,0-6.52,5.28-11.81,11.82-11.81,2.23,0,4.32.61,6.09,1.69,1.44.86,2.67,2.02,3.62,3.4.69,1,1.24,2.11,1.6,3.3.32,1.08.5,2.23.5,3.42Z" />
                    </svg>
                </div>

                {/* Form Section */}
                <div className="max-w-md mx-auto lg:w-full p-8 bg-white dark:bg-slate-800">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400">Please sign in to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4">
                            <Message severity="error" text={error} className="w-full" />
                        </div>
                    )}

                    <div className="w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email
                                </label>
                                <InputText
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3"
                                    placeholder="admin@mylekha.com"
                                    disabled={isSubmitting}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                                <Password
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    inputStyle={{ width: '100%' }}
                                    style={{ width: '100%' }}
                                    toggleMask
                                    feedback={false}
                                    placeholder="••••••••"
                                    disabled={isSubmitting}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="remember"
                                        checked={rememberMe}
                                        onChange={e => setRememberMe(e.checked)}
                                        disabled={isSubmitting}
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                {/* <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                                    Forgot password?
                                </a> */}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                label={isSubmitting ? "Signing in..." : "Sign In"}
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                pt={{
                                    root: {
                                        className: 'w-full rounded text-white py-2 !bg-emerald-700 border-emerald-700 hover:!bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }
                                }}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;