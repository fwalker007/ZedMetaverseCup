import '../styles/globals.css'
import Web3 from 'web3'

function getLibrary(provider) {
  return new Web3(provider)
}

function MyApp({ Component, pageProps }) {
  return (
      <Component {...pageProps} />
  )
}

export default MyApp
