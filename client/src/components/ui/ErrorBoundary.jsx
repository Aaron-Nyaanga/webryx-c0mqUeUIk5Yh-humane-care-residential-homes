import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">Please refresh the page or try again later.</p>
          <a href="/" className="px-6 py-3 bg-[#499D95] text-white rounded-lg font-semibold hover:bg-[#387A74] transition-colors">
            Return Home
          </a>
        </div>
      )
    }
    return this.props.children
  }
}
