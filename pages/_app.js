import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import AppProvider from "../components/AppProvider";
import { Montserrat, Poppins } from "next/font/google";
import Head from "next/head";

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

function MyApp({ Component, pageProps }) {
  return (
    <div className={`${montserrat.variable} ${poppins.variable}`}>
      <Head>
        <title>AUTOCOR | Siempre nuevos</title>
      </Head>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </div>
  );
}

export default MyApp;
