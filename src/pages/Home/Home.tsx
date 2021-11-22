import React from "react";
import { withRouter  } from "react-router-dom";
import './Home.css'
import Hero from "../../components/Hero";
import Navbar from "../../components/Navbar";
import {useTranslation} from "react-i18next";

const HomePage: React.FunctionComponent<{}> = props => {
  const {t} = useTranslation('common');

  return (
    <div>
      <Navbar t={t} />

      <Hero  />
    </div>
  );
};

export default withRouter(HomePage);
