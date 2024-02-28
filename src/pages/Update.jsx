import { format } from "date-fns";
import { Fragment, useState, useRef, useCallback, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Calendar } from "react-date-range";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
  //state ẩn, hiện bảng chọn ngày tháng
  const [hideCalendar, setHideCalendar] = useState(true);
  //state thông tin của đợt quyên góp muốn cập nhật
  const [donate, setDonate] = useState({});
  //state đăng nhập của người dùng
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state ảnh input
  const [image, setImage] = useState("");

  const imgInput = useRef();

  const navigate = useNavigate();
  const params = useParams();

  //hàm lấy thông tin của đợt quyên góp muốn cập nhật để hiển thị lên giao diện
  const fetchDetail = useCallback((id) => {
    fetch(`${process.env.REACT_APP_BACKEND}/donates/detail/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.message === "found no") {
            navigate("/");
          } else if (data.message === "have not been logged in yet") {
            navigate("/login");
            setIsLoggedIn(false);
          } else {
            setIsLoggedIn(true);
            setDonate({
              ...data.result,
              amount: data.result.amount.toString(),
            });
            setImage(`http://localhost:5000/${data.result.img}`);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchDetail(params.id), []);

  //hàm submit form
  const submitForm = (e) => {
    e.preventDefault();
    const amountWithoutPunctuation = Number(donate.amount.match(/\d+/g));
    // console.log(amountWithoutPunctuation);
    if (
      donate.title.trim().length === 0 ||
      donate.desc.trim().length === 0 ||
      donate.amount.trim().length === 0
    ) {
      alert("Các trường không thể để trống");
    } else if (amountWithoutPunctuation < 1000000) {
      alert("Số tiền không thể nhỏ hơn 1.000.000");
    } else if (donate.type === "Chọn hoàn cảnh quyên góp") {
      alert("Vui lòng chọn Hoàn cảnh quyên góp");
    } else if (!imgInput.current.files[0] && image === "") {
      alert("Vui lòng chọn ảnh cho bài đăng");
    } else {
      const formData = new FormData();
      formData.append("title", donate.title);
      formData.append("desc", donate.desc);
      formData.append("amount", amountWithoutPunctuation);
      formData.append("endDate", donate.endDate);
      formData.append("type", donate.type);
      formData.append(
        "img",
        imgInput.current.files[0]
          ? imgInput.current.files[0]
          : image.split("/")[3]
      );

      for (const entry of formData.entries()) {
        // console.log(entry);
      }
      fetch(`${process.env.REACT_APP_BACKEND}/donates/update/${params.id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.err) {
            navigate("/server-error");
          } else if (data.message === "Cập nhật thành công!") {
            alert("Cập nhật thành công!");
            navigate("/");
          } else if (data.message === "have not been logged in yet") {
            navigate("/login");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  //hàm xử lý việc reset
  const resetHandler = () => {
    setDonate({
      ...donate,
      title: "",
      desc: "",
      amount: "",
      endDate: new Date(),
      type: "Chọn hoàn cảnh quyên góp",
    });
  };

  return (
    <Fragment>
      {isLoggedIn && (
        <Container
          className="shadow my-5 col-6 p-3"
          style={{ backgroundColor: "white", zIndex: "5" }}
        >
          <h4>Cập nhật một đợt quyên góp mới</h4>
          <Form onSubmit={submitForm} encType="multipart/form-data">
            <Form.Group className="my-3">
              <Form.Label htmlFor="title">Tiêu đề</Form.Label>
              <Form.Control
                value={donate.title}
                id="title"
                type="text"
                placeholder="Hỗ trợ chi phí phẫu thuật tim cho 5 em nhỏ khó khăn"
                name="title"
                onChange={(e) =>
                  setDonate((prevState) => {
                    return { ...prevState, title: e.target.value };
                  })
                }
              />
            </Form.Group>
            <Form.Group className="d-flex justify-content-between">
              <div className="col-5">
                <Form.Label htmlFor="desc">Mô tả</Form.Label>
                <Form.Control
                  value={donate.desc}
                  id="desc"
                  as="textarea"
                  rows={6}
                  placeholder="Chung tay mang đến cơ hội chữa lành trái tim để giúp các em nhỏ được sống một cuộc đời đáng sống"
                  onChange={(e) =>
                    setDonate((prevState) => {
                      return { ...prevState, desc: e.target.value };
                    })
                  }
                />
              </div>
              <div className="col-6">
                <Form.Label htmlFor="img">Hình ảnh</Form.Label>
                <div>
                  <div>
                    <img
                      style={{ width: "50%", marginBottom: "0.6rem" }}
                      src={image}
                      alt=""
                    />
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    (Để trống nếu không muốn chọn ảnh mới)
                  </div>
                  <div>
                    <Form.Control
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setImage(event.target.result);
                        };
                        if (file) {
                          reader.readAsDataURL(file);
                        }
                      }}
                      id="img"
                      type="file"
                      name="img"
                      ref={imgInput}
                    />
                  </div>
                </div>
              </div>
            </Form.Group>
            <Form.Group className="my-3 d-flex justify-content-between">
              <div className="col-5">
                <Form.Label htmlFor="amount">Số tiền kêu gọi</Form.Label>
                <Form.Control
                  value={donate.amount}
                  id="amount"
                  type="number"
                  min="1"
                  placeholder="182500000"
                  onChange={(e) =>
                    setDonate((prevState) => {
                      return { ...prevState, amount: e.target.value };
                    })
                  }
                />
              </div>
              <div className="col-6">
                <Form.Label>Ngày kết thúc đợt quyên góp</Form.Label>
                <Form.Control
                  onClick={() => setHideCalendar(!hideCalendar)}
                  value={format(new Date(donate.endDate), "dd/MM/yyyy")}
                />
                {!hideCalendar && (
                  <div
                    className="position-fixed"
                    style={{ bottom: "2rem", zIndex: "3rem" }}
                  >
                    <Calendar
                      minDate={new Date()}
                      date={donate.endDate}
                      onChange={(date) => {
                        setDonate((prevState) => {
                          return { ...prevState, endDate: date };
                        });
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
                  setDonate((prevState) => {
                    return { ...prevState, type: e.target.value };
                  });
                  // console.log(e.target.value);
                }}
              >
                <option value={donate.type}>{donate.type}</option>
                {[
                  "Vì trẻ em",
                  "Người già, người khuyết tật",
                  "Bảo vệ môi trường",
                ]
                  .filter((item) => item !== donate.type)
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
                Cập nhật
              </Button>
            </Form.Group>
          </Form>
        </Container>
      )}
    </Fragment>
  );
};

export default Update;
