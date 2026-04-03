import React, { useState } from 'react';
import { Upload as UploadIcon, Film, Scissors, Download, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clips, setClips] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        toast({
          title: 'Erro',
          description: 'Arquivo muito grande! Máximo 500MB',
          variant: 'destructive'
        });
        return;
      }
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!videoFile && !videoUrl) {
      toast({
        title: 'Erro',
        description: 'Selecione um vídeo ou cole uma URL',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      if (videoFile) {
        const formData = new FormData();
        formData.append('file', videoFile);

        const response = await axios.post(
          `${API_URL}/api/video/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          }
        );

        setUploadedVideo(response.data);
        toast({
          title: 'Sucesso!',
          description: 'Vídeo enviado com sucesso!'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro no upload',
        description: error.response?.data?.detail || 'Erro ao enviar vídeo',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAutoCut = async () => {
    if (!uploadedVideo) return;

    setProcessing(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/video/auto-cut/${uploadedVideo.video_id}`,
        {
          clip_duration: 30,
          max_clips: 5
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setClips(response.data.clips);
      toast({
        title: 'Sucesso!',
        description: `${response.data.clips.length} clips criados!`
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar vídeo',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
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

      {/* Upload Section */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Upload de Vídeo</h2>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">URL do Vídeo (YouTube, Google Drive)</label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="bg-gray-800/50 border-gray-700 text-white"
              disabled={uploading}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <label className="text-white text-sm font-medium">Arquivo Local</label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
                disabled={uploading}
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <UploadIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-white mb-2">
                  {videoFile ? videoFile.name : 'Clique para selecionar ou arraste aqui'}
                </p>
                <p className="text-gray-500 text-sm">MP4, MOV, MKV ou AVI. Máximo 500MB</p>
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Enviando...</span>
                <span className="text-white font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploading || (!videoFile && !videoUrl)}
            className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90 py-6 text-lg font-semibold"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5 mr-2" />
                Fazer Upload
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Video Uploaded - Processing Options */}
      {uploadedVideo && (
        <Card className="bg-[#1a1a1a] border border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="text-white font-semibold">Vídeo Enviado!</h3>
              <p className="text-gray-400 text-sm">Pronto para processar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleAutoCut}
              disabled={processing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 py-6"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5 mr-2" />
                  Cortar Automaticamente
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 py-6"
            >
              <Film className="w-5 h-5 mr-2" />
              Corte Manual
            </Button>
          </div>
        </Card>
      )}

      {/* Clips Generated */}
      {clips.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Clips Gerados ({clips.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip, index) => (
              <Card key={clip.id} className="bg-[#1a1a1a] border border-gray-800 p-4">
                <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                  <Film className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-white font-semibold mb-2">Clip {index + 1}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {clip.start_time}s - {clip.end_time}s ({clip.duration}s)
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-green-500 text-black"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Baixar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-700 text-white"
                  >
                    Postar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;