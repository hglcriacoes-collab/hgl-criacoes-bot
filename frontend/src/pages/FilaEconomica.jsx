import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const FilaEconomica = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Fila Econômica</h1>
        </div>
        <p className="text-gray-400">
          Projetos agendados para processamento em horário de baixa demanda
        </p>
      </div>

      {/* Status Card */}
      <Card className="bg-gradient-to-r from-purple-900/20 via-purple-800/20 to-pink-900/20 border border-purple-500/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-300">Fila Econômica</h3>
              <p className="text-gray-400 mt-1">Tempo estimado: 0min</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">0%</div>
            <p className="text-gray-400 text-sm">Saldo disponível</p>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      <div className="border-2 border-dashed border-gray-800 rounded-xl p-16 text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">
          Nenhum projeto agendado
        </h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Ao criar um projeto, escolha a opção "Fila Econômica" para agendar<br />
          o processamento em horário de menor demanda
        </p>
        <Button 
          className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90"
          onClick={() => window.location.href = '/dashboard'}
        >
          Criar Novo Projeto
        </Button>
      </div>

      {/* Info Box */}
      <Card className="bg-blue-900/20 border border-blue-700/30 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">Como funciona a Fila Econômica?</p>
            <ul className="space-y-1 text-gray-400">
              <li>• Projetos são processados em horários de menor demanda</li>
              <li>• Economia de até 50% nos créditos</li>
              <li>• Tempo de processamento pode variar entre 1-6 horas</li>
              <li>• Você recebe notificação quando o vídeo estiver pronto</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FilaEconomica;