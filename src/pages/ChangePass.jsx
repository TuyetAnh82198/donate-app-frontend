import { Button, Container, Form } from "react-bootstrap";
import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChangePass = () => {
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const oldPassInput = useRef();
  const newPassInput = useRef();
  const confirmPassInput = useRef();

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
          navigate("/login");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchIsLoggedIn(), []);

  //hàm xử lý việc thay đổi mật khẩu
  const submitForm = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/change-pass`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPass: oldPassInput.current.value,
        newPass: newPassInput.current.value,
        confirmPass: confirmPassInput.current.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.errMsg) {
            alert(data.errMsg);
          } else if (data.message === "Cập nhật thành công!") {
            alert("Cập nhật thành công!");
            navigate("/");
          }
        } else {
          navigate("/server-error");
        }
      });
  };
  return (
    <div>
      {isLoggedIn && (
        <Container className="col-4">
          <h4>Thay đổi mật khẩu</h4>
          <Form>
            <Form.Control
              type="password"
              placeholder="Hãy nhập mật khẩu cũ của bạn"
              ref={oldPassInput}
            />
            <Form.Control
              className="my-2"
              type="password"
              placeholder="Hãy nhập mật khẩu mới của bạn"
              ref={newPassInput}
            />
            <Form.Control
              type="password"
              placeholder="Hãy xác nhận mật khẩu mới của bạn"
              ref={confirmPassInput}
            />
            <Button
              onClick={submitForm}
              className="my-2 border-0"
              style={{ backgroundColor: "#f28076" }}
            >
              Thay đổi mật khẩu
            </Button>
          </Form>
        </Container>
      )}
    </div>
  );
};

export default ChangePass;
