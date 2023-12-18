import React from "react";
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

// formik.handleChange && formik.handleBlur = input
// formik.handleSubmit = form

const Experiment = () => {
  // validasi ini bisa diganti sama validationSchema Yup
  // const validate = (values) => {
  //   const errors = {};
  //   if (!values.firstName) {
  //     errors.firstName = "Required";
  //   } else if (values.firstName.length > 15) {
  //     errors.firstName = "Must be 15 characters or less";
  //   }

  //   if (!values.lastName) {
  //     errors.lastName = "Required";
  //   } else if (values.lastName.length > 20) {
  //     errors.lastName = "Must be 20 characters or less";
  //   }

  //   if (!values.email) {
  //     errors.email = "Required";
  //   } else if (
  //   ) {
  //     errors.email = "Invalid email address";
  //   }

  //   return errors;
  // };
  const formik = useFormik({
    initialValues: {
      firstNames: "",
      lastName: "",
      email: "",
    },
    // return object errors
    // validate,
    onSubmit: (values, { setSubmitting }) => {
      // stringify parameters
      // replacer fungsi nya masih gak tau untuk apa
      // JSON.stringify(value, replacer, space)
      alert(JSON.stringify(values, null, 10));
      setSubmitting(false);
    },
    // validationSchema akan membaca value dari nama objek di initialValues
    validationSchema: Yup.object({
      firstNames: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Required"),
    }),
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      {/* htmlFor & id gak nyambung sama initialValues */}
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        // kalo name nya ngaco values nya ga muncul
        name="firstNames"
        type="text"
        // alternatif pengganti onChange & onBlur, biar lebih ringkas
        {...formik.getFieldProps("firstNames")}

        // handleChange akan langsung mengirim data ke initialValues, terpisah dengan atribut value di input
        // onChange={formik.handleChange}
        // harus nya ini namanya on focus / after first input
        // onBlur={formik.handleBlur}

        // ga perlu pakai atribut value sebenarnya
        // value={formik.values.firstName}
      />
      {/* {formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null} */}
      {formik.touched.firstNames && formik.errors.firstNames ? (
        <div>{formik.errors.firstNames}</div>
      ) : null}
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        {...formik.getFieldProps("lastName")}
        value={formik.values.lastName}
      />
      {/* {formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null} */}
      {formik.touched.lastName && formik.errors.lastName ? (
        <div>{formik.errors.lastName}</div>
      ) : null}
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        {...formik.getFieldProps("email")}
        value={formik.values.email}
      />
      {/* {formik.errors.email ? <div>{formik.errors.email}</div> : null} */}
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  );
};

export default connect(null, null)(Experiment);

// pakai komponen berbasic react context => Formik, Form, Field, & ErrorMessage
