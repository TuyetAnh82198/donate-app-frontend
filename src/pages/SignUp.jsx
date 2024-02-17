import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useEffect } from "react";

const SignUp = () => {
  //state email người dùng để kiểm tra người dùng đã đăng nhập chưa
  const [email, setEmail] = useState("");

  const emailInput = useRef();

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

  //hàm xử lý việc đăng ký
  const submitForm = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.current.value,
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
            } else if (
              data.message ===
              "Email này đã đăng ký, vui lòng nhập một email khác"
            ) {
              alert("Email này đã đăng ký, vui lòng nhập một email khác");
            } else if (data.message === "Đăng ký thành công!") {
              alert(
                "Đăng ký thành công, mật khẩu đăng nhập đã được gửi vào email của bạn!"
              );
              navigate("/login");
            }
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Container className="col-6 col-md-5 col-lg-4 col-xl-3 my-3">
        <h4>Đăng ký</h4>
        <Form>
          <Form.Control
            className="my-2"
            type="email"
            placeholder="Email"
            ref={emailInput}
          />
          {/* <Form.Control
            className="my-2"
            type="password"
            placeholder="Mật khẩu"
            ref={passInput}
          /> */}
          <Button
            onClick={submitForm}
            className="border-0"
            style={{ backgroundColor: "#f28076" }}
          >
            Đăng ký
          </Button>
        </Form>
      </Container>
      <Container className="col-6" style={{ textAlign: "center" }}>
        Bạn đã có tài khoản? Nhấp vào <Link to="/login">đây</Link> để đăng nhập
      </Container>
    </div>
  );
};

export default SignUp;
