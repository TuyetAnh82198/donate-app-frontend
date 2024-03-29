import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import ggLogo from "../imgs/gg_logo.png";

const Login = () => {
  //state email người dùng để kiểm tra người dùng đã đăng nhập chưa
  const [email, setEmail] = useState("");

  const emailInput = useRef();
  const passInput = useRef();

  const navigate = useNavigate();
  //hàm kiểm tra người dùng đã đăng nhập chưa
  const fetchIsLoggedIn = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "have not been logged in yet.") {
          setEmail("");
        } else {
          setEmail(data.email);
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchIsLoggedIn(), []);

  //hàm xử lý việc đăng nhập
  const submitForm = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.current.value,
        pass: passInput.current.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.err) {
            navigate("/server-error");
          } else {
            if (data.errMsg) {
              alert(data.errMsg);
            } else if (data.message === "Sai email hoặc mật khẩu!") {
              alert("Sai email hoặc mật khẩu!");
            } else if (data.message === "Đăng nhập thành công!") {
              alert("Đăng nhập thành công!");
              window.location.href = "/";
            }
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };

  //hàm xử lý việc reset mật khẩu cho người dùng
  const resetPass = () => {
    if (emailInput.current.value.trim().length === 0) {
      alert("Vui lòng nhập email của bạn để đặt lại mật khẩu!");
    } else {
      fetch(`${process.env.REACT_APP_BACKEND}/users/reset-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.current.value }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (
              data.message ===
              "Mật khẩu mới đã được gửi vào email của người dùng!"
            ) {
              alert("Mật khẩu mới đã được gửi vào email của người dùng!");
            } else if (data.message === "Email này chưa đăng ký!") {
              alert("Email này chưa đăng ký!");
            }
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //hàm xử lý việc đăng nhập bằng tài khoản gg
  const loginByGgAccount = useGoogleLogin({
    clientId: process.env.REACT_APP_CLIENT_ID,
    onSuccess: async (codeResponse) => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/users/login-google`,
        {
          headers: { tokengoogle: `${codeResponse.access_token}` },
        }
      );
      if (response.status === 200) {
        navigate("/");
      } else {
        navigate("/server-error");
      }
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
  });

  return (
    <div>
      {email === "" && (
        <div>
          <Container className="col-6 col-md-5 col-lg-4 col-xl-3 my-3">
            <div className="d-flex">
              <h4>Đăng nhập</h4>
              <img
                onClick={() => loginByGgAccount()}
                className="mx-2"
                style={{ width: "10%", cursor: "pointer" }}
                src={ggLogo}
                alt=""
              />
            </div>
            <Form>
              <Form.Control
                className="my-2"
                type="email"
                placeholder="Email"
                ref={emailInput}
              />
              <Form.Control
                className="my-2"
                type="password"
                placeholder="Mật khẩu"
                ref={passInput}
              />
              <div>
                <Button
                  onClick={submitForm}
                  className="border-0"
                  style={{ backgroundColor: "#f28076" }}
                >
                  Đăng nhập
                </Button>
                <Button
                  onClick={resetPass}
                  className="border-0"
                  style={{ color: "blue", backgroundColor: "#ffb6af" }}
                >
                  Quên mật khẩu
                </Button>
              </div>
            </Form>
          </Container>
          <Container className="col-6" style={{ textAlign: "center" }}>
            Bạn chưa có tài khoản? Nhấp vào <Link to="/sign-up">đây</Link> để
            đăng ký
          </Container>
        </div>
      )}
    </div>
  );
};

export default Login;
