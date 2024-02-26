"use client";
import UnderlinedInput from "@/components/underlined-input";
import { Button, cn } from "@nextui-org/react";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { object, string } from "yup";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/store";
import { loginUser } from "@/store/auth/authSlice";
import LoadingSpinner from "@/components/loading-spinner";
import { useEffect } from "react";

interface InitialValues {
  email: string;
  password: string;
}

const validationSchema = object({
  email: string().email().required("email is required"),
  password: string().min(5).max(20).required("password is required"),
});

const Login = () => {
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
    },
    validationSchema,
    onSubmit: onSubmit,
  });

  async function onSubmit(
    values: InitialValues,
    { setSubmitting, resetForm, setErrors }: FormikHelpers<InitialValues>
  ) {
    try {
      setSubmitting(true);
      await dispatch(loginUser(values)).unwrap();
      router.push("/");
      router.refresh();
      
    } catch (error) {
      console.log(error);
      setErrors({
        email: "invalid email or password",
        password: "invalid email or password",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <div className=" dark:bg-dark-200 bg-light-100 flex justify-center items-center w-full h-full">
      <div className="auth-form">
        <h2 className="font-medium text-xl mb-3">Login </h2>
        <p className="desc mb-5">
          Please login into
          <span className="block">your account</span>
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
            className="mb-12"
          />

          <Button type="submit" className={cn("form-btn ")}>
            Next
          </Button>
        </form>
        <p className="mx-auto my-16 dark:text-white text-black text-sm">
          Dont have an account then{" "}
          <Link className="text-blue-400" href="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
