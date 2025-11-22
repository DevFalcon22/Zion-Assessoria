import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

// Usar rota API local como proxy (evita Mixed Content HTTPS/HTTP)
const API_URL = '/api'

export default function Home() {
  const [bachillerato, setBachillerato] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!bachillerato.trim()) {
      setError('Por favor, informe o número do documento')
      return
    }

    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      console.log('Enviando requisição para:', `${API_URL}/consulta-bachillerato`)
      
      const response = await axios.post(`${API_URL}/consulta-bachillerato`, {
        bachillerato: bachillerato.trim(),
        fechaNacimiento: fechaNacimiento.trim()
      })

      console.log('Resposta recebida:', response.data)
      setResultado(response.data)
      
    } catch (err) {
      console.error('Erro na requisição:', err)
      
      let errorMessage = 'Erro ao consultar bachillerato. ';
      
      if (err.response?.status === 500) {
        errorMessage += 'O servidor encontrou um problema ao processar a consulta. ';
        if (err.response?.data?.detalhes) {
          errorMessage += `Detalhes: ${err.response.data.detalhes}`;
        } else {
          errorMessage += 'Por favor, verifique se os dados estão corretos e tente novamente.';
        }
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 5000.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else {
        errorMessage += 'Tente novamente em alguns instantes.';
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    if (resultado?.pdfUrl) {
      const pdfFullUrl = `${API_URL}${resultado.pdfUrl}`
      window.open(pdfFullUrl, '_blank')
    }
  }

  const resetForm = () => {
    setBachillerato('')
    setFechaNacimiento('')
    setResultado(null)
    setError(null)
  }

  return (
    <>
      <Head>
        <title>Zion Assessoria - Consulta Bachillerato MEC</title>
        <meta name="description" content="Sistema de consulta de bachilleratos do MEC Paraguay" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-zion.png" />
      </Head>

      {/* Header/Navbar */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-3 shadow-xl">
                <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5zm-1 15.5l-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4-6 6z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Zion Assessoria</h1>
                <p className="text-sm text-yellow-100">Consultoria Especializada</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-yellow-300 transition">Início</Link>
              <Link href="#servicos" className="hover:text-yellow-300 transition">Serviços</Link>
              <Link href="#contato" className="hover:text-yellow-300 transition">Contato</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-yellow-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-6 shadow-xl">
              <svg className="w-10 h-10 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Consulta de Bachillerato
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              MEC Paraguay
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Sistema automatizado para consulta e validação de certificados de bachillerato no Ministerio de Educación y Ciencias
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">

          {/* Aviso EJA */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Aviso Importante</h4>
                <p className="text-sm text-amber-800">
                  <strong>Quem fez EJA (Educação de Jovens e Adultos) não aparecerá neste sistema.</strong> Este sistema consulta apenas bachilleratos do ensino regular do MEC Paraguay.
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="card mb-8 hover:shadow-xl transition-shadow duration-300">
            <div className="border-l-4 border-primary-500 pl-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Iniciar Consulta</h3>
              <p className="text-gray-600 text-sm mt-1">Preencha os dados abaixo para verificar o bachillerato</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label 
                  htmlFor="bachillerato" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Número do Documento do Estudante *
                </label>
                <input
                  type="text"
                  id="bachillerato"
                  value={bachillerato}
                  onChange={(e) => setBachillerato(e.target.value)}
                  placeholder="Digite o número do documento"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label 
                  htmlFor="fechaNacimiento" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Data de Nascimento (opcional)
                </label>
                <input
                  type="text"
                  id="fechaNacimiento"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="input-field"
                  disabled={loading}
                  maxLength={10}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Formato: DD/MM/AAAA (ex: 15/03/2000)
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !bachillerato.trim()}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Consultando...
                    </>
                  ) : (
                    'Consultar'
                  )}
                </button>

                {resultado && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Nova Consulta
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Erro */}
          {error && (
            <div className="card bg-red-50 border-red-200 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Erro na Consulta
                  </h3>
                  <p className="mt-2 text-sm text-red-700">
                    {error}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => setError(null)}
                      className="text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resultado */}
          {resultado && (
            <div className={`card ${resultado.status === 'VALIDADO' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} animate-fade-in`}>
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  {resultado.status === 'VALIDADO' ? (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-semibold ${resultado.status === 'VALIDADO' ? 'text-green-900' : 'text-yellow-900'}`}>
                    {resultado.status === 'VALIDADO' ? '✅ Bachillerato Validado!' : '⚠️ Bachillerato Não Validado'}
                  </h3>
                  <p className={`mt-1 text-sm ${resultado.status === 'VALIDADO' ? 'text-green-800' : 'text-yellow-800'}`}>
                    Bachillerato: <strong>{resultado.bachillerato}</strong>
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${resultado.status === 'VALIDADO' ? 'bg-green-100' : 'bg-yellow-100'} mb-4`}>
                <h4 className={`font-medium ${resultado.status === 'VALIDADO' ? 'text-green-900' : 'text-yellow-900'} mb-2`}>
                  Mensagem do Sistema:
                </h4>
                <p className={`text-sm ${resultado.status === 'VALIDADO' ? 'text-green-800' : 'text-yellow-800'} whitespace-pre-wrap`}>
                  {resultado.mensagem}
                </p>
              </div>

              {resultado.pdfUrl && (
                <div className="mt-6">
                  <button
                    onClick={handleDownloadPDF}
                    className="btn-secondary w-full flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Baixar Comprovante (PDF)
                  </button>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                Consultado em: {new Date(resultado.timestamp).toLocaleString('pt-BR')}
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300 transition">
              <div className="text-primary-600 mb-3">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consulta Rápida</h3>
              <p className="text-sm text-gray-600">Resultados em segundos direto do site oficial do MEC</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300 transition">
              <div className="text-primary-600 mb-3">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Seguro</h3>
              <p className="text-sm text-gray-600">Seus dados são consultados de forma segura e não são armazenados</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300 transition">
              <div className="text-primary-600 mb-3">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comprovante PDF</h3>
              <p className="text-sm text-gray-600">Baixe o comprovante oficial em formato PDF</p>
            </div>
          </div>

          {/* Informações do Site Oficial */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Informação Importante</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Todas as consultas são realizadas diretamente no site oficial do 
                    <strong className="ml-1">Ministerio de Educación y Ciencias (MEC) Paraguay</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-3 shadow-xl">
                  <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5zm-1 15.5l-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4-6 6z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Zion Assessoria</h3>
                  <p className="text-sm text-gray-400">Consultoria Especializada</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                Facilitamos seus trâmites no Paraguay. Consultas rápidas, seguras e oficiais.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Consulta Bachillerato</a></li>
                <li><a href="#" className="hover:text-white transition">Validação de Documentos</a></li>
                <li><a href="#" className="hover:text-white transition">Assessoria</a></li>
              </ul>
            </div>
            
            <div id="contato">
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contato@zionassessoria.com
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +595 XXX XXX XXX
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Zion Assessoria. Todos os direitos reservados.</p>
            <p className="mt-2">
              Desenvolvido com ❤️ para facilitar seus trâmites
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
