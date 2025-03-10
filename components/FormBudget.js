import axios from "axios";
import { IconArrow } from "../components/Shared";
import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";
import { BudgetContactSchema } from "../lib/models";
import Spinner from "./Spinner";
import { useState } from "react";

export default function FormBudget({ time, initialPayment, monthlyPayment }) {
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
        url: "/api/budgetContactForm",
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
    <div className="mx-auto">
      {isSuccess ? (
        <p className="font-bold py-16 text-lg tracking-tight text-white text-center">
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
          validationSchema={BudgetContactSchema}
          onSubmit={(values, { resetForm }) => {
            createRecord(
              {
                ...values,
                time: time,
                initialPayment: initialPayment,
                monthlyPayment: monthlyPayment,
              },
              resetForm
            );
          }}
        >
          <FormikForm
            noValidate
            className="flex flex-col gap-3 px-4 py-4 rounded-md"
          >
            <div className="">
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
                    <div className="py-2 px-2 text-xs text-white">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div>
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
                    <div className="py-2 px-2 text-xs text-white">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div>
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
                    <div className="py-2 px-2 text-xs text-white">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div>
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
                    <div className="py-2 px-2 text-xs text-white">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div>
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
                    <div className="py-2 px-2 text-xs text-white">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="py-2 gap-2 px-4 hover:shadow-lg border-secondary flex items-center bg-secondary text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-secondary hover:text-secondary transition-colors group"
              >
                {isLoading ? (
                  <span className="flex">
                    <Spinner />
                  </span>
                ) : (
                  <div className="flex items-center uppercase gap-2">
                    <span className="flex">Enviar</span>
                    <IconArrow className="w-2 fill-white group-hover:fill-secondary" />
                  </div>
                )}
              </button>
            </div>

            <div>
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
  );
}
