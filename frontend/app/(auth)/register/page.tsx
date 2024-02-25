"use client";

import UnderlinedInput from "@/components/underlined-input";
import { Button, Input } from "@nextui-org/react";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { object, string } from "yup";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/store";
import { registerUser } from "@/store/auth/authSlice";

interface InitialValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = object({
  email: string().email().required("email is required"),
  password: string().min(5).max(20).required("password is required"),
  confirmPassword: string().required("confirm the password"),
});

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    errors,
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
    touched,
  } = useFormik<InitialValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: onSubmit,
  });

  async function onSubmit(
    values: InitialValues,
    { setSubmitting, resetForm, setErrors }: FormikHelpers<InitialValues>
  ) {
    if (values.password !== values.confirmPassword) {
      setSubmitting(false);
      setErrors({
        confirmPassword: "passwords are not equal",
      });
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(registerUser(values)).unwrap();
      await router.push("/");
      router.refresh();
    } catch (error) {
      setErrors({
        email: (error as string).toLowerCase(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className=" dark:bg-dark-200 bg-light-100  flex justify-center items-center w-full h-full">
      <div className="auth-form">
        <h2 className="font-medium text-xl mb-3">Your Register Data</h2>
        <p className="desc mb-5">
          Please register your
          <span className="block">new account</span>
        </p>
        <form onSubmit={handleSubmit}>
          <UnderlinedInput
            id="email"
            label="Email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            errorMessage={errors.email && touched.email && errors.email}
            className="mb-4"
          />
          <UnderlinedInput
            id="password"
            label="Password"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            errorMessage={
              errors.password && touched.password && errors.password
            }
            className="mb-4"
          />
          <UnderlinedInput
            id="confirmPassword"
            label="Password"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.confirmPassword}
            errorMessage={
              errors.confirmPassword &&
              touched.confirmPassword &&
              errors.confirmPassword
            }
            className="mb-12"
          />

          <Button disabled={isSubmitting} type="submit" className="form-btn">
            Next
          </Button>
        </form>
        <p className="mx-auto my-16 dark:text-white text-black  text-sm">
          Already have an acocunt{" "}
          <Link className="text-blue-400" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
