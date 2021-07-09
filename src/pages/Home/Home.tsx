import React from "react";
import { RouteComponentProps, withRouter  } from "react-router-dom";
// Interfaces
import IPage from "../../interfaces/page";
import './Home.css'
// Components
import ServicesCards from '../../components/ServicesCards'
import AboutUs from '../../components/AboutUsSection';
import Footer from '../../components/Footer';
import ContactSection from '../../components/ContactSection';
import Partners from "../../components/Partners";
import Hero from "../../components/Hero";
import Navbar from "../../components/Navbar";
import {useTranslation} from "react-i18next";

const HomePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const {t} = useTranslation('common');

  return (
    <div className="tracking-normal font-inter">
      <Navbar t={t} />

      <Hero t={t} />

      {/* <AboutUs t={t}/>

      <Partners t={t} />

      <ServicesCards t={t}/>

      <ContactSection t={t}/>

      <Footer t={t}/> */}

    </div>
  );
};

export default withRouter(HomePage);
