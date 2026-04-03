import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Video, Smartphone, Monitor, Sparkles, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const VideoConfigPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { videoInfo, url } = location.state || {};
  
  const [format, setFormat] = useState('vertical'); // vertical ou horizontal
  const [framing, setFraming] = useState('automatico'); // automatico, centro, foco, tela-dividida, repost
  const [clipDuration, setClipDuration] = useState('automatico'); // automatico, 30, 60, 90, 180, 300, 900
  const [calculatedClips, setCalculatedClips] = useState(null);

  // Opções de duração
  const durationOptions = [
    { value: 'automatico', label: 'Automático', seconds: 15, icon: '⚡' },
    { value: '30', label: '30 seg', seconds: 30, icon: '⏱️' },
    { value: '60', label: '1 min', seconds: 60, icon: '⏱️' },
    { value: '90', label: '1:30 min', seconds: 90, icon: '⏱️' },
    { value: '180', label: '3 min', seconds: 180, icon: '⏱️' },
    { value: '300', label: '5 min', seconds: 300, icon: '⏱️' },
    { value: '900', label: '15 min', seconds: 900, icon: '⏱️' }
  ];

  // Calcular cortes baseado na lógica matemática do usuário
  useEffect(() => {
    if (videoInfo && videoInfo.duration) {
      const selectedOption = durationOptions.find(opt => opt.value === clipDuration);
      const desiredDuration = selectedOption ? selectedOption.seconds : 15;
      
      const totalSeconds = videoInfo.duration;
      
      // Lógica: dividir total pela duração desejada e arredondar
      const numClips = Math.round(totalSeconds / desiredDuration);
      
      // Calcular duração real de cada corte
      const realDuration = totalSeconds / numClips;
      
      setCalculatedClips({
        numClips,
        realDuration,
        totalSeconds,
        desiredDuration
      });
    }
  }, [clipDuration, videoInfo]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')} min` : `${secs} seg`;
  };

  const handleNext = async () => {
    // Timestamp para forçar nova versão: 2026-04-03-23:00
    console.log('VideoConfigPage - Versão Nova: 2026-04-03-23:00');
    
    try {
      // Chamar API para processar os cortes
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        navigate('/login');
        return;
      }
      
      console.log('Enviando requisição para:', `${API_URL}/api/video/process-clips`);
      
      const response = await fetch(`${API_URL}/api/video/process-clips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          video_url: url || videoInfo.videoUrl,
          video_duration: videoInfo.duration,
          clip_duration: clipDuration === 'automatico' ? 15 : parseInt(clipDuration),
          format: format,
          framing: framing,
          apply_bypass: true
        })
      });
      
      console.log('Response recebido:', response.status);
      
      // ✅ CORREÇÃO: Ler response apenas UMA vez
      const data = await response.json();
      console.log('Data parseado:', data);
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Erro ao processar vídeo');
      }
      
      if (data.success) {
        // Navegar para página de processamento com job_id
        navigate('/editor', {
          state: {
            videoInfo,
            url: url || videoInfo.videoUrl,
            jobId: data.job_id,
            numClips: data.num_clips,
            config: {
              format,
              framing,
              clipDuration: clipDuration === 'automatico' ? 15 : parseInt(clipDuration),
              calculatedClips
            }
          }
        });
      } else {
        alert('Erro ao iniciar processamento');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(error.message || 'Erro ao processar vídeo. Tente novamente.');
    }
  };

  if (!videoInfo) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Defina o formato do vídeo</h1>
          <p className="text-gray-400">
            Escolha se o corte será vertical (Reels, TikTok, Shorts) ou horizontal (YouTube) e adicione o layout de enquadramento ideal para o seu conteúdo
          </p>
        </div>

        {/* Video Info */}
        <Card className="bg-gray-900 border-gray-800 p-4 flex items-center gap-4">
          <img 
            src={videoInfo.thumbnail} 
            alt={videoInfo.title}
            className="w-24 h-16 object-cover rounded"
            onError={(e) => e.target.style.display = 'none'}
          />
          <div className="flex-1">
            <p className="text-white font-medium truncate">{videoInfo.title}</p>
            <p className="text-gray-400 text-sm">Duração: {formatTime(videoInfo.duration)}</p>
          </div>
        </Card>

        {/* Proporção */}
        <div>
          <h3 className="text-white font-semibold mb-4">Proporção</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormat('vertical')}
              className={`p-6 rounded-lg border-2 transition-all ${
                format === 'vertical'
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <Smartphone className={`w-8 h-8 ${format === 'vertical' ? 'text-yellow-400' : 'text-gray-400'}`} />
                <span className={`font-medium ${format === 'vertical' ? 'text-white' : 'text-gray-400'}`}>
                  Vertical (9:16)
                </span>
              </div>
            </button>

            <button
              onClick={() => setFormat('horizontal')}
              className={`p-6 rounded-lg border-2 transition-all ${
                format === 'horizontal'
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <Monitor className={`w-8 h-8 ${format === 'horizontal' ? 'text-yellow-400' : 'text-gray-400'}`} />
                <span className={`font-medium ${format === 'horizontal' ? 'text-white' : 'text-gray-400'}`}>
                  Horizontal (16:9)
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Enquadramento */}
        <div>
          <h3 className="text-white font-semibold mb-4">Enquadramento</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: 'automatico', label: 'Automático', desc: 'Recomendado' },
              { value: 'centro', label: 'Centro' },
              { value: 'foco', label: 'Foco no rosto' },
              { value: 'tela-dividida', label: 'Tela Dividida' },
              { value: 'repost', label: 'Repost' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFraming(option.value)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  framing === option.value
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {option.value === 'automatico' && <Sparkles className="w-4 h-4 text-yellow-400" />}
                  <span className={`font-medium text-sm ${framing === option.value ? 'text-white' : 'text-gray-400'}`}>
                    {option.label}
                  </span>
                </div>
                {option.desc && (
                  <span className="text-xs text-gray-500">{option.desc}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Duração de cada corte */}
        <div>
          <h3 className="text-white font-semibold mb-2">Duração de cada corte</h3>
          <p className="text-gray-400 text-sm mb-4">
            Defina a duração de cada corte e até que parte do vídeo a IA deve analisar para encontrar os melhores momentos.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setClipDuration(option.value)}
                className={`p-4 rounded-lg border transition-all ${
                  clipDuration === option.value
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl block mb-1">{option.icon}</span>
                  <span className={`font-medium text-sm block ${
                    clipDuration === option.value ? 'text-white' : 'text-gray-400'
                  }`}>
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Preview dos cortes calculados */}
          {calculatedClips && (
            <Card className="mt-4 bg-yellow-900/20 border border-yellow-700/50 p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-medium mb-1">
                    Cada corte terá 1 minuto do vídeo: Você terá {calculatedClips.numClips} créditos — selecionou 5 min de {formatTime(calculatedClips.totalSeconds)} disponíveis
                  </p>
                  <p className="text-gray-300 text-sm">
                    📊 <strong>Cálculo:</strong> {formatTime(calculatedClips.totalSeconds)} ÷ {formatTime(calculatedClips.desiredDuration)} = {calculatedClips.numClips.toFixed(2)} cortes → 
                    Arredondado para <strong className="text-yellow-400">{calculatedClips.numClips} cortes</strong>
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    ⏱️ <strong>Duração real de cada corte:</strong> {formatTime(calculatedClips.realDuration)}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex-1 border-gray-700 text-white hover:bg-gray-800"
          >
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-green-500 text-black hover:opacity-90"
          >
            Próximo →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoConfigPage;
