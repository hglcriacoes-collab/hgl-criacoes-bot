import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Plus, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Agendamento = () => {
  const [view, setView] = useState('calendario');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agendamento</h1>
          <p className="text-gray-400">
            Gerencie seus posts agendados para YouTube, Instagram e TikTok
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Calendário
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <List className="w-5 h-5 mr-2" />
            Lista
          </Button>
          <Button className="bg-gradient-to-r from-yellow-500 to-green-500 text-black hover:opacity-90">
            <Clock className="w-5 h-5 mr-2" />
            Agendar em Lote
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90">
            <Plus className="w-5 h-5 mr-2" />
            Novo Post
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="border-2 border-dashed border-gray-800 rounded-xl p-16 text-center mt-8">
        <div className="w-20 h-20 bg-yellow-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CalendarIcon className="w-10 h-10 text-yellow-400" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">
          Nenhum post agendado
        </h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Agende seus vídeos para serem publicados automaticamente nas suas redes sociais conectadas
        </p>
        <Button className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90">
          <Plus className="w-5 h-5 mr-2" />
          Criar Primeiro Agendamento
        </Button>
      </div>

      {/* Info */}
      <Card className="bg-blue-900/20 border border-blue-700/30 p-4">
        <div className="flex items-start gap-3">
          <CalendarIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">Dica:</p>
            <ul className="space-y-1 text-gray-400">
              <li>• Agende posts com até 30 dias de antecedência</li>
              <li>• Publique em múltiplas redes ao mesmo tempo</li>
              <li>• Edite ou cancele agendamentos a qualquer momento</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Agendamento;