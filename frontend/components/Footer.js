import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
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
              Facilitamos seus trâmites com o Ministério da Educação do Paraguay. 
              Consultas rápidas, seguras e oficiais.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <a 
                  href="https://tramites.mec.gov.py/gestion_tramites/verificar_bachilleratos/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Site Oficial MEC
                </a>
              </li>
            </ul>
          </div>
          
          <div id="contato">
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contato@zionassessoria.com
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  )
}
