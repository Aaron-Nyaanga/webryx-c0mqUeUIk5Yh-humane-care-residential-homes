import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ErrorBoundary from '../ui/ErrorBoundary'

const SNOWFLAKES = [
  { left: '5%',  size: '1em',    delay: '0s',   duration: '8s'  },
  { left: '12%', size: '0.8em',  delay: '1.5s', duration: '10s' },
  { left: '20%', size: '1.2em',  delay: '0.5s', duration: '7s'  },
  { left: '28%', size: '0.7em',  delay: '3s',   duration: '9s'  },
  { left: '35%', size: '1em',    delay: '1s',   duration: '11s' },
  { left: '42%', size: '1.3em',  delay: '2s',   duration: '8s'  },
  { left: '50%', size: '0.8em',  delay: '4s',   duration: '10s' },
  { left: '57%', size: '1.1em',  delay: '0.8s', duration: '7s'  },
  { left: '63%', size: '0.9em',  delay: '2.5s', duration: '12s' },
  { left: '70%', size: '1.2em',  delay: '1.2s', duration: '9s'  },
  { left: '77%', size: '0.7em',  delay: '3.5s', duration: '8s'  },
  { left: '83%', size: '1em',    delay: '0.3s', duration: '11s' },
  { left: '89%', size: '1.3em',  delay: '2.8s', duration: '7s'  },
  { left: '94%', size: '0.8em',  delay: '1.7s', duration: '10s' },
  { left: '8%',  size: '0.9em',  delay: '5s',   duration: '9s'  },
  { left: '45%', size: '1.1em',  delay: '6s',   duration: '8s'  },
  { left: '67%', size: '0.8em',  delay: '4.5s', duration: '12s' },
  { left: '98%', size: '1em',    delay: '1s',   duration: '10s' },
]

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Snowflake overlay */}
      <div aria-hidden="true">
        {SNOWFLAKES.map((flake, i) => (
          <span
            key={i}
            className="snowflake"
            style={{
              left: flake.left,
              fontSize: flake.size,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
            }}
          >
            ❄
          </span>
        ))}
      </div>

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
