import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Clock, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const VideoAIAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { videoInfo, url, config } = location.state || {};
  
  const [analyzing, setAnalyzing] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bestMoments, setBestMoments] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState(300); // 5 min default

  useEffect(() => {
    // Simular análise de IA para identificar melhores momentos
    setTimeout(() => {
      generateBestMoments();
      setAnalyzing(false);
    }, 3000);
  }, []);

  const generateBestMoments = () => {
    const duration = videoInfo?.duration || 0;
    const numMoments = Math.floor(duration / 300); // A cada 5 minutos
    const moments = [];

    for (let i = 0; i < Math.min(numMoments, 10); i++) {
      const startTime = i * 300;
      moments.push({
        id: i + 1,
        startTime,
        endTime: startTime + 30,
        score: (9.5 - i * 0.3).toFixed(1),
        thumbnail: videoInfo?.thumbnail,
        label: `REGRA DO ${i + 1}`
      });
    }

    setBestMoments(moments);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProceed = async () => {
    // Iniciar processamento primeiro para obter o jobId
    await startProcessing();
  };

  const startProcessing = async () => {
    setProcessing(true);
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/video/process-clips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          video_url: url || videoInfo?.videoUrl,
          video_duration: videoInfo?.duration || 0,
          clip_duration: config.clipDuration,
          format: config.format,
          framing: config.framing,
          apply_bypass: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/editor', {
          state: {
            videoInfo,
            url: url || videoInfo?.videoUrl,
            jobId: data.job_id,
            numClips: data.num_clips,
            config
          }
        });
      } else {
        alert('Erro ao processar vídeo: ' + (data.detail || 'Erro desconhecido'));
        setProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao iniciar processamento:', error);
      alert('Erro ao processar vídeo: ' + error.message);
      setProcessing(false);
    }
  };

  if (!videoInfo) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Ajuste a duração do seu vídeo
          </h1>
          <p className="text-gray-400">
            Defina a duração de cada corte e até que parte do vídeo a IA deve analisar para encontrar os melhores momentos.
          </p>
        </div>

        {/* Video Info */}
        <Card className="bg-gray-900 border-gray-800 p-4">
          <div className="flex items-center gap-4">
            {videoInfo.thumbnail && (
              <img 
                src={videoInfo.thumbnail} 
                alt={videoInfo.title}
                className="w-24 h-16 object-cover rounded"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <div className="flex-1">
              <p className="text-white font-medium">{videoInfo.title}</p>
              <div className="flex gap-4 mt-1 text-sm text-gray-400">
                <span>⏱️ {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')} min</span>
                {videoInfo.channel && <span>📺 {videoInfo.channel}</span>}
              </div>
            </div>
          </div>
        </Card>

        {/* Duração de cada corte */}
        <div>
          <h3 className="text-white font-semibold mb-4">Duração de cada corte</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 15, label: 'Automático' },
              { value: 30, label: '30 seg' },
              { value: 60, label: '1 min' },
              { value: 90, label: '1:30 min' },
              { value: 180, label: '3 min' },
              { value: 300, label: '5 min' },
              { value: 900, label: '15 min' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => config.clipDuration = option.value}
                className={`p-4 rounded-lg border transition-all ${
                  config.clipDuration === option.value
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <span className={`font-medium ${
                  config.clipDuration === option.value ? 'text-white' : 'text-gray-400'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Intervalo para análise pela IA */}
        <div>
          <h3 className="text-white font-semibold mb-2">Intervalo que será analisado pela IA</h3>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-400 text-sm">00:05:00</span>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-green-500"
                style={{ width: `${(selectedInterval / videoInfo.duration) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm font-medium">
              {Math.floor(selectedInterval / 60)}:{(selectedInterval % 60).toString().padStart(2, '0')} / {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Melhores momentos identificados pela IA */}
          {!analyzing && bestMoments.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <p className="text-white font-medium">Melhores momentos identificados</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {bestMoments.map((moment) => (
                  <div key={moment.id} className="flex-shrink-0 w-32 relative group">
                    <div className="aspect-video bg-gray-800 rounded overflow-hidden">
                      {moment.thumbnail && (
                        <img 
                          src={moment.thumbnail} 
                          alt={`Momento ${moment.id}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                        <span className="text-yellow-400 text-xs font-bold">{moment.label}</span>
                        <span className="text-white text-xs">{formatTime(moment.startTime)}</span>
                      </div>
                      {/* Score badge */}
                      <div className="absolute top-2 right-2 bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                        {moment.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info de créditos */}
          <Card className="mt-4 bg-purple-900/20 border border-purple-700/50 p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm">
                  Cada crédito analisa 1 minuto de vídeo. Você tem 50 créditos — selecionou {Math.floor(selectedInterval / 60)} min de {Math.floor(videoInfo.duration / 60)} min disponíveis
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            disabled={processing}
            className="flex-1 border-gray-700 text-white hover:bg-gray-800"
          >
            Voltar
          </Button>
          <Button
            onClick={handleProceed}
            disabled={analyzing || processing}
            className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90"
          >
            {analyzing ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Analisando...
              </>
            ) : processing ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Próximo →'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoAIAnalysis;
