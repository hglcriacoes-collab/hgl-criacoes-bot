import React, { useState } from 'react';
import { Check, Sparkles, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { pricingPlans } from '../mockData';

const Financeiro = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Planos</h1>
        <p className="text-gray-400">Escolha o plano ideal para suas necessidades</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 bg-gray-900 border border-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
            <Sparkles className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-gray-800">
            <CreditCard className="w-4 h-4 mr-2" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="packages" className="data-[state=active]:bg-gray-800">
            🎁 Pacotes
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gray-800">
            📄 Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-8">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('monthly')}
              className={billingCycle === 'monthly' ? 'bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 text-black' : 'text-gray-400'}
            >
              Mensal
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('annual')}
              className={billingCycle === 'annual' ? 'bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 text-black' : 'text-gray-400'}
            >
              Anual
            </Button>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 border-2 border-purple-500 scale-105'
                    : 'bg-[#1a1a1a] border border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-center py-2">
                    <span className="text-white font-semibold text-sm flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className={`p-6 ${plan.popular ? 'pt-14' : ''}`}>
                  {/* Plan Name */}
                  <h3 className="text-white text-2xl font-bold mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 text-5xl font-bold">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-400 text-lg">/mês</span>
                  </div>

                  <p className="text-gray-400 text-sm mb-6">
                    Sem contrato, cancele quando quiser, sem multa.
                  </p>

                  {/* Subscribe Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white py-6">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Assinar com Cartão
                    </Button>
                    <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10 py-3">
                      💳 Assinar (PIX)
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/30 rounded-lg border border-gray-800">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{plan.credits}</div>
                      <div className="text-xs text-gray-400">créditos/mês</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{plan.videoHours}h</div>
                      <div className="text-xs text-gray-400">de vídeo analisado/mês</div>
                    </div>
                  </div>

                  <div className="text-center mb-6 text-sm">
                    <span className="text-gray-400">até </span>
                    <span className="text-yellow-400 font-semibold">{plan.clipsPerMonth.toLocaleString('pt-BR')}</span>
                    <span className="text-gray-400"> clipes/mês</span>
                    <span className="mx-2 text-gray-600">|</span>
                    <span className="text-blue-400 font-semibold">R${plan.extras.toLocaleString('pt-BR')}</span>
                    <span className="text-gray-400"> /clips</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold mb-3">O que está incluso:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-8">
          <Card className="bg-[#1a1a1a] border border-gray-800 p-8 text-center">
            <h3 className="text-white text-xl mb-4">Visão Geral Financeira</h3>
            <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="mt-8">
          <Card className="bg-[#1a1a1a] border border-gray-800 p-8 text-center">
            <h3 className="text-white text-xl mb-4">Pacotes Especiais</h3>
            <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-8">
          <Card className="bg-[#1a1a1a] border border-gray-800 p-8 text-center">
            <h3 className="text-white text-xl mb-4">Histórico de Pagamentos</h3>
            <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;