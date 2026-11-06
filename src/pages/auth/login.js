import { useCallback, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Button, Typography, TextField } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    submit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear previous error when input changes
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
          status: data.user.status,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
        };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        router.push("/inventory/onhandstock");
      } else {
        // การล็อกอินไม่สำเร็จ
        setFormErrors({
          ...formErrors,
          submit: data.message || "An error occurred while logging in.",
        });
      }
    } catch (error) {
      // เกิดข้อผิดพลาดในการส่งคำขอหรือรับคำตอบจากเซิร์ฟเวอร์
      console.error("Error logging in:", error);
      setFormErrors({ ...formErrors, submit: "An error occurred while logging in." });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform your own form validation here if needed
    if (!formData.email) {
      setFormErrors({ ...formErrors, email: "Email is required." });
      return;
    }
    if (!formData.password) {
      setFormErrors({ ...formErrors, password: "Password is required." });
      return;
    }

    handleLogin();
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      // Clear the flag
      localStorage.removeItem("isLoggedIn");
      // Reload the page
      router.reload();
    }
  }, []);

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    console.log(user); // แสดงข้อมูลผู้ใช้จาก Local Storage
  }

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  const handleSkip = useCallback(() => {
    auth.skip();
    router.push("/");
  }, [auth, router]);

  return (
    <>
      <Head>
        <title>Login | F.I.M (Farm Inventory Management)</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginLeft:18,
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            px: 3,
            py: "100px",
            width: "100%",
            padding: 1,
          }}
        >
          <div>
            <Typography variant="h4" align="center">
              Login
            </Typography>
            {method === "email" && (
              <form noValidate onSubmit={handleSubmit}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Username</Typography>
                  <TextField
                    fullWidth
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    name="email"
                    onBlur={handleChange}
                    onChange={handleChange}
                    type="email"
                    value={formData.email}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Password</Typography>
                  <TextField
                    fullWidth
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    name="password"
                    onBlur={handleChange}
                    onChange={handleChange}
                    type="password"
                    value={formData.password}
                  />
                </Box>
                {formErrors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formErrors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                  color="error"
                  // onClick={handleLogin}
                >
                  LOGIN
                </Button>
              </form>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
