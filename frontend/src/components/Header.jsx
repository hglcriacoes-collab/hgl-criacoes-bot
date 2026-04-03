import React, { useState, useEffect } from 'react';
import { Bell, User, Globe } from 'lucide-react';
import { userMockData } from '../mockData';

const Header = ({ title }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 0,
    minutes: 4,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Banner de Promoção */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 py-3 px-6 flex items-center justify-center gap-2">
        <span className="text-white font-medium text-sm sm:text-base">
          🎉 {timeLeft.days}D {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
        <span className="text-white/90 text-sm sm:text-base hidden sm:inline">
          — Ferramenta 100% grátis por 24h!
        </span>
        <span className="text-white font-medium text-sm sm:text-base">
          Começa em: {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
        <span className="text-yellow-300">⚡</span>
      </div>

      {/* Header Principal */}
      <header className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <h1 className="text-white text-lg font-medium">{title}</h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Créditos */}
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-sm">💎 {userMockData.credits} Créditos</span>
          </div>

          {/* Notificações */}
          <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Idioma */}
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Globe className="w-4 h-4" />
            <span>{userMockData.language}</span>
          </div>

          {/* User */}
          <button className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;