import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { toast } from "react-toastify";
import { AuthContext} from "../../context/AuthContext.jsx";
import useForm from "../../hooks/useForm.js";
import { validateLoginForm} from "../../utils/validators.js";

export const Login = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const {
        login,
        isAuthenticated,
        loading,
        error: authError,
    } = useContext(AuthContext);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    // Form submission handler
    const handleLogin = async (values) => {
        try {
            // First start the login process
            await login({
                email: values.email,
                password: values.password,
            });

            toast.success("Login successful! Redirecting...");

            // Wait briefly for the toast to be visible
            setTimeout(() => {
                // Force a page reload to update the navbar state
                window.location.href = "/";
            }, 1500);
        } catch (err) {
            toast.error("Login failed. Please try again.");
        }
    };

    // Initialize form with useForm hook
    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
        { email: "", password: "" },
        handleLogin,
        validateLoginForm
    );

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <div className="flex justify-center items-start pt-24 min-h-screen bg-white px-4">
            <div className="w-full max-w-[400px]">
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    centered
                    className="mb-4"
                    items={[
                        {
                            key: "login",
                            label: "SIGN IN",
                        },
                        {
                            key: "register",
                            label: <Link to="/register">REGISTER</Link>,
                        },
                    ]}
                />

                <form onSubmit={handleSubmit}>

                    {/* Email Input */}
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="Enter your e-mail address"
                            className={`w-full h-12 px-4 border ${
                                errors.email ? "border-red-500" : "border-gray-200"
                            } rounded focus:outline-none focus:border-gray-400`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="mb-3 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={`w-full h-12 px-4 border ${
                                errors.password ? "border-red-500" : "border-gray-200"
                            } rounded focus:outline-none focus:border-gray-400`}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>
                    {/* Forgot Password link */}
                    <div className="text-right mb-3">
                        <Link
                            to=""
                            onClick={() => alert("Coming soon!")}
                            className="text-sm text-gray-500 hover:text-black"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="w-full h-12 bg-black text-white font-medium rounded mb-8 cursor-pointer disabled:bg-gray-400"
                        style={{ color: "var(--color-white)", marginTop: "5px" }}
                    >
                        {isSubmitting || loading ? "LOGGING IN..." : "CONTINUE"}
                    </button>
                </form>

                {/* Display auth errors */}
                {authError && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                        {authError}
                    </div>
                )}

                {/* Divider */}
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gray-200 flex-grow"></div>
                    <div className="h-px bg-gray-200 flex-grow"></div>
                </div>


                {/* Terms Text */}
                <p className="text-center text-sm text-gray-500">
                    By continuing, you agree to our{" "}
                    <a href="#" className="underline hover:text-black">
                        Platform&apos;s Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-black">
                        Privacy Policy
                    </a>
                </p>

                {/* Don't have an account */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-black font-medium hover:underline"
                        >
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
