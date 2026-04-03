import React, { useState } from 'react';
import { Save, Key, Bot, MessageSquare, DollarSign, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { useToast } from '../hooks/use-toast';
import { aiProviders } from '../mockData';

const Configuracoes = () => {
  const { toast } = useToast();
  const [aiConfig, setAiConfig] = useState({
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: '',
    systemPrompt: `Você é um assistente virtual da plataforma HGL, especializado em ajudar criadores de conteúdo.

Sobre a HGL:
- Plataforma de criação e gerenciamento de conteúdo para redes sociais
- Ferramentas de edição de vídeo com IA
- Cortes automáticos e legendas
- Publicação em múltiplas plataformas
- Planos: Lite (R$49,90), Criador (R$89,90), Viral (R$149,90)

Redes Sociais Suportadas:
- YouTube, TikTok, Instagram, Facebook, Twitter/X
- LinkedIn, Threads, Reddit, Pinterest, Bluesky
- Kwai, Snapchat

Funcionalidades:
1. Dashboard: Upload de vídeos e gerenciamento de projetos
2. Redes Sociais: Conectar e gerenciar contas
3. Financeiro: Planos e pagamentos
4. Ferramentas: Cortes automáticos, Reframe, Editor

Sua função:
- Responder dúvidas sobre planos e funcionalidades
- Ajudar com suporte técnico
- Orientar sobre uso da plataforma
- Ser simpático, objetivo e útil

Sempre responda em português brasileiro.`,
    temperature: 0.7,
    maxTokens: 500,
    enabled: false
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'PIX', key: '', enabled: false },
    { id: 2, name: 'Mercado Pago', key: '', enabled: false },
    { id: 3, name: 'PagSeguro', key: '', enabled: false }
  ]);

  const [whatsappConfig, setWhatsappConfig] = useState({
    number: '',
    enabled: false
  });

  const handleSaveAI = () => {
    toast({
      title: 'Configurações de IA salvas!',
      description: 'As configurações do assistente virtual foram atualizadas.',
    });
  };

  const handleSavePayment = () => {
    toast({
      title: 'Métodos de pagamento salvos!',
      description: 'Suas configurações de pagamento foram atualizadas.',
    });
  };

  const handleSaveWhatsApp = () => {
    toast({
      title: 'WhatsApp configurado!',
      description: 'Seu número de WhatsApp foi salvo com sucesso.',
    });
  };

  const selectedProvider = aiProviders.find(p => p.id === aiConfig.provider);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Gerencie as configurações da sua plataforma HGL</p>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-800">
          <TabsTrigger value="ai" className="data-[state=active]:bg-gray-800">
            <Bot className="w-4 h-4 mr-2" />
            Assistente IA
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-gray-800">
            <DollarSign className="w-4 h-4 mr-2" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="data-[state=active]:bg-gray-800">
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-800">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* AI Configuration */}
        <TabsContent value="ai" className="space-y-6 mt-6">
          <Card className="bg-[#1a1a1a] border border-gray-800 p-6">
            <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-3">
              <Bot className="w-6 h-6 text-purple-400" />
              Configuração do Assistente Virtual
            </h3>

            <div className="space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div>
                  <Label className="text-white font-medium">Ativar Assistente Virtual</Label>
                  <p className="text-gray-400 text-sm mt-1">Habilitar chatbot com IA na plataforma</p>
                </div>
                <Switch
                  checked={aiConfig.enabled}
                  onCheckedChange={(checked) => setAiConfig({ ...aiConfig, enabled: checked })}
                />
              </div>

              {/* Provider Selection */}
              <div className="space-y-2">
                <Label className="text-white">Provedor de IA</Label>
                <Select
                  value={aiConfig.provider}
                  onValueChange={(value) => {
                    const provider = aiProviders.find(p => p.id === value);
                    setAiConfig({ ...aiConfig, provider: value, model: provider?.models[0] || '' });
                  }}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aiProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label className="text-white">Modelo</Label>
                <Select
                  value={aiConfig.model}
                  onValueChange={(value) => setAiConfig({ ...aiConfig, model: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProvider?.models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Key
                </Label>
                <Input
                  type="password"
                  value={aiConfig.apiKey}
                  onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                  placeholder="Sua chave de API"
                  className="bg-gray-900 border-gray-700 text-white"
                />
                <p className="text-gray-500 text-xs">
                  {aiConfig.provider === 'openai' && 'Obtenha sua chave em: https://platform.openai.com/api-keys'}
                  {aiConfig.provider === 'deepseek' && 'Obtenha sua chave em: https://platform.deepseek.com'}
                  {aiConfig.provider === 'emergent' && 'A chave universal já está configurada no sistema'}
                </p>
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <Label className="text-white">Prompt de Sistema (Treinamento da IA)</Label>
                <Textarea
                  value={aiConfig.systemPrompt}
                  onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
                  rows={12}
                  className="bg-gray-900 border-gray-700 text-white font-mono text-sm"
                />
                <p className="text-gray-500 text-xs">
                  Este texto define como a IA se comporta. Personalize com informações específicas do seu negócio.
                </p>
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Temperatura (Criatividade)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={aiConfig.temperature}
                    onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  <p className="text-gray-500 text-xs">0 = Mais preciso | 2 = Mais criativo</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Máximo de Tokens</Label>
                  <Input
                    type="number"
                    value={aiConfig.maxTokens}
                    onChange={(e) => setAiConfig({ ...aiConfig, maxTokens: parseInt(e.target.value) })}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  <p className="text-gray-500 text-xs">Limite de palavras na resposta</p>
                </div>
              </div>

              <Button
                onClick={handleSaveAI}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações de IA
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payment" className="space-y-6 mt-6">
          <Card className="bg-[#1a1a1a] border border-gray-800 p-6">
            <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-400" />
              Métodos de Recebimento
            </h3>

            <div className="space-y-6">
              {paymentMethods.map((method, index) => (
                <div key={method.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white font-medium">{method.name}</Label>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={(checked) => {
                        const updated = [...paymentMethods];
                        updated[index].enabled = checked;
                        setPaymentMethods(updated);
                      }}
                    />
                  </div>
                  <Input
                    type="text"
                    value={method.key}
                    onChange={(e) => {
                      const updated = [...paymentMethods];
                      updated[index].key = e.target.value;
                      setPaymentMethods(updated);
                    }}
                    placeholder={`Chave/Token do ${method.name}`}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              ))}

              <Button
                onClick={handleSavePayment}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Métodos de Pagamento
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* WhatsApp */}
        <TabsContent value="whatsapp" className="space-y-6 mt-6">
          <Card className="bg-[#1a1a1a] border border-gray-800 p-6">
            <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-green-500" />
              Configuração do WhatsApp
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div>
                  <Label className="text-white font-medium">Ativar Botão WhatsApp</Label>
                  <p className="text-gray-400 text-sm mt-1">Exibir botão de contato via WhatsApp</p>
                </div>
                <Switch
                  checked={whatsappConfig.enabled}
                  onCheckedChange={(checked) => setWhatsappConfig({ ...whatsappConfig, enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Número do WhatsApp</Label>
                <Input
                  type="tel"
                  value={whatsappConfig.number}
                  onChange={(e) => setWhatsappConfig({ ...whatsappConfig, number: e.target.value })}
                  placeholder="Ex: +55 11 99999-9999"
                  className="bg-gray-900 border-gray-700 text-white"
                />
                <p className="text-gray-500 text-xs">
                  Inclua o código do país (+55 para Brasil)
                </p>
              </div>

              <Button
                onClick={handleSaveWhatsApp}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-500 text-black hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações do WhatsApp
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="bg-[#1a1a1a] border border-gray-800 p-6 text-center">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl mb-2">Notificações</h3>
            <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;