import { Button, Container, Form } from "react-bootstrap";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const codePassInput = useRef();
  const newPassInput = useRef();
  const confirmPassInput = useRef();

  const navigate = useNavigate();
  //hàm xử lý việc thay đổi mật khẩu
  const submitForm = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/change-my-pass`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: codePassInput.current.value,
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
          } else if (
            data.message === "Mã code đã nhập không đúng hoặc đã hết hạn!"
          ) {
            alert("Mã code đã nhập không đúng hoặc đã hết hạn!");
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container className="col-4">
      <h4>Thay đổi mật khẩu</h4>
      <Form>
        <Form.Control
          type="text"
          placeholder="Hãy nhập mã code của bạn"
          ref={codePassInput}
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
  );
};

export default ForgotPass;
