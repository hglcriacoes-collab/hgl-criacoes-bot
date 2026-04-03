import React from 'react';
import { Trophy, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const Campeonatos = () => {
  const navigate = useNavigate();

  const mockCampeonatos = [
    {
      id: 1,
      title: 'Campeonato Podpah 2.0',
      description: 'Participe do Campeonato Podpah e transforme os melhores momentos do podcast em cortes virais...',
      prize: 'R$ 5.000,00',
      period: '23/01/2026 - 23/06/2026',
      organizer: 'CORELAB',
      status: 'Ativo',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 2,
      title: 'Campeonato Canal Free',
      description: 'Participe do Campeonato do Canal Free e transforme os melhores momentos do podcast em cortes virais...',
      prize: '???',
      period: '???/2026 - ??/??/2026',
      organizer: 'CORELAB',
      status: 'Finalizado',
      image: 'https://via.placeholder.com/300x400'
    },
    {
      id: 3,
      title: 'Campeonato Podpah',
      description: 'Participe do Campeonato Podpah e transforme os melhores momentos do podcast em cortes virais...',
      prize: '???',
      period: '01/10/2026 - 17/03/2026',
      organizer: 'CORELAB',
      status: 'Finalizado',
      image: 'https://via.placeholder.com/300x400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Campeonatos</h1>
        <p className="text-gray-400">
          Explore os campeonatos de cortes disponíveis
        </p>
      </div>

      {/* Configuration Warning */}
      <Card className="bg-gradient-to-r from-yellow-900/30 via-green-900/30 to-yellow-800/30 border border-yellow-500/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Configuração necessária</h3>
            <p className="text-gray-300 text-sm mb-4">
              Para participar dos campeonatos, você precisa configurar:
            </p>
            <ul className="space-y-2 text-sm text-gray-400 mb-4">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                Chave PIX (necessária para receber prêmios)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Contas de redes sociais (necessárias para enviar vídeos)
              </li>
            </ul>
            <Button 
              onClick={() => navigate('/configuracoes')}
              className="bg-gradient-to-r from-yellow-400 to-green-500 text-black hover:opacity-90"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Configurar agora
            </Button>
          </div>
        </div>
      </Card>

      {/* Campeonatos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCampeonatos.map((camp) => (
          <Card key={camp.id} className="bg-[#1a1a1a] border border-gray-800 overflow-hidden hover:border-gray-700 transition-all">
            {/* Image */}
            <div className="aspect-[3/4] bg-gray-900 relative">
              <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                {camp.status === 'Ativo' ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {camp.status}
                  </span>
                ) : (
                  <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {camp.status}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-2">{camp.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {camp.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Prêmio:</span>
                  <span className="text-green-400 font-semibold">{camp.prize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Período:</span>
                  <span className="text-gray-300 text-xs">{camp.period}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Organizado por:</span>
                  <span className="text-gray-300">{camp.organizer}</span>
                </div>
              </div>
              <Button 
                variant="link" 
                className="text-yellow-400 hover:text-yellow-300 p-0 h-auto text-sm mt-3"
              >
                Clique para mais informações
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Campeonatos;