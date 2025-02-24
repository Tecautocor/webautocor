import axios from "axios";
import Image from "next/image";
import { IconArrow } from "../components/Shared";
import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";
import { HomeContactSchema } from "../lib/models";
import Spinner from "./Spinner";
import { useState } from "react";

export default function Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function createRecord(record, resetForm) {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      await axios({
        method: "POST",
        url: "/api/homeContactForm",
        data: record,
      });

      setIsLoading(false);
      setIsSuccess(true);
      resetForm();
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  }

  return (
    <div className="">
      <div className="mx-auto max-w-7xl py-8 px-6 sm:py-12 lg:px-8">
        <div className="relative bg-white shadow-xl">
          <h2 className="sr-only">Contáctanos</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="flex justify-center items-center bg-secondary -py-10 -px-6 sm:-px-10 xl:-p-12">
              <Image
                className="rounded-md"
                src="/auto-datos.png"
                alt=""
                width={1200}
                height={713}
                priority
              />
            </div>

            <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12 bg-main">
              <h2 className="text-xl font-light uppercase tracking-tight text-white sm:text-xl text-center">
                DÉJANOS TUS DATOS
              </h2>
              <p className="mt-1 text-3xl uppercase font-bold leading-8 text-white font-poppins text-center">
                ¡ESTRENA TU SEMINUEVO HOY!
              </p>
              <p className="font-light text-lg tracking-tight text-white text-center">
                Un asesor te contactará de inmediato{" "}
              </p>
              {isSuccess ? (
                <p className="font-bold py-10 text-lg tracking-tight text-white text-center">
                  Tu información fue enviada correctamente
                </p>
              ) : (
                <Formik
                  initialValues={{
                    name: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    city: "",
                  }}
                  validationSchema={HomeContactSchema}
                  onSubmit={(values, { resetForm }) => {
                    createRecord(values, resetForm);
                  }}
                >
                  <FormikForm
                    noValidate
                    className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
                  >
                    <div className="">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white"
                      ></label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Nombre"
                          className="block w-full rounded-md font-light border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-main focus:ring-main"
                        />
                        <ErrorMessage name="name">
                          {(msg) => (
                            <div className="py-2 px-2 text-sm text-white">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="">
                      <label
                        htmlFor="lastname"
                        className="block text-sm font-medium text-white"
                      ></label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="lastname"
                          id="lastname"
                          placeholder="Apellido"
                          className="block w-full rounded-md font-light border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-main focus:ring-main"
                        />
                        <ErrorMessage name="lastname">
                          {(msg) => (
                            <div className="py-2 px-2 text-sm text-white">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-900"
                        ></label>
                      </div>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          autoComplete="tel"
                          placeholder="Número de teléfono"
                          className="block w-full rounded-md font-light border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-main focus:ring-main"
                          aria-describedby="phone-optional"
                        />
                        <ErrorMessage name="phone">
                          {(msg) => (
                            <div className="py-2 px-2 text-sm text-white">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-900"
                      ></label>
                      <div className="mt-1">
                        <Field
                          id="city"
                          name="city"
                          type="text"
                          placeholder="Ciudad"
                          className="block w-full font-light rounded-md border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-main focus:ring-main"
                        />
                        <ErrorMessage name="city">
                          {(msg) => (
                            <div className="py-2 px-2 text-sm text-white">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-900"
                      ></label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Correo electrónico"
                          className="block w-full font-light rounded-md border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-main focus:ring-main"
                        />
                        <ErrorMessage name="email">
                          {(msg) => (
                            <div className="py-2 px-2 text-sm text-white">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex justify-center">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="py-2 gap-2 px-4 hover:shadow-lg flex items-center border-gray-600 bg-gray-600 text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-gray-600 hover:text-gray-600 transition-colors group"
                      >
                        {isLoading ? (
                          <span className="flex">
                            <Spinner />
                          </span>
                        ) : (
                          <div className="flex items-center uppercase gap-2">
                            <span className="flex">Enviar</span>
                            <IconArrow className="w-2 fill-white group-hover:fill-gray-600" />
                          </div>
                        )}
                      </button>
                    </div>

                    <div className="sm:col-span-2">
                      {isSuccess && (
                        <div className="font-bold text-white">
                          Su mensaje fue enviado correctamente!
                        </div>
                      )}

                      {isError && (
                        <div className="font-bold text-white">
                          Lo sentimos hubo un error. Intente nuevamente.
                        </div>
                      )}
                    </div>
                  </FormikForm>
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
