import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { auth, db } from "../firebase"; // Firebase configuration
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Textbox from "../components/Textbox";
import Button from "../components/Button";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize Redux dispatch

  const submitHandler = async (data) => {
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // Add user details to Firestore
      await setDoc(doc(db, `admins/${user.uid}/users/${user.uid}`), {
        name: data.name,
        email: data.email,
        createdAt: new Date(),
      });

      console.log("User signed up:", user);

      // Dispatch user to Redux store
      dispatch(setCredentials({
        uid: user.uid,
        email: user.email,
        name: data.name,
      }));

      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Signup error:", error.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* Left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600">
              Create an account to manage all your tasks!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              {/*<span>Cloud-Based</span>*/}
              <span>Task Manager</span>
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Create an Account
              </p>
              <p className="text-center text-base text-gray-700 ">
                Start managing your tasks efficiently.
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="Your Full Name"
                type="text"
                name="name"
                label="Full Name"
                className="w-full rounded-full"
                register={register("name", {
                  required: "Full Name is required!",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="Create a password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long.",
                  },
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <Button
                type="submit"
                label="Sign Up"
                className="w-full h-10 bg-blue-700 text-white rounded-full"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
