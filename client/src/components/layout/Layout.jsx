import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ErrorBoundary from '../ui/ErrorBoundary'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
