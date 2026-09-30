import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Une erreur est survenue</h1>
        <p className={styles.description}>
          L’application n’a pas pu s’afficher correctement.
        </p>
        <button
          type="button"
          className={styles.action}
          onClick={() => window.location.reload()}
        >
          Recharger la page
        </button>
      </main>
    )
  }
}
