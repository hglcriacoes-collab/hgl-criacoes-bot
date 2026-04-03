import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Play, Scissors, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const VideoEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [clips, setClips] = useState([]);
  const [progress, setProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState('processing');
  
  const videoInfo = location.state?.videoInfo || {
    title: 'Vídeo sem título',
    duration: 0,
    thumbnail: null,
    videoUrl: null
  };
  
  const jobId = location.state?.jobId;
  const numClips = location.state?.numClips || 0;

  const steps = [
    { id: 1, name: 'Baixando vídeo', icon: '⬇️' },
    { id: 2, name: 'Transcrevendo áudio', icon: '🎙️' },
    { id: 3, name: 'Analisando com IA', icon: '🤖' },
    { id: 4, name: 'Criando cortes', icon: '✂️' },
    { id: 5, name: 'Finalizando análise', icon: '✅' }
  ];

  useEffect(() => {
    // Simular processamento
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 5) {
          clearInterval(interval);
          setProcessing(false);
          // Gerar clips mockados
          generateMockClips();
          return 5;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const generateMockClips = () => {
    const mockClips = [
      { id: 1, score: 9.2, title: 'Momento épico', duration: '0:52', start: '22:19', end: '23:11', thumbnail: videoInfo.thumbnail },
      { id: 2, score: 9.0, title: 'Reação incrível', duration: '0:52', start: '9:05', end: '9:57', thumbnail: videoInfo.thumbnail },
      { id: 3, score: 9.0, title: 'Análise profunda', duration: '0:52', start: '20:25', end: '21:17', thumbnail: videoInfo.thumbnail },
      { id: 4, score: 8.7, title: 'Discussão intensa', duration: '0:42', start: '8:03', end: '8:45', thumbnail: videoInfo.thumbnail },
      { id: 5, score: 8.5, title: 'Momento tenso', duration: '1:02', start: '11:38', end: '12:40', thumbnail: videoInfo.thumbnail }
    ];
    setClips(mockClips);
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-2xl w-full px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 via-yellow-300 to-green-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Estamos processando seu vídeo...</h1>
            <p className="text-gray-400">Tempo estimado: 12 min</p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  currentStep >= step.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-800 bg-gray-900/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? 'bg-gradient-to-br from-yellow-400 to-green-500' : 'bg-gray-800'
                }`}>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    currentStep >= step.id ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                </div>
                {currentStep === step.id && (
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                )}
                {currentStep > step.id && (
                  <span className="text-green-500 text-2xl">✓</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              O processamento continuará em segundo plano
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{videoInfo.title}</h1>
            <p className="text-gray-400 text-sm">Análise concluída • {clips.length} clips gerados</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90">
            <Download className="w-4 h-4 mr-2" />
            Baixar Todos
          </Button>
        </div>
      </div>

      {/* Clips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clips.map((clip) => (
          <Card key={clip.id} className="bg-[#1a1a1a] border border-gray-800 overflow-hidden hover:border-gray-700 transition-all group">
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-900 relative overflow-hidden">
              {clip.thumbnail && (
                <img 
                  src={clip.thumbnail} 
                  alt={clip.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Play className="w-8 h-8 text-black" />
                </div>
              </div>
              {/* Score Badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-green-500 text-black px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">{clip.score}</span>
              </div>
              {/* Duration */}
              <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm">
                {clip.duration}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">{clip.title}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {clip.start} - {clip.end}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-green-500 text-black hover:opacity-90"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Baixar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                >
                  <Scissors className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoEditor;