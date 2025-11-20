import Head from 'next/head'
import Link from 'next/link'

export default function About() {
  return (
    <>
      <Head>
        <title>Sobre - Zion Assessoria</title>
        <meta name="description" content="Conheça a Zion Assessoria e nossos serviços" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header/Navbar */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
              <img 
                src="/logo-zion.png" 
                alt="Zion Assessoria" 
                className="h-14 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">Zion Assessoria</h1>
                <p className="text-sm text-primary-100">Consultoria Especializada</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-primary-200 transition">Início</Link>
              <Link href="/about" className="hover:text-primary-200 transition font-semibold">Sobre</Link>
              <Link href="/#contato" className="hover:text-primary-200 transition">Contato</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sobre a Zion Assessoria
            </h2>
            <p className="text-xl text-gray-600">
              Facilitando seus trâmites com eficiência e segurança
            </p>
          </div>

          {/* Conteúdo */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
              <p className="text-gray-700 leading-relaxed">
                A Zion Assessoria nasceu com o propósito de simplificar e agilizar processos burocráticos 
                relacionados à educação no Paraguay. Oferecemos soluções tecnológicas que tornam a 
                verificação de documentos educacionais rápida, segura e confiável.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossos Serviços</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Verificação de Bachillerato</h4>
                    <p className="text-sm text-gray-600">
                      Consulta automática e oficial no sistema do MEC Paraguay
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Comprovantes em PDF</h4>
                    <p className="text-sm text-gray-600">
                      Geração automática de documentos oficiais para download
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Segurança Total</h4>
                    <p className="text-sm text-gray-600">
                      Seus dados são protegidos e não são armazenados
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Resultados Rápidos</h4>
                    <p className="text-sm text-gray-600">
                      Consultas processadas em poucos segundos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl shadow-lg p-8 border border-primary-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Por que nos escolher?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Confiabilidade:</strong> Todas as consultas são realizadas diretamente no site oficial do MEC
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Praticidade:</strong> Interface simples e intuitiva, sem complicações
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Suporte:</strong> Equipe disponível para auxiliar em seus trâmites
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Transparência:</strong> Processo claro e resultados verificáveis
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center py-8">
              <Link 
                href="/"
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span>Iniciar Consulta Agora</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Zion Assessoria. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
