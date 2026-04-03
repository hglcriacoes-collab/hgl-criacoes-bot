import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Zap, Mail, Lock, User, Github, Apple, Facebook } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = isRegister
      ? await register(formData.name, formData.email, formData.password)
      : await login(formData.email, formData.password);

    if (result.success) {
      toast({
        title: isRegister ? 'Conta criada!' : 'Login realizado!',
        description: 'Redirecionando para o dashboard...'
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive'
      });
    }

    setLoading(false);
  };

  const handleSocialLogin = (provider) => {
    toast({
      title: 'Em breve',
      description: `Login com ${provider} será configurado em breve!`
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1a1a] border border-gray-800 p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 via-yellow-300 to-green-500 flex items-center justify-center">
            <Zap className="w-7 h-7 text-black" />
          </div>
          <span className="text-3xl font-bold text-white">HGL Oficial</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Build Full-Stack
        </h2>
        <p className="text-blue-400 text-center mb-8 text-lg">
          Web & Mobile Apps em minutos
        </p>

        {!showEmailForm ? (
          <>
            {/* Google Login Button */}
            <div className="mb-4">
              <GoogleLoginButton />
            </div>

            {/* Social Login Icons */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Github className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => handleSocialLogin('Apple')}
                className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Apple className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => handleSocialLogin('Facebook')}
                className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Continue with Email Button */}
            <Button
              onClick={() => setShowEmailForm(true)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Email
            </Button>

            {/* Terms */}
            <p className="text-gray-500 text-xs text-center mt-6">
              By continuing, you agree to our{' '}
              <a href="#" className="text-gray-400 hover:text-white underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-gray-400 hover:text-white underline">
                Privacy Policy
              </a>
            </p>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => setShowEmailForm(false)}
              className="text-gray-400 hover:text-white mb-4 text-sm"
            >
              ← Voltar
            </button>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label className="text-white">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90 py-6 text-lg font-semibold"
              >
                {loading ? 'Carregando...' : isRegister ? 'Criar Conta' : 'Entrar'}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {isRegister
                  ? 'Já tem uma conta? Entrar'
                  : 'Não tem conta? Criar agora'}
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Login;