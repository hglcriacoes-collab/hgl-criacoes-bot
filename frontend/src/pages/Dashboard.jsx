import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { tools, recentProjects } from '../mockData';
import * as Icons from 'lucide-react';

const Dashboard = () => {
  const [videoUrl, setVideoUrl] = useState('');

  const getIcon = (iconName) => {
    const Icon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-/g, '')] || Icons.Film;
    return Icon;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Seu próximo viral começa aqui
        </h1>
      </div>

      {/* Upload Section */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* URL Input */}
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Cole um link do Youtube, Google Drive ou .mp4"
              className="bg-gray-800/50 border-gray-700 text-white pl-12 py-6 text-base"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-white mb-2">Envie seu arquivo</p>
            <p className="text-gray-500 text-sm">MP4, MOV, MKV ou AVI. Máximo 10 horas ou 4GB</p>
          </div>

          {/* Generate Button */}
          <Button className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:opacity-90 text-white py-6 text-lg font-semibold">
            <Sparkles className="w-5 h-5 mr-2" />
            Gerar Clipes
          </Button>
        </div>
      </Card>

      {/* Ferramentas */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">FERRAMENTAS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = getIcon(tool.icon);
            return (
              <Card
                key={tool.id}
                className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 transition-all p-6 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Últimos Projetos */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">ÚLTIMOS PROJETOS</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Ver todos →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 transition-all overflow-hidden group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                  {project.status}
                </div>
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  ● LIVE
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-3">
                  🕒 {project.duration} ⏱️ {project.duration.split('—')[1]}
                </p>
                <div className="flex gap-2">
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs">{project.views}</span>
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs">{project.engagement}</span>
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs">{project.algorithm}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;