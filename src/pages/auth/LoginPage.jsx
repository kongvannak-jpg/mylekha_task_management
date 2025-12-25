import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ CORRECT IMPORTS: Import from specific sub-packages
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

const LoginPage = () => {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
            <div className='grid grid-cols-1 flex items-center justify-center lg:grid-cols-2 shadow-lg w-180 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden'>

                <div className='bg-emerald-700 h-full hidden lg:flex items-center justify-center p-10 relative overflow-hidden'>
                    <img
                        width={300}
                        src="/images/logo.png"
                        alt="Logo"
                        className="animate-logo block"
                    />
                </div>

                {/* --- RIGHT SIDE: FORM --- */}
                <div className="max-w-md mx-auto lg:w-full p-8 bg-white dark:bg-slate-800">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400">Please sign in to your account</p>
                    </div>

                    <div className="w-full">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                <InputText className="w-full p-3" placeholder="admin@mylekha.com" />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                <Password
                                    className="w-full"
                                    inputStyle={{ width: '100%' }}
                                    style={{ width: '100%' }}
                                    toggleMask
                                    feedback={false}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="remember"
                                        checked={checked}
                                        onChange={e => setChecked(e.checked)}
                                    />
                                    <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">Remember me</label>
                                </div>
                                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">Forgot password?</a>
                            </div>

                            <Button label="Sign In" pt={{
                                root: { className: 'w-full rounded text-white py-2 !bg-emerald-700 border-emerald-700 hover:!bg-emerald-600' }
                            }} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;