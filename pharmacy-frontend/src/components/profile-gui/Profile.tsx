import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, TextField, Container, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { User } from '../../interfaces';
import { useUserContext } from "../UserContext";

function Profile() {
    const currUser = useUserContext().user;
    const navigate = useNavigate();
    const { username } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5001/api/user/${currUser?.name}`)
            .then(response => {
                if (!response.ok) throw new Error("Error fetching user data.");
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => console.error("Error fetching user:", error));
    }, [username]);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/user/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: currUser?.name,
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }),
            });
            if (!response.ok) throw new Error("Error updating password.");

            alert("Password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Could not update password.");
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currUser }), // Pass the user object in the request body
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // "Logout successful. Redirecting to login page..."

                // Redirect to the login page
                window.location.href = data.redirect;
            } else {
                const errorData = await response.json();
                console.error('Logout failed:', errorData.error);
                alert(errorData.error); // Show error message to the user
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    const handleNavigateHome = () => {
        navigate("/Pharm");
    };

    return (
        <div>
            <AppBar position="fixed" sx={{ backgroundColor: "#00796b" }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }} />
                <Button color="inherit" onClick={handleNavigateHome}>
                    Home
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                    Log Out
                </Button>
            </Toolbar>
        </AppBar>

            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper sx={{ padding: 4 }}>
                    <Box mb={4} textAlign="center">
                        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "2rem" }}>
                            {user?.name || "User"} Profile
                        </Typography>
                    </Box>

                    {user && (
                        <Box>
                            <TextField label="Name" fullWidth value={user.name} margin="normal" InputProps={{ readOnly: true }} />
                            <TextField label="Username" fullWidth value={user.username} margin="normal" InputProps={{ readOnly: true }} />
                            <TextField label="Role" fullWidth value={user.type} margin="normal" InputProps={{ readOnly: true }} />
                        </Box>
                    )}

                    <Box mt={4}>
                        <Typography variant="h6">Change Password</Typography>
                        <TextField
                            label="Current Password"
                            type="password"
                            fullWidth
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handlePasswordChange}>
                            Update Password
                        </Button>
                    </Box>
                </Paper>
            </Container>
            
        </div>
    );
}

export default Profile;
