import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  Video, 
  Share2, 
  Calendar,
  Tag,
  Megaphone,
  Layers,
  Package,
  BarChart3,
  Mic,
  Zap,
  HelpCircle,
  MessageSquare,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/financeiro', icon: DollarSign, label: 'Financeiro' },
    { 
      path: '/videos', 
      icon: Video, 
      label: 'Vídeos',
      subItems: [
        { path: '/projetos', label: 'Projetos' },
        { path: '/meus-videos', label: 'Meus Vídeos' },
        { path: '/lives', label: 'Lives' },
        { path: '/fila-economica', label: 'Fila Econômica' },
        { path: '/hub-conteudo', label: 'Hub de conteúdo' }
      ]
    },
    {
      path: '/conteudo',
      icon: Layers,
      label: 'Conteúdo',
      subItems: [
        { path: '/redes-sociais', label: 'Redes Sociais' },
        { path: '/agendamento', label: 'Agendamento' },
        { path: '/brand-kit', label: 'Brand Kit' }
      ]
    },
    {
      path: '/campeonatos',
      icon: BarChart3,
      label: 'Campeonatos',
      subItems: [
        { path: '/podcasts', label: 'Podcasts' },
        { path: '/ia', label: 'IA' }
      ]
    },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-gray-800 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">HGL Oficial</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
            {item.subItems && (
              <div className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                      isActive(subItem.path)
                        ? 'text-purple-400'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="flex items-center gap-3 px-4 py-2 text-green-400 hover:text-green-300 transition-all w-full text-left">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm">Suporte</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2 text-blue-400 hover:text-blue-300 transition-all w-full text-left">
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm">Discord</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;