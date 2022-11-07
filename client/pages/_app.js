import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import AppContext from '../context/AppContext';
import '../styles/globals.css'
import Cookies from "js-cookie";
import axios from "axios";
import withAuth from '../components/withAuth';




function MyApp({ Component, pageProps ,userData}) {



  const [user, setUser] = useState(userData)


  return <AppContext.Provider value={[
    user
  ]}
  >
    <Component {...pageProps} />
  </AppContext.Provider>

}

export default withAuth(MyApp)
