import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useState } from "react";
import { defaultHours } from "data/defaultHours";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const [workdaysString, setWorkdaysString] = useState(defaultHours);

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} workdaysString={workdaysString} setWorkdaysString={setWorkdaysString}/>
    </SessionProvider>
  );
}
