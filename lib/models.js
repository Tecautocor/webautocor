import * as Yup from "yup";

const digitsOnly = (value) => /^\d+$/.test(value);

export const SchemaForm = Yup.object().shape({
  action: Yup.string().required("Campo requerido"),
  appkey: Yup.string().required("Campo requerido"),
  pilot_firstname: Yup.string().required("Campo requerido"),
  pilot_contact_type_id: Yup.string().nullable().required("Campo requerido"),
  pilot_business_type_id: Yup.string().nullable().required("Campo requerido"),
  pilot_suborigin_id: Yup.string().required("Campo requerido"),
});

export const HomeContactSchema = Yup.object().shape({
  name: Yup.string().required("Campo requerido"),
  lastname: Yup.string().required("Campo requerido"),
  phone: Yup.string()
    .test("Sólo dígitos", "El campo debe tener solo dígitos", digitsOnly)
    .length(10, "Campo debe tener 10 dígitos")
    .required("Campo requerido"),
  email: Yup.string()
    .email("Debe ser un email válido")
    .required("Campo requerido"),
  city: Yup.string().required("Campo requerido"),
});

export const BuyContactSchema = Yup.object().shape({
  name: Yup.string().required("Campo requerido"),
  lastname: Yup.string().required("Campo requerido"),
  phone: Yup.string()
    .test("Sólo dígitos", "El campo debe tener solo dígitos", digitsOnly)
    .length(10, "Campo debe tener 10 dígitos")
    .required("Campo requerido"),
  email: Yup.string()
    .email("Debe ser un email válido")
    .required("Campo requerido"),
  city: Yup.string().required("Campo requerido"),
  model: Yup.string().required("Campo requerido"),
  amount: Yup.string().required("Campo requerido"),
  brand: Yup.string().required("Campo requerido"),
  year: Yup.string().required("Campo requerido"),
});

export const BudgetContactSchema = Yup.object().shape({
  name: Yup.string().required("Campo requerido"),
  lastname: Yup.string().required("Campo requerido"),
  phone: Yup.string()
    .test("Sólo dígitos", "El campo debe tener solo dígitos", digitsOnly)
    .length(10, "Campo debe tener 10 dígitos")
    .required("Campo requerido"),
  email: Yup.string()
    .email("Debe ser un email válido")
    .required("Campo requerido"),
  city: Yup.string().required("Campo requerido"),
});
