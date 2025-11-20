import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()
  
  const isActive = (path) => {
    return router.pathname === path ? 'font-semibold border-b-2 border-white pb-1' : ''
  }

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-3 shadow-xl">
              <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5zm-1 15.5l-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4-6 6z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Zion Assessoria</h1>
              <p className="text-sm text-yellow-100">Consultoria Especializada</p>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`hover:text-yellow-300 transition ${isActive('/')}`}>
              Início
            </Link>
            <Link href="/about" className={`hover:text-yellow-300 transition ${isActive('/about')}`}>
              Sobre
            </Link>
            <Link href="/#contato" className="hover:text-yellow-300 transition">
              Contato
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
