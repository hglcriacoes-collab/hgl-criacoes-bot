import React, { useState } from 'react';
import { Video, Filter, Search, Download, Eye, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const MeusVideos = () => {
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Meus Vídeos</h1>
        <Button className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90 mt-2">
          Atualizar lista
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-yellow-900/30 via-green-900/30 to-yellow-800/30 border border-yellow-500/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Video className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Remova a marca d'água</h3>
            <p className="text-gray-300 text-sm">
              Assine qualquer plano para remover a marca d'água de todos os seus vídeos. Os vídeos gerados após a assinatura serão automaticamente sem marca d'água.
            </p>
            <Button variant="link" className="text-yellow-400 hover:text-yellow-300 p-0 h-auto text-sm mt-1">
              Ver planos disponíveis →
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">Filtrar por projeto</span>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="bg-gray-900 border-gray-700 text-white pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-64 bg-gray-900 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os projetos</SelectItem>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="antigos">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Filters */}
      <div className="space-y-3">
        <span className="text-white font-medium">Status de Geração</span>
        <div className="flex gap-4 text-sm">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-3 h-3 border-2 border-gray-600 rounded-full"></div>
            Pendente
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-3 h-3 border-2 border-green-500 rounded-full bg-green-500/20"></div>
            Processando
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-3 h-3 border-2 border-green-500 rounded-full bg-green-500"></div>
            Concluído
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="border-2 border-dashed border-gray-800 rounded-xl p-16 text-center mt-8">
        <div className="w-20 h-20 bg-yellow-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Video className="w-10 h-10 text-yellow-400" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">
          Nenhum vídeo encontrado.
        </h3>
        <p className="text-gray-400 mb-6">
          Gere seus cortes para ver os vídeos aqui
        </p>
      </div>
    </div>
  );
};

export default MeusVideos;
