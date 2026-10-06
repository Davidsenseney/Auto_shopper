import React, { useEffect, useState } from 'react';

export function VerifyEmailScreen({ onNavigateToLogin }) {
    const [statusState, setStatusState] = useState('verifying'); // 'verifying' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        // 1. Extract ?token=... from browser's URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            setStatusState('error');
            setMessage('No verification token provided in URL.');
            return;
        }

        // 2. Call Django backend
        const verifyToken = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/verify-email/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatusState('success');
                    setMessage(data.message || 'Email verified successfully!');
                } else {
                    setStatusState('error');
                    setMessage(data.message || 'Verification failed or link expired.');
                }
            } catch (err) {
                setStatusState('error');
                setMessage('Network error. Could not connect to verification server.');
            }
        };

        verifyToken();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                {statusState === 'verifying' && (
                    <div>
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Verifying Email...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we confirm your account.</p>
                    </div>
                )}

                {statusState === 'success' && (
                    <div>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            ✓
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Success!</h2>
                        <p className="text-gray-600 mt-2">{message}</p>
                        <button
                            onClick={onNavigateToLogin}
                            className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                        >
                            Go to Sign In
                        </button>
                    </div>
                )}

                {statusState === 'error' && (
                    <div>
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            ✕
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Verification Failed</h2>
                        <p className="text-red-500 mt-2">{message}</p>
                        <button
                            onClick={onNavigateToLogin}
                            className="mt-6 w-full py-2.5 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
                        >
                            Back to Sign In
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
