import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";
import Layout from "../components/Layout";
import { useState } from "react";
import * as Yup from "yup";

const FILE_SIZE_LIMIT_MB = 5;

const FormSchema = Yup.object().shape({
  firstName: Yup.string().required("Campo Requerido"),
  lastName: Yup.string().required("Campo Requerido"),
  idNumber: Yup.string()
    .matches(/^\d{10}$/, "La cédula debe tener exactamente 10 dígitos")
    .required("La cédula o identificación es obligatoria"),
  birthDate: Yup.date()
    .max(new Date(), "La fecha no puede ser futura")
    .required("Campo Requerido"),
  city: Yup.string().required("Campo Requerido"),
  country: Yup.string().required("Campo Requerido"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "El número de contacto debe tener exactamente 10 dígitos")
    .required("El número de contacto es obligatorio"),
  email: Yup.string().email("Correo no válido").required("Campo Requerido"),
  position: Yup.string().required("Campo Requerido"),
  // resume: Yup.mixed()
  //   .required("Campo Requerido")
  //   .test("fileFormat", "Solo PDF o Word", (value) =>
  //     value
  //       ? ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(value.type)
  //       : false
  //   )
  //   .test("fileSize", `El archivo no debe superar los ${FILE_SIZE_LIMIT_MB}MB`, (value) =>
  //     value ? value.size <= FILE_SIZE_LIMIT_MB * 1024 * 1024 : false
  //   ),
  consent: Yup.boolean().oneOf([true], "Debes aceptar el tratamiento de datos personales"),
});

export default function Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  async function sendEmail(values) {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      // Send the form data to your API endpoint
      const response = await fetch('/api/sendMail', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      console.log('Email sent successfully:', await response.json());
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error sending email:', error);
      setIsLoading(false);
      setIsError(true);
    }
  }

  const initialValues = {
    firstName: "",
    lastName: "",
    idNumber: "",
    birthDate: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    position: "",
    resume: null,
    consent: false,
  };

  return (
    <Layout selected="form">
      <div className="mx-auto max-w-4xl px-4 pt-16">
        <h1 className="text-2xl font-light uppercase tracking-normal text-main text-center mb-10">
          APLICA A UNA VACANTE EN AUTOCOR
        </h1>

        {isSuccess ? (
          <p className="font-bold py-10 text-lg text-center text-green-600">
            Tu información fue enviada correctamente
          </p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={FormSchema}
            onSubmit={(values, { resetForm }) => {
              sendEmail(values);
              resetForm({ values: initialValues });
              setSelectedFileName("");
            }}
          >
            {({ setFieldValue }) => (
              <FormikForm className="grid grid-cols-1 gap-y-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Información Personal
                </h2>

                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-800">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="firstName"
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Nombre"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-sm text-main mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="lastName"
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Apellido"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-sm text-main mt-1" />
                  </div>
                </div>

                {/* Cédula */}
                <div>
                  <label className="text-sm font-medium text-gray-800">
                    Cédula o número de identificación <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="idNumber"
                    type="text"
                    maxLength="10"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Ej: 1234567890"
                  />
                  <ErrorMessage name="idNumber" component="div" className="text-sm text-main mt-1" />
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="text-sm font-medium text-gray-800">
                    Fecha de nacimiento <span className="text-red-500">*</span>
                  </label>
                  <Field name="birthDate" type="date" className="w-full px-3 py-2 border rounded" />
                  <ErrorMessage name="birthDate" component="div" className="text-sm text-main mt-1" />
                </div>

                {/* Ciudad y País */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-800">
                      Ciudad de residencia <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="city"
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Ciudad"
                    />
                    <ErrorMessage name="city" component="div" className="text-sm text-main mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800">
                      País de residencia <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="country"
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      placeholder="País"
                    />
                    <ErrorMessage name="country" component="div" className="text-sm text-main mt-1" />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-sm font-medium text-gray-800">
                    Número de contacto <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="phone"
                    type="text"
                    maxLength="10"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Ej: 0987654321"
                  />
                  <ErrorMessage name="phone" component="div" className="text-sm text-main mt-1" />
                </div>

                {/* Correo */}
                <div>
                  <label className="text-sm font-medium text-gray-800">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <ErrorMessage name="email" component="div" className="text-sm text-main mt-1" />
                </div>

                {/* Área de interés */}
                <div>
                  <label className="text-sm font-medium text-gray-800">
                    Cargo o área de interés <span className="text-red-500">*</span>
                  </label>
                  <Field as="select" name="position" className="w-full px-3 py-2 border rounded">
                    <option value="">Selecciona un área</option>
                    <option value="VENTAS">VENTAS</option>
                    <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                    <option value="TALLER">TALLER</option>
                  </Field>
                  <ErrorMessage name="position" component="div" className="text-sm text-main mt-1" />
                </div>

                {/* Adjuntar CV */}
                <div>
                  <label className="text-sm font-medium text-gray-800">
                    Adjuntar CV <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("resume", file);
                      setSelectedFileName(file?.name || "");
                    }}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-main file:text-white hover:file:bg-opacity-90 transition-colors"
                  />
                  <span className="text-sm text-gray-500 mt-1 block">
                    {selectedFileName || "En formato PDF o Word"}
                  </span>
                  <ErrorMessage name="resume" component="div" className="text-sm text-main mt-1" />
                </div>

                {/* Consentimiento */}
                <div className="flex items-start gap-2">
                  <Field type="checkbox" name="consent" />
                  <label htmlFor="consent" className="text-sm text-gray-700">
                    Autorizo el tratamiento de mis datos personales para fines de procesos de selección y reclutamiento por parte de AUTOCOR
                  </label>
                </div>
                <ErrorMessage name="consent" component="div" className="text-sm text-main mt-1" />

                {/* Botón */}
                <div className="mt-6 text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-2 px-6 bg-main text-white font-semibold rounded hover:bg-opacity-80"
                  >
                    {isLoading ? "Enviando..." : "Enviar"}
                  </button>
                </div>

                {/* Error */}
                {isError && (
                  <div className="text-center text-red-500 font-semibold mt-2">
                    Ocurrió un error. Intenta nuevamente.
                  </div>
                )}
              </FormikForm>
            )}
          </Formik>
        )}
      </div>
    </Layout>
  );
}