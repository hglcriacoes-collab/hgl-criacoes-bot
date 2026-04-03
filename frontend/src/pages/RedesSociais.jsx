import React from 'react';
import { socialNetworks } from '../mockData';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import * as Icons from 'lucide-react';

const RedesSociais = () => {
  const handleConnect = (network) => {
    alert(`Conectar com ${network.name} - Funcionalidade em desenvolvimento`);
  };

  const getIcon = (iconName) => {
    const Icon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.Share2;
    return Icon;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Redes Sociais</h1>
        <p className="text-gray-400">
          Conecte suas contas e publique em múltiplas plataformas de uma só vez
        </p>
      </div>

      {/* Conectar Plataformas Section */}
      <Card className="bg-gradient-to-r from-purple-900/30 via-purple-800/30 to-pink-900/30 border border-purple-500/30 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Icons.Link className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-purple-300">Conectar Plataformas</h2>
        </div>
      </Card>

      {/* Social Networks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {socialNetworks.map((network) => {
          const Icon = getIcon(network.icon);
          return (
            <Card
              key={network.id}
              className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 transition-all p-6 flex flex-col items-center text-center group"
            >
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${network.color}20` }}
              >
                <Icon className="w-10 h-10" style={{ color: network.color }} />
              </div>

              {/* Name */}
              <h3 className="text-white font-semibold text-lg mb-4">{network.name}</h3>

              {/* Connect Button */}
              <Button
                onClick={() => handleConnect(network)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white border border-gray-700"
              >
                Conectar
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Minhas Contas Section */}
      <Card className="bg-gradient-to-r from-purple-900/30 via-purple-800/30 to-pink-900/30 border border-purple-500/30 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Icons.Link className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-purple-300">Minhas Contas</h2>
          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">0</span>
        </div>
        <p className="text-gray-400 mt-4">Nenhuma conta conectada ainda. Conecte suas redes sociais acima para começar.</p>
      </Card>
    </div>
  );
};

export default RedesSociais;