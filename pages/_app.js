import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import AppProvider from "../components/AppProvider";
import { Montserrat, Poppins } from "next/font/google";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "600", "700", "900"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "600", "700", "900"],
  subsets: ["latin"],
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <div className={`${montserrat.variable} ${poppins.variable}`}>
      <Head>
        <title>AUTOCOR | Siempre nuevos</title>
      </Head>
      <SessionProvider session={session}>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </SessionProvider>
    </div>
  );
}

export default MyApp;
