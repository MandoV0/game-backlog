import React, { useState } from "react";
import "../styles/Auth.css";
import { loginUser, registerUser } from "../api/Client";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "register" && !username) {
            setError("Username is required");
            return;
        }

        if (!email || !password) {
            setError("Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            let res;
            if (mode === "login") {
                res = await loginUser({ email, password });
            } else {
                res = await registerUser({ username, email, password });
            }

            localStorage.setItem("token", res.data.token);

            navigate("/");
        } catch (err : any) {
            setError(err?.message || "Authentication failed")
        } finally {
            setLoading(false);
        }

        setError("");
        console.log({ username, email, password, mode });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>{mode === "login" ? "Login" : "Register"}</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === "register" && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit">
                        {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
                    </button>
                </form>
                <div className="toggle-mode">
                    {mode === "login"
                        ? "Don't have an account?"
                        : "Already have an account?"}
                    <button
                        onClick={() => setMode(mode === "login" ? "register" : "login")}
                    >
                        {mode === "login" ? "Register" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
