import React, { useState }  from "react";
import { useForm, SubmitHandler } from "react-hook-form";
// Interfaces
import IContact from "../interfaces/contact";
// Services
import LandingService from '../services/landing.service';

type Inputs  = {
  name: string,
  email: string,
  message: string,
  company: string
}

const ContactSection = (props: any) => {
  const [messageSended, setMessageSended] = useState(false)
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<IContact> = async data => {
    try {
      await LandingService.send(data);
      setMessageSended(true);
      reset();
    } catch (e) {
      console.error (e)
    };
  }
  return (
    <section id="contactForm" className="relative flex items-top justify-center min-h-screen gradient dark:bg-green sm:items-center sm:pt-0">
      <div className="pt-2 max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div className="mt-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="p-6 mt-10 mb-24 mr-2 bg-gray-100 dark:bg-gray-800 sm:rounded-lg">
              <h1 className="text-normal text-4xl sm:text-5xl text-gray-800 dark:text-white font-extrabold tracking-tight">
                {props.t('contact.title')}
              </h1>
              <br />
              <p className="text-normal text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400 mt-2">
                {props.t('contact.text')}
              </p>
              <br />
              <p className="text-normal text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-400 mt-2">
                Latam
              </p>
              <div className="w-full mb-4">
                <div className="h-1 gradient w-64 opacity-25 my-2 py-0 rounded-t"></div>
              </div>
              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="ml-4 text-md tracking-wide  w-40">
                  Colombia
                </div>
              </div>

              <div className="flex items-center mt-2 mb-6 text-gray-600 dark:text-gray-400">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:latam@slinqer.com"className="ml-4 text-md tracking-wide font-semibold w-40 hover:underline">
                  latam@slinqer.com
                </a>
              </div>
              <p className="text-normal text-lg sm:text-xl text-gray-600 dark:text-gray-400 mt-2">
                Europe
              </p>
              <div className="w-full mb-4">
                <div className="h-1 gradient w-64 opacity-25 my-2 py-0 rounded-t"></div>
              </div>
              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="ml-4 text-md tracking-wide w-40">
                  Lithuania
                </div>
              </div>

              <div className="flex items-center mt-2 mb-6 text-gray-600 dark:text-gray-400">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:europe@slinqer.com" className="ml-4 text-md tracking-wide font-semibold w-40 hover:underline">
                  europe@slinqer.com
                </a>
              </div>

            </div>

            <form className="p-6 flex flex-col justify-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col">
                <label htmlFor="name" className="hidden">Name</label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder={props.t('contact.form.name')}
                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="email" className="hidden">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder={props.t('contact.form.email')}
                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="email" className="hidden">Company</label>
                <input
                  {...register("company")}
                  type="text"
                  placeholder={props.t('contact.form.company')}
                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="message" className="hidden">Message</label>
                <textarea
                  {...register("message")}
                  placeholder={props.t('contact.form.message')}
                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {
                messageSended &&
                  <div className="text-center py-4 lg:px-4">
                    <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                      <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">👍</span>
                      <span className="font-semibold mr-2 text-left flex-auto">{props.t('contact.form.confirmation')}</span>
                    </div>
                  </div>
              }

              <button type="submit"
                className="md:w-32 bg-white hover:bg-blue-dark text-gray-800 font-bold mt-2 py-4 px-6 rounded-lg mt-3 hover:bg-indigo-300 transition ease-in-out duration-300"
              >
                {props.t('contact.form.button')}
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
