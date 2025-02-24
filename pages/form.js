import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { SchemaForm } from "../lib/models";
import { useCreate } from "../lib/hooks";
import { Spinner } from "../components/Shared";
export default function Home() {
  const { mutate, isLoading, isError, reset } = useCreate();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 text-2xl font-bold">Formulario Autocor - PILOT</h1>
      <Formik
        initialValues={{
          action: "create",
          appkey: "",
          pilot_firstname: "",
          pilot_contact_type_id: "1",
          pilot_business_type_id: "1",
          pilot_suborigin_id: "",
        }}
        validationSchema={SchemaForm}
        onSubmit={(values) => {
          mutate(values, {
            onSuccess() {
              reset();
            },
            onError() {
              reset();
            },
          });
        }}
      >
        <FormikForm noValidate>
          <div className="py-2">
            <label
              htmlFor="action"
              className="block text-sm font-bold font-lato text-gray-700"
            >
              action:
            </label>
            <Field
              type="text"
              name="action"
              id="action"
              readOnly
              className="appearance-none font-light block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main focus:border-main sm:text-sm"
            />
            <ErrorMessage name="action">
              {(msg) => <div className="text-red-800 text-sm py-2">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="py-2">
            <label
              htmlFor="appkey"
              className="block text-sm font-bold font-lato text-gray-700"
            >
              appkey:
            </label>
            <Field
              type="text"
              name="appkey"
              id="appkey"
              className="appearance-none font-light block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main focus:border-main sm:text-sm"
            />
            <ErrorMessage name="appkey">
              {(msg) => <div className="text-red-800 text-sm py-2">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="py-2">
            <label
              htmlFor="pilot_firstname"
              className="block text-sm font-bold font-lato text-gray-700"
            >
              pilot_firstname:
            </label>
            <Field
              type="text"
              name="pilot_firstname"
              id="pilot_firstname"
              maxLength="150"
              className="appearance-none font-light block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main focus:border-main sm:text-sm"
            />
            <ErrorMessage name="pilot_firstname">
              {(msg) => <div className="text-red-800 text-sm py-2">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="py-2">
            <label
              htmlFor="pilot_contact_type_id"
              className="block text-sm font-bold font-lato text-gray-700"
            >
              pilot_contact_type_id:
            </label>
            <Field
              as="select"
              name="pilot_contact_type_id"
              id="pilot_contact_type_id"
              className="appearance-none font-light block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main focus:border-main sm:text-sm"
            >
              <option key="1" value="1">
                Electrónico
              </option>
              <option key="2" value="2">
                Telefónico
              </option>
              <option key="3" value="3">
                Entrevista
              </option>
            </Field>
            <ErrorMessage name="pilot_contact_type_id">
              {(msg) => <div className="text-red-800 text-sm py-2">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="py-2">
            <label
              htmlFor="pilot_business_type_id"
              className="block text-sm font-bold font-lato text-gray-700"
            >
              pilot_business_type_id:
            </label>
            <Field
              as="select"
              name="pilot_business_type_id"
              id="pilot_business_type_id"
              className="appearance-none font-light block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main focus:border-main sm:text-sm"
            >
              <option key="1" value="1">
                Convencional / 0km
              </option>
              <option key="2" value="2">
                Usados
              </option>
              <option key="3" value="3">
                Plan de Ahorro
              </option>
            </Field>
            <ErrorMessage name="pilot_business_type_id">
              {(msg) => <div className="text-red-800 text-sm py-2">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="py-2">
            <label
              htmlFor="pilot_suborigin_id"
              className="block text-sm font-bold font-lato text-gray-700"
            >
              pilot_suborigin_id:
            </label>
            <Field
              type="text"
              name="pilot_suborigin_id"
              id="pilot_suborigin_id"
              maxLength="150"
              className="appearance-none font-light block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main focus:border-main sm:text-sm"
            />
            <ErrorMessage name="pilot_suborigin_id">
              {(msg) => <div className="text-red-800 text-sm py-2">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="py-2 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-block shadow-lg bg-main py-2 px-4 font-bold border border-transparent rounded-md text-sm text-white hover:bg-opacity-80"
            >
              {isLoading ? (
                <span className="flex">
                  <Spinner /> Procesando
                </span>
              ) : (
                <span className="flex">Guardar</span>
              )}
            </button>
          </div>
        </FormikForm>
      </Formik>

      {isError && (
        <div className="py-4 text-sm font-light text-main">
          Lo sentimos, la transacción no se realizó correctamente.
        </div>
      )}
    </div>
  );
}
