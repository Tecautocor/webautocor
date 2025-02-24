import axios from "axios";
import { IconArrow } from "../components/Shared";
import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";
import { BuyContactSchema } from "../lib/models";
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
        url: "/api/buyContactForm",
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
    <div className="mx-auto max-w-3xl">
      {isSuccess ? (
        <p className="font-bold py-10 text-lg tracking-tight text-gray-400 text-center">
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
            model: "",
            amount: "",
            brand: "",
            year: "",
          }}
          validationSchema={BuyContactSchema}
          onSubmit={(values, { resetForm }) => {
            createRecord(values, resetForm);
          }}
        >
          <FormikForm
            noValidate
            className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-6"
          >
            <div className="sm:col-span-3">
              <label htmlFor="name" className="sr-only">
                Nombre
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Nombre"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />
                <ErrorMessage name="name">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="lastName" className="sr-only">
                Apellido
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="lastname"
                  id="lastname"
                  placeholder="Apellido"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />
                <ErrorMessage name="lastname">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="phone" className="sr-only">
                Número de teléfono
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Número de teléfono"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />
                <ErrorMessage name="phone">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mail" className="sr-only">
                Correo electrónico
              </label>
              <div className="mt-1">
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Correo electrónico"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />

                <ErrorMessage name="email">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="city" className="sr-only">
                Ciudad
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Ciudad"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />
                <ErrorMessage name="city">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="model" className="sr-only">
                Modelo del vehículo
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="model"
                  id="model"
                  placeholder="Modelo del vehículo"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />
                <ErrorMessage name="model">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="amount" className="sr-only">
                Cantidad que deseas obtener por tu vehículo
              </label>
              <div className="mt-1">
                <Field
                  type="number"
                  name="amount"
                  id="amount"
                  placeholder="Cantidad que deseas obtener por tu vehículo"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />
                <ErrorMessage name="amount">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="brand" className="sr-only">
                Marca del vehículo
              </label>
              <div className="mt-1">
                <Field
                  type="text"
                  name="brand"
                  id="brand"
                  placeholder="Marca del vehículo"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />
                <ErrorMessage name="brand">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="year" className="sr-only">
                Año del vehículo
              </label>
              <div className="mt-1">
                <Field
                  type="number"
                  name="year"
                  id="year"
                  placeholder="Año del vehículo"
                  className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main text-xs sm:leading-6"
                />
                <ErrorMessage name="year">
                  {(msg) => (
                    <div className="py-2 px-2 text-xs text-main">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>
            <div className="mt-10 flex justify-center sm:col-span-6">
              <button
                type="submit"
                disabled={isLoading}
                className="py-2 gap-2 px-4 hover:shadow-lg border-main flex items-center bg-main text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-main hover:text-main transition-colors group"
              >
                {isLoading ? (
                  <span className="flex">
                    <Spinner />
                  </span>
                ) : (
                  <div className="flex items-center uppercase gap-2">
                    <span className="flex">Enviar</span>
                    <IconArrow className="w-2 fill-white group-hover:fill-main" />
                  </div>
                )}
              </button>
            </div>

            <div className="sm:col-span-6">
              {isSuccess && (
                <div className="font-bold text-main">
                  Su mensaje fue enviado correctamente!
                </div>
              )}

              {isError && (
                <div className="font-bold text-main">
                  Lo sentimos hubo un error. Intente nuevamente.
                </div>
              )}
            </div>
          </FormikForm>
        </Formik>
      )}
    </div>
  );
}
