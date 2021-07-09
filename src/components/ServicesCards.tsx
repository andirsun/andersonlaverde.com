const ServicesCards = (props: any) =>
  <section className="border-b bg-gray-100 pt-8">
    <h2 className="w-full mt-20 text-5xl font-black text-center text-gray-800">
      {props.t('servicesCards.title')}
    </h2>

    <div className="grid grid-cols-1 gap-10 mx-8 mt-20 mb-40 sm:mx-24  2xl:grid-cols-3">

      <div className="px-4 py-4 transform transition duration-500 hover:scale-110 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-fit md:h-full md:w-48" src="/assets/images/staff.svg" alt="Man looking at item at a store"/>
          </div>
          <div className="py-8 pl-8 pr-4">
            <h2 className="block mt-1 text-3xl font-extrabold text-green">{props.t('servicesCards.firstCard.title')}</h2>
            <p className="mt-2 text-gray-500">
              {props.t('servicesCards.firstCard.text')}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 transform transition duration-500 hover:scale-110 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-fit md:h-full md:w-48" src="/assets/images/team.svg" alt="Man looking at item at a store"/>
          </div>
          <div className="py-8 pl-8 pr-4">
            <h2 className="block mt-1 text-3xl font-extrabold text-green">{props.t('servicesCards.secondCard.title')}</h2>
            <p className="mt-2 text-gray-500">
              {props.t('servicesCards.secondCard.text')}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 transform transition duration-500 hover:scale-110 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-fit md:h-full md:w-48" src="/assets/images/product.svg" alt="Man looking at item at a store"/>
          </div>
          <div className="py-8 pl-8 pr-4">
            <h2 className="block mt-1 text-3xl font-extrabold text-green">{props.t('servicesCards.thirthCard.title')}</h2>
            <p className="mt-2 text-gray-500">
              {props.t('servicesCards.thirthCard.text')}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>

export default ServicesCards;
