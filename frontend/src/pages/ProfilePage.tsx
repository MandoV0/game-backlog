import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/ProfilePage.css";
import { Navigate, useNavigate } from "react-router-dom";
import { isUserLoggedIn } from "../helpers/JwtHelper";

export const ProfilePage = () => {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSave = async () => {
        setLoading(true);
        try {
            alert("Username updated successfully");
        } catch (err: any) {
            console.error(err);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cant be undone.")) {
            alert("Account deleted. Redirecting...");
            navigate("/");
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        alert("Signed out");
        navigate("/");
    };

    if (!isUserLoggedIn()) {
        return (
            <>
                <Header></Header>
                <h1>Login to be able to manage your Profile.</h1>
                <button onClick={() => navigate("/auth")}>Login/Sign up</button>
            </>
        )
    }

    return (
        <>
            <Header></Header>
            <div className="profile-container">
                <h1>Profile Settings</h1>

                <div className="profile-section">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <hr />

                <div className="profile-section danger-zone">
                    <h2>Danger Zone</h2>
                    <button className="delete-btn" onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                    <button className="signout-btn" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    )
}