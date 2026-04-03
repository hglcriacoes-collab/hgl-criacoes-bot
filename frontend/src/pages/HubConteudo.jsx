import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';

const HubConteudo = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const mockProjects = [
    {
      id: 1,
      title: 'TRUMP, CRISE NO PETRÓLEO E OS DESDOBRAMENTOS DA GUERRA',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      clips: 27,
      duration: '48:33',
      createdAt: '2 dias atrás'
    },
    {
      id: 2,
      title: 'Análise do Mercado Financeiro',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      clips: 15,
      duration: '32:15',
      createdAt: '5 dias atrás'
    },
    {
      id: 3,
      title: 'Como Investir em 2026',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      clips: 22,
      duration: '56:42',
      createdAt: '1 semana atrás'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hub de conteúdo</h1>
          <p className="text-gray-400">
            Explore projetos de outros usuários e copie cortes para sua conta. Copiar clipes é gratuito!
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar projetos..."
            className="bg-gray-900 border-gray-700 text-white pl-10"
          />
        </div>
        <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProjects.map((project) => (
          <Card
            key={project.id}
            onClick={() => navigate('/editor', { state: { videoInfo: project } })}
            className="bg-[#1a1a1a] border border-gray-800 overflow-hidden hover:border-gray-700 transition-all cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-900 relative overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                {project.duration}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 line-clamp-2">{project.title}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-400">{project.clips} clips</span>
                <span className="text-gray-500">{project.createdAt}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HubConteudo;