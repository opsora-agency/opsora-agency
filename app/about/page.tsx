import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
{/*import Breadcrumb from "@/components/Common/Breadcrumb";*/}
import Steps from "@/components/About/Steps";
import Video from "@/components/Video";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about our mission, values, and the passionate team dedicated to delivering exceptional solutions and services.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
     {/* <Breadcrumb
        pageName="About Us"
        description="Learn about our mission, values, and the passionate team dedicated to delivering exceptional solutions and services."
      />*/}
      <AboutSectionOne />
      <AboutSectionTwo />
      <Video/>
       <Steps/>
    </>
  );
};

export default AboutPage;

