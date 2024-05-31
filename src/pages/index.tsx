import Head from "next/head";
import Link from "next/link";

import styles from "./index.module.css";

export default function Home() {

  return (
    <>
    <Head>
      <title>Celly Store</title>
      <meta name="description" content="Some description" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Homepage
        </h1>
        
        <Link className={styles.showcaseText} href={"/login"}>Login</Link>
        <Link className={styles.showcaseText} href={"/login?cadastro=true"}>Cadastro</Link>
      </div>
    </main>
  </>
  );
}
