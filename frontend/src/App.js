import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatWidget from './components/ChatWidget';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/Dashboard';
import RedesSociais from './pages/RedesSociais';
import Financeiro from './pages/Financeiro';
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    <div className="App bg-black min-h-screen">
      <BrowserRouter>
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 ml-64">
            <Header title="HGL Oficial" />

            {/* Page Content */}
            <main className="p-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/redes-sociais" element={<RedesSociais />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                {/* Placeholder routes */}
                <Route path="/videos" element={<Dashboard />} />
                <Route path="/projetos" element={<Dashboard />} />
                <Route path="/meus-videos" element={<Dashboard />} />
                <Route path="/lives" element={<Dashboard />} />
                <Route path="/fila-economica" element={<Dashboard />} />
                <Route path="/hub-conteudo" element={<Dashboard />} />
                <Route path="/conteudo" element={<RedesSociais />} />
                <Route path="/agendamento" element={<RedesSociais />} />
                <Route path="/brand-kit" element={<RedesSociais />} />
                <Route path="/campeonatos" element={<Dashboard />} />
                <Route path="/podcasts" element={<Dashboard />} />
                <Route path="/ia" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </div>

        {/* Chat Widget */}
        <ChatWidget />

        {/* Toast Notifications */}
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;