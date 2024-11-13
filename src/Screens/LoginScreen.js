import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik, Field, Form } from "formik";
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import * as Yup from "yup";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebaseApp from "../firebase/firebase"; // Correct Firebase import
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
const auth = getAuth(firebaseApp);

const LoginScreen = () => {
  const [signup, setSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setError("");
  }, [signup]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email address"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleRegister = (email, password, refCode, resetForm) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const db = getFirestore(firebaseApp);
        const uniqueRefCode = Math.floor(1000000 + Math.random() * 9000000);
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          refCode: uniqueRefCode,
          referredBy: Number(refCode) || null,
          amount: 0,
        });

        setLoading(false);
        setError("");
        toast.success("Account created successfully!");
        setSignUp(false);
        resetForm();
      })
      .catch((error) => {
        setLoading(false);
        if (error.code === "auth/email-already-in-use") {
          toast.error("This email is already registered.");
        } else {
          toast.error(error.message);
        }
        resetForm();
      });
  };

  const handleLogin = (email, password, resetForm) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        setError("");
        const userId = userCredential.user.uid;
        toast.success("Login successful!");
        resetForm();
        navigate("/home", { state: { userId } });
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Invalid Credentials");
        resetForm();
      });
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex" }}>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#eba834",
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ color: "white", fontWeight: "600", fontSize: "48px" }}
        >
          Lottery Club
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {signup ? (
          <Box
            sx={{
              width: "80%",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              p: 5,
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <Typography sx={{ fontWeight: "600", fontSize: "30px" }}>
              Register Here
            </Typography>
            <Formik
              initialValues={{
                email: "",
                password: "",
                refCode: null,
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleRegister(
                  values.email,
                  values.password,
                  values.refCode,
                  resetForm
                );
              }}
            >
              {({
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                resetForm,
              }) => (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "40px",
                    }}
                  >
                    <Field
                      as={TextField}
                      label="Enter Your Email Address"
                      name="email"
                      variant="standard"
                      type="email"
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <Field
                      as={TextField}
                      label="Create Your Password"
                      name="password"
                      variant="standard"
                      type="password"
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <Field
                      as={TextField}
                      label="Referral Code (Optional)"
                      name="refCode"
                      variant="standard"
                      type="text"
                      error={touched.refCode && !!errors.refCode}
                      helperText={touched.refCode && errors.refCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.refCode}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: { xs: "column", md: "row" },
                      gap: { xs: "20px", md: "20px" },
                    }}
                  >
                    <Button
                      type="submit"
                      sx={{
                        width: "150px",
                        bgcolor: "#eba834",
                        color: "white",
                        "&:hover": { bgcolor: "#eba834", color: "white" },
                      }}
                    >
                      {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                    <Typography>
                      Existing User?{" "}
                      <Link
                        onClick={() => {
                          setSignUp(false);
                          resetForm();
                        }}
                        style={{ color: "#eba834", textDecoration: "none" }}
                      >
                        Login
                      </Link>{" "}
                    </Typography>
                  </Box>
                  {error && <Typography color="error">{error}</Typography>}
                </Form>
              )}
            </Formik>
          </Box>
        ) : (
          <Box
            sx={{
              width: "80%",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              p: 5,
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <Typography sx={{ fontWeight: "600", fontSize: "30px" }}>
              Welcome Back, Play & Win Cash
            </Typography>

            {/* Form for Login */}
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleLogin(values.email, values.password, resetForm); // Call login function
              }}
            >
              {({
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                resetForm,
              }) => (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "40px",
                    }}
                  >
                    <Field
                      as={TextField}
                      label="Enter Your Email Address"
                      name="email"
                      variant="standard"
                      type="email"
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <Field
                      as={TextField}
                      label="Enter Your Password"
                      name="password"
                      variant="standard"
                      type="password"
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Button
                      type="submit"
                      sx={{
                        width: "150px",
                        bgcolor: "#eba834",
                        color: "white",
                        "&:hover": { bgcolor: "#eba834", color: "white" },
                      }}
                    >
                      {loading ? "Logging In..." : "Login"}
                    </Button>
                    <Typography sx={{ marginTop: "20px" }}>
                      Don't have an account?{" "}
                      <Link
                        onClick={() => {
                          setSignUp(true);
                          resetForm();
                        }}
                        style={{ color: "#eba834", textDecoration: "none" }}
                      >
                        Create
                      </Link>
                    </Typography>
                  </Box>
                  {error && <Typography color="error">{error}</Typography>}
                </Form>
              )}
            </Formik>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LoginScreen;
