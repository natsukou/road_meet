'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  const sendCode = () => {
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    console.log('验证码: 123456');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== '123456') {
      setError('验证码错误，请输入 123456');
      return;
    }
    
    const user = {
      phone,
      token: `mock_token_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('roadmeet_user', JSON.stringify(user));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">RoadMeet</h1>
          <p className="text-gray">让相遇更有趣</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              手机号
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={11}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              验证码
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入验证码"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={6}
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={countdown > 0}
                className="px-4 py-3 bg-primary text-white rounded-xl font-medium disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </button>
            </div>
            <p className="text-xs text-gray mt-2">演示验证码: 123456</p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            登录
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray text-sm">
            还没有账号？{' '}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
