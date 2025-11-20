export default function manifest() {
  return {
    name: 'Zion Assessoria - Consulta Bachillerato MEC',
    short_name: 'Zion Assessoria',
    description: 'Sistema de consulta e validação de bachilleratos no MEC Paraguay',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/logo-zion.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-zion.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
