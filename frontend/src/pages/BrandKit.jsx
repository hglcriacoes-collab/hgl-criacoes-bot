import React from 'react';
import { Palette, Plus, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const BrandKit = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Brand Kit</h1>
          <p className="text-gray-400">
            Gerencie seus brand kits e personalize suas criações
          </p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90">
          <Plus className="w-5 h-5 mr-2" />
          Criar Brand Kit
        </Button>
      </div>

      {/* Empty State */}
      <div className="border-2 border-dashed border-gray-800 rounded-xl p-16 text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Palette className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">
          Nenhum brand kit criado ainda.
        </h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Clique em "Criar Brand Kit" para começar.
        </p>
      </div>

      {/* Info Box */}
      <Card className="bg-yellow-900/20 border border-yellow-700/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Palette className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">O que é um Brand Kit?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Um Brand Kit permite que você salve logos, cores e fontes personalizadas para usar em todos os seus vídeos, mantendo uma identidade visual consistente.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Adicione seu logo e ele aparecerá automaticamente em todos os vídeos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Defina cores da sua marca para legendas e elementos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Escolha fontes personalizadas para seu conteúdo</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BrandKit;