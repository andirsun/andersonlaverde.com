const AboutUsSection = (props: any) =>
  <section className="py-40  bg-gray-100 ">
    <div className="container mx-auto px-4">
      <div className="items-center flex flex-wrap">
        <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
          <img alt="people" className="max-w-full rounded-lg shadow-lg" src="./assets/images/people.jpg"/>
        </div>
        <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
          <div className="md:pr-12">
            <div className="p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
              <img src="./assets/images/rocket.svg" alt="" />
            </div>
            <h3 className="text-5xl font-black font-inter text-gray-800">{props.t('aboutUs.title')}</h3>
            <p className="mt-4 text-3xl text-gray-600">
              {props.t('aboutUs.text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
export default AboutUsSection;
