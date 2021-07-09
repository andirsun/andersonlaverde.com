const Partners = (props: any) =>
  <section className="bg-white border-b ">
    <h2 className="gradient text-center text-white text-3xl pt-8 pb-8">
      {props.t('partners.title')}
      <br />
      <b>{props.t('partners.subTitle')}</b>
    </h2>
    <div className="container mx-auto flex flex-wrap items-center justify-between pb-12 pt-8">
      <div className="flex flex-1 flex-wrap max-w-4xl mx-auto items-center justify-between text-xl text-gray-500 font-bold">

        <span className="w-1/2 p-4 md:w-auto flex items-center">
          <img src="./assets/images/logos/paypal2.png"
            className="h-20 w-40 mr-4 object-scale-down fill-current"
            alt=""
          />
        </span>
        <span className="w-1/2 p-4 md:w-auto flex items-center">
          <img src="./assets/images/logos/launch-mobility2.png"
            className="h-20 w-40 mr-4 object-scale-down fill-current text-gray-500"
            alt=""
          />
        </span>
        <span className="w-1/2 p-4 md:w-auto flex items-center">
          <img src="./assets/images/logos/genius2.png"
            className="h-20 w-40 mr-4 object-scale-down fill-current text-gray-500"
            alt=""
          />
        </span>
        <span className="w-1/2 p-4 md:w-auto flex items-center">
          <img src="./assets/images/logos/mercado-libre2.png"
            className="h-20 w-40 mr-4 object-scale-down fill-current text-gray-500"
            alt=""
          />
        </span>
        <span className="w-1/2 p-4 md:w-auto flex items-center">
          <img src="./assets/images/logos/avianca2.png"
            className="h-20 w-40 mr-4 object-scale-down fill-current text-gray-500"
            alt=""
          />
        </span>
        <span className="w-1/2 p-4 md:w-auto flex items-center">
          <img src="./assets/images/logos/skylab.png"
            className="h-20 w-40 mr-4 object-scale-down fill-current text-gray-500"
            alt=""
          />
        </span>
        <span className="w-1/3 p-4 md:w-auto flex items-center">
          <img src="./assets/images/logos/agrosty2.png"
            className="h-20 w-40 mr-4 object-contain fill-current text-gray-500"
            alt=""
          />
        </span>
        <span className="w-1/2 p-4 md:w-auto flex items-center">
          <img src="./assets/images/logos/menuty2.png"
            className="h-20 w-40 mr-4 object-scale-down fill-current text-gray-500"
            alt=""
          />
        </span>
      </div>
    </div>
  </section>
export default Partners;
