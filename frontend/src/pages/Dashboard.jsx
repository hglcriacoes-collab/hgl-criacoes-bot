import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  const analyzeVideo = async (url) => {
    setAnalyzing(true);
    try {
      // Extrair informações reais da URL
      let videoId = null;
      let videoTitle = 'Vídeo';
      let thumbnailUrl = null;
      
      // Parse YouTube URL
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || url.split('/').pop();
        videoTitle = `Vídeo do YouTube`;
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
      
      // Simular análise (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dados do vídeo com URL real
      const videoInfo = {
        duration: 193, // Seria obtido da API real
        title: videoTitle,
        thumbnail: thumbnailUrl,
        videoUrl: url,
        videoId: videoId,
        compatible: true,
        needsCut: true
      };
      
      setVideoInfo(videoInfo);
      
      if (videoInfo.needsCut) {
        navigate('/editor', { state: { videoInfo, url } });
      } else {
        toast({
          title: 'Vídeo pronto!',
          description: 'Vídeo menor que 30s não precisa de cortes'
        });
        navigate('/editor', { state: { videoInfo, url, skipCut: true } });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao analisar vídeo. Verifique se o link está correto.',
        variant: 'destructive'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!videoUrl) {
      toast({
        title: 'Erro',
        description: 'Cole o link do vídeo',
        variant: 'destructive'
      });
      return;
    }
    
    analyzeVideo(videoUrl);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'Arquivo muito grande! Máximo 500MB',
        variant: 'destructive'
      });
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_URL}/api/video/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Simular análise do vídeo enviado
      const mockVideoInfo = {
        duration: 120,
        title: file.name,
        videoId: response.data.video_id,
        compatible: true,
        needsCut: true
      };
      
      navigate('/editor', { state: { videoInfo: mockVideoInfo, videoId: response.data.video_id } });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Seu próximo viral começa aqui
        </h1>
        <p className="text-gray-400 text-lg">Faça upload e crie clips virais automaticamente</p>
      </div>

      {/* Upload Card */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Upload de Vídeo</h2>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">URL do Vídeo (YouTube, Google Drive)</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="bg-gray-800/50 border-gray-700 text-white pl-12 py-6"
                disabled={analyzing || uploading}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
                disabled={analyzing || uploading}
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <UploadIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-white mb-2">Clique para selecionar ou arraste aqui</p>
                <p className="text-gray-500 text-sm">MP4, MOV, MKV ou AVI. Máximo 10 horas ou 40GB</p>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-white mb-1">Validação automática:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Vídeos com menos de 5 minutos já são curtos demais para gerar clipes automáticos</li>
                <li>• Vídeos menores que 30s vão direto para edição (sem cortes)</li>
                <li>• Vídeos maiores que 30s passam por cortes automáticos</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={analyzing || uploading || !videoUrl}
            className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90 py-6 text-lg font-semibold"
          >
            {analyzing || uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {analyzing ? 'Analisando vídeo...' : 'Enviando...'}
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5 mr-2" />
                Fazer Upload
              </>
            )}
          </Button>

          {/* Test Videos */}
          <div className="text-center pt-4">
            <p className="text-gray-500 text-sm mb-3">ou teste com um vídeo de exemplo</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVideoUrl('https://youtube.com/watch?v=example1')}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                📺 Genérico
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVideoUrl('https://youtube.com/watch?v=example2')}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                🎮 Gameplay
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVideoUrl('https://youtube.com/watch?v=example3')}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                🎙️ Podcast
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;