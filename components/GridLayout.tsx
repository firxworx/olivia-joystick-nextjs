import styles from './styles/GridLayout.module.css'

export const GridLayout: React.FC<{}> = ({ children }) => {
  return (
    <main className={styles.GridLayout}>
      {children}
    </main>
  )
}
