import { format } from "date-fns";
import { Fragment, useState, useRef, useCallback, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Calendar } from "react-date-range";
import { useNavigate } from "react-router-dom";

const Add = () => {
  //state ngày tháng người dùng đã chọn
  const [date, setDate] = useState(new Date());
  //state ẩn, hiện bảng chọn ngày tháng
  const [hideCalendar, setHideCalendar] = useState(true);
  //state hoàn cảnh quyên góp
  const [type, setType] = useState("Chọn hoàn cảnh quyên góp");
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const titleInput = useRef();
  const descInput = useRef();
  const amountInput = useRef();
  const imgInput = useRef();

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

  //hàm submit form
  const submitForm = (e) => {
    e.preventDefault();
    const amountWithoutPunctuation = Number(
      amountInput.current.value.match(/\d+/g)
    );
    // console.log(amountWithoutPunctuation);
    if (
      titleInput.current.value.trim().length === 0 ||
      descInput.current.value.trim().length === 0 ||
      amountInput.current.value.trim().length === 0
    ) {
      alert("Các trường không thể để trống");
    } else if (amountWithoutPunctuation <= 0) {
      alert("Số tiền phải lớn hơn 0");
    } else if (type === "Chọn hoàn cảnh quyên góp") {
      alert("Vui lòng chọn Hoàn cảnh quyên góp");
    } else if (!imgInput.current.files[0]) {
      alert("Vui lòng chọn ảnh cho bài đăng");
    } else {
      const formData = new FormData();
      formData.append("title", titleInput.current.value);
      formData.append("desc", descInput.current.value);
      formData.append("amount", amountWithoutPunctuation);
      formData.append("endDate", date);
      formData.append("type", type);
      formData.append("img", imgInput.current.files[0]);
      fetch(`${process.env.REACT_APP_BACKEND}/donates/add`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.err) {
            navigate("/server-error");
          } else if (data.message === "Đã thêm!") {
            alert("Đã thêm!");
            navigate("/");
          } else if (data.message === "Ảnh không hợp lệ!") {
            alert("Ảnh không hợp lệ!");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  //hàm xử lý việc reset
  const resetHandler = () => {
    titleInput.current.value = "";
    descInput.current.value = "";
    amountInput.current.value = "";
    setDate(new Date());
    setType("Chọn hoàn cảnh quyên góp");
  };

  return (
    <Fragment>
      {isLoggedIn && (
        <Container
          className="shadow my-5 col-6 p-3"
          style={{ backgroundColor: "white", zIndex: "5" }}
        >
          <h4>Thêm một đợt quyên góp mới</h4>
          <Form onSubmit={submitForm} encType="multipart/form-data">
            <Form.Group className="my-3">
              <Form.Label htmlFor="title">Tiêu đề</Form.Label>
              <Form.Control
                id="title"
                type="text"
                placeholder="Hỗ trợ chi phí phẫu thuật tim cho 5 em nhỏ khó khăn"
                ref={titleInput}
              />
            </Form.Group>
            <Form.Group className="d-flex justify-content-between">
              <div className="col-5">
                <Form.Label htmlFor="desc">Mô tả</Form.Label>
                <Form.Control
                  id="desc"
                  as="textarea"
                  rows={4}
                  placeholder="Chung tay mang đến cơ hội chữa lành trái tim để giúp các em nhỏ được sống một cuộc đời đáng sống"
                  ref={descInput}
                />
              </div>
              <div className="col-6">
                <Form.Label htmlFor="img">Hình ảnh</Form.Label>
                <Form.Control id="img" type="file" name="img" ref={imgInput} />
              </div>
            </Form.Group>
            <Form.Group className="my-3 d-flex justify-content-between">
              <div className="col-5">
                <Form.Label htmlFor="amount">Số tiền kêu gọi</Form.Label>
                <Form.Control
                  id="amount"
                  type="number"
                  min="1"
                  placeholder="182500000"
                  ref={amountInput}
                />
              </div>
              <div className="col-6">
                <Form.Label>Ngày kết thúc đợt quyên góp</Form.Label>
                <Form.Control
                  onClick={() => setHideCalendar(!hideCalendar)}
                  value={format(date, "dd/MM/yyyy")}
                />
                {!hideCalendar && (
                  <div
                    className="position-fixed"
                    style={{ bottom: "2rem", zIndex: "3rem" }}
                  >
                    <Calendar
                      minDate={new Date()}
                      date={date}
                      onChange={(date) => {
                        setDate(date);
                        setHideCalendar(true);
                      }}
                      color="#ffb6af"
                    />
                  </div>
                )}
              </div>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Select
                onChange={(e) => {
                  setType(e.target.value);
                  console.log(e.target.value);
                }}
              >
                <option value={type}>{type}</option>
                {[
                  "Vì trẻ em",
                  "Người già, người khuyết tật",
                  "Bảo vệ môi trường",
                ]
                  .filter((item) => item !== type)
                  .sort((a, b) => a - b)
                  .map((item) => (
                    <option key={(Math.random() * 10).toString()} value={item}>
                      {item}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group style={{ textAlign: "right" }}>
              <Button
                onClick={resetHandler}
                className="border-0 mx-2"
                style={{ backgroundColor: "#4eb09b", fontWeight: "bold" }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="border-0"
                style={{ backgroundColor: "#ffb6af", fontWeight: "bold" }}
              >
                Thêm
              </Button>
            </Form.Group>
          </Form>
        </Container>
      )}
    </Fragment>
  );
};

export default Add;
