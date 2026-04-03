import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const FilaEconomica = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-900/20 rounded-2xl mb-4">
          <Clock className="w-8 h-8 text-yellow-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Fila Econômica</h1>
        <p className="text-gray-400">Processamento otimizado de vídeos com menor prioridade</p>
      </div>

      <Card className="bg-gradient-to-r from-yellow-900/20 via-green-900/20 to-yellow-800/20 border border-yellow-500/30 p-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-yellow-300">Fila Econômica</h3>
              <p className="text-gray-300 text-sm">Economize créditos com processamento mais lento</p>
            </div>
          </div>

          <div className="space-y-4 text-left w-full mb-6">
            <p className="text-gray-300">
              A Fila Econômica permite processar seus vídeos pagando <strong className="text-yellow-400">menos créditos</strong>, porém com um tempo de espera maior.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-white font-medium">Fila Normal</h4>
                </div>
                <p className="text-gray-400 text-sm mb-2">Processamento imediato</p>
                <p className="text-yellow-400 font-bold">1 crédito = 1 vídeo</p>
              </div>

              <div className="p-4 bg-yellow-900/10 rounded-lg border border-yellow-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <h4 className="text-white font-medium">Fila Econômica</h4>
                </div>
                <p className="text-gray-400 text-sm mb-2">Aguarda disponibilidade</p>
                <p className="text-green-400 font-bold">0.5 créditos = 1 vídeo</p>
              </div>
            </div>
          </div>

          <Button className="bg-gradient-to-r from-yellow-400 to-green-500 text-black hover:opacity-90">
            Ativar Fila Econômica
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FilaEconomica;
