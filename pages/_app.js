import '../styles/styles.scss'
import HeadMeta from './component/HeadMeta'
import Layout from './component/Layout/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <HeadMeta />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp
