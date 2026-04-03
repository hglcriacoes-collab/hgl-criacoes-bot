import React, { useState } from 'react';
import { Plus, Radio, Filter, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Lives = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('Todas');

  const mockLives = [
    { id: 1, title: 'Live Gaming', creator: '@gamer123', platform: 'Twitch', viewers: '2.4k', thumbnail: 'https://via.placeholder.com/300x200' },
    { id: 2, title: 'Podcast ao vivo', creator: '@podcast', platform: 'YouTube', viewers: '856', thumbnail: 'https://via.placeholder.com/300x200' },
    { id: 3, title: 'Talk Show', creator: '@talkshow', platform: 'Kick', viewers: '1.2k', thumbnail: 'https://via.placeholder.com/300x200' },
    { id: 4, title: 'Gameplay', creator: '@player', platform: 'Twitch', viewers: '645', thumbnail: 'https://via.placeholder.com/300x200' },
  ];

  const platforms = ['Todas', 'Twitch', 'Kick', 'YouTube', 'Trovo'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Radio className="w-8 h-8 text-red-500" />
            Monitoramento de Lives
          </h1>
          <p className="text-gray-400">
            Acompanhe lives em tempo real e cortes ao vivo
          </p>
          <p className="text-yellow-400 text-sm mt-1">
            Ao criar ao vivo fique atento/ligado! 1 corte é criado na cota a cada 1 hora de live normalmente
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90">
              <Plus className="w-5 h-5 mr-2" />
              Criar monitoramento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">Criar monitoramento</DialogTitle>
              <p className="text-gray-400 text-sm">
                Configure a IA para monitorar uma live e gerar cortes automaticamente.
              </p>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-white">Nome</Label>
                <Input placeholder="Nome do monitoramento" className="bg-gray-900 border-gray-700 text-white mt-2" />
              </div>
              <div>
                <Label className="text-white">Link da live *</Label>
                <Input placeholder="https://twitch.tv/seulive" className="bg-gray-900 border-gray-700 text-white mt-2" />
              </div>
              <div>
                <Label className="text-white">Prompt</Label>
                <Textarea 
                  placeholder="quero q vc monitore os momentos mais feras da live"
                  className="bg-gray-900 border-gray-700 text-white mt-2"
                  rows={3}
                />
                <p className="text-gray-500 text-xs mt-1">
                  Descreva o que a IA deve procurar na live (opcional) — sem prompt, usa o padrão
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:opacity-90">
                  Pública
                  <span className="text-xs ml-2">todos podem acessar os cortes</span>
                </Button>
                <Button variant="outline" className="flex-1 border-gray-700 text-white hover:bg-gray-800">
                  Privada
                  <span className="text-xs ml-2">somente você virá os cortes</span>
                </Button>
              </div>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                <p className="text-red-400 text-sm font-medium">⚠️ Saída de monitoramento</p>
                <p className="text-gray-400 text-xs mt-1">
                  Cada corte gerado custa 1 crédito. A cada 5 minutos o plano saindo é debitado. Quando o saldo acabar a live será desabilitada normalmente.
                </p>
                <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto text-xs mt-1">
                  Saiba mais Quantão isso gastará no meu plano da real
                </Button>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Criar monitoramento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="publicas" className="w-full">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="publicas" className="data-[state=active]:bg-gray-800">Lives Públicas</TabsTrigger>
          <TabsTrigger value="meus" className="data-[state=active]:bg-gray-800">Meus Monitoramentos</TabsTrigger>
        </TabsList>

        <TabsContent value="publicas" className="mt-6">
          {/* Platform Filters */}
          <div className="flex gap-3 mb-6">
            {platforms.map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform(platform)}
                className={selectedPlatform === platform 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'border-gray-700 text-white hover:bg-gray-800'
                }
              >
                {platform}
              </Button>
            ))}
          </div>

          {/* Lives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockLives.map((live) => (
              <Card key={live.id} className="bg-[#1a1a1a] border border-gray-800 overflow-hidden hover:border-gray-700 transition-all group cursor-pointer">
                <div className="aspect-video bg-gray-900 relative">
                  <img src={live.thumbnail} alt={live.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    AO VIVO
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {live.viewers} views
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">{live.title}</h3>
                  <p className="text-gray-400 text-sm">{live.creator}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-purple-400 text-xs">{live.platform}</span>
                    <span className="text-red-500 text-xs">● Em andamento</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meus" className="mt-6">
          <div className="text-center py-16">
            <Radio className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Nenhum monitoramento ativo</h3>
            <p className="text-gray-400 mb-4">Crie seu primeiro monitoramento para começar</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lives;