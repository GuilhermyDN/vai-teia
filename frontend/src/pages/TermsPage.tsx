export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Serviço</h1>
      <p className="text-sm text-gray-500 mb-8">Última atualização: março de 2026</p>

      <section className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Aceitação dos Termos</h2>
          <p>Ao acessar ou utilizar a plataforma Vaiteia, você concorda com estes Termos de Serviço. Se não concordar com algum dos termos, não utilize nossa plataforma.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. Descrição do Serviço</h2>
          <p>A Vaiteia é uma plataforma de gerenciamento de redes sociais que permite aos usuários conectar contas, agendar publicações, visualizar análises e gerenciar mensagens de múltiplas redes sociais em um único lugar.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Uso Aceitável</h2>
          <p>Você concorda em usar a plataforma apenas para fins legítimos e de acordo com todas as leis aplicáveis. É proibido usar a Vaiteia para publicar conteúdo ilegal, enganoso ou que viole os termos das plataformas de redes sociais integradas.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Contas e Segurança</h2>
          <p>Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente em caso de acesso não autorizado.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Planos e Pagamentos</h2>
          <p>A Vaiteia oferece planos gratuitos e pagos. Os valores e condições dos planos pagos estão descritos na página de preços. Os pagamentos são processados de forma segura via Stripe.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Limitação de Responsabilidade</h2>
          <p>A Vaiteia não se responsabiliza por interrupções de serviço causadas por terceiros, incluindo as próprias plataformas de redes sociais integradas.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">7. Alterações nos Termos</h2>
          <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos os usuários sobre alterações significativas por e-mail ou dentro da própria plataforma.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">8. Contato</h2>
          <p>Para dúvidas sobre estes termos, entre em contato: <a href="mailto:suporte@vaiteia.com.br" className="text-green-600 hover:underline">suporte@vaiteia.com.br</a></p>
        </div>
      </section>
    </div>
  );
}
