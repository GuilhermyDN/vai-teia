export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
      <p className="text-sm text-gray-500 mb-8">Última atualização: março de 2026</p>

      <section className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Informações que Coletamos</h2>
          <p>Coletamos informações que você nos fornece diretamente (nome, e-mail, senha) e informações das redes sociais conectadas (nome de usuário, foto de perfil, número de seguidores) mediante sua autorização explícita via OAuth.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. Como Usamos suas Informações</h2>
          <p>Usamos suas informações para: fornecer e melhorar nossos serviços; autenticar sua identidade; processar pagamentos; enviar notificações relevantes; e cumprir obrigações legais.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Compartilhamento de Dados</h2>
          <p>Não vendemos seus dados pessoais. Compartilhamos informações apenas com provedores de serviço necessários para o funcionamento da plataforma (Stripe para pagamentos, Resend para e-mails) e quando exigido por lei.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Tokens de Acesso das Redes Sociais</h2>
          <p>Os tokens de acesso OAuth das plataformas conectadas (Instagram, Facebook, TikTok) são armazenados de forma segura e usados exclusivamente para realizar ações em seu nome dentro da Vaiteia. Você pode revogar o acesso a qualquer momento desconectando a conta na plataforma.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Segurança dos Dados</h2>
          <p>Utilizamos criptografia em trânsito (HTTPS) e em repouso para proteger suas informações. Senhas são armazenadas com hash bcrypt e nunca em texto puro.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Seus Direitos (LGPD)</h2>
          <p>De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a: acessar seus dados; corrigir dados incorretos; solicitar a exclusão de seus dados; e revogar consentimentos. Envie sua solicitação para <a href="mailto:privacidade@vaiteia.com.br" className="text-green-600 hover:underline">privacidade@vaiteia.com.br</a>.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">7. Retenção de Dados</h2>
          <p>Mantemos seus dados pelo período necessário para prestação dos serviços ou conforme exigido por lei. Após o encerramento da conta, os dados são excluídos em até 30 dias.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">8. Contato</h2>
          <p>Para questões de privacidade: <a href="mailto:privacidade@vaiteia.com.br" className="text-green-600 hover:underline">privacidade@vaiteia.com.br</a></p>
        </div>
      </section>
    </div>
  );
}
