import React, { Component } from "react";

import Cookies from "js-cookie";
import axios from "axios";
import { SpinnerCircularFixed } from 'spinners-react';




const configureAxiosHeader = () => {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

  console.log(console.log(process.env.NEXT_PUBLIC_API));
  const token = Cookies.get("ecom_micro");
  if (token) {
    axios.defaults.headers.common = {
      Authorization: token,
    };
  }
};




const withAuth = (AuthComponent) => {
  return class Authenticated extends Component {
    static async getInitialProps(ctx) {

      // Ensures material-ui renders the correct css prefixes server-side
      let userAgent;
      // eslint-disable-next-line no-undef
      if (process.browser) {
        // eslint-disable-next-line prefer-destructuring
        userAgent = navigator.userAgent;
      } else {
        userAgent = ctx.req?.headers["user-agent"];
      }

      // Check if Page has a `getInitialProps`; if so, call it.
      const pageProps =
        AuthComponent.getInitialProps &&
        (await AuthComponent.getInitialProps(ctx));
      // Return props.
      return { ...pageProps, userAgent };
    }

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        userData: null,
      };
    }

    async componentDidMount() {


      configureAxiosHeader();

      const token = Cookies.get("ecom_micro")

      if (token) {
        this.setState({ isLoading: true });
        axios
          // eslint-disable-next-line no-undef
          .post(`${process.env.NEXT_PUBLIC_API}/auth/verify`, {})
          .then((res) => {
            this.setState({ userData: res.data.user });
            this.setState({ isLoading: false });
          })
          .catch((err) => {
            this.setState({ isLoading: false });
            Cookies.remove(process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME);
          });
      } else {


      }

    }

    render() {
      return (
        <div>
          {this.state.isLoading ? (
            <div style={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <SpinnerCircularFixed style={{ margin: "0 auto" }} size={100} thickness={160} speed={100} color="#36D7B7" secondaryColor="rgba(0, 0, 0, .05)" />
            </div>
          ) : (
            <AuthComponent {...this.props} userData={this.state.userData} />
          )}
        </div>
      );
    }
  };
};
export default withAuth;