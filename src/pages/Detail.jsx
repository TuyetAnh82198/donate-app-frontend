import { differenceInDays } from "date-fns";
import { useCallback, useEffect, useState, useRef } from "react";
import { Button, Form, ProgressBar } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const Detail = () => {
  //state thông tin chi tiết của đợt quyên góp
  const [donate, setDonate] = useState({});
  //state ẩn, hiện form thông tin quyên góp
  const [hideForm, setHideForm] = useState(true);

  const amountInput = useRef();
  const noteInput = useRef();

  const navigate = useNavigate();
  const params = useParams();

  //hàm lấy thông tin chi tiết của đợt quyên góp
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
          } else if (data.result) {
            setDonate(data.result);
            // console.log(data.result);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchDetail(params.id), []);

  //hàm xử lý việc quyên góp
  const donateHandler = async () => {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND}/donates/pay/${donate._id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInput.current.value,
          note: noteInput.current.value,
        }),
      }
    );
    const data = await response.json();
    console.log(amountInput.current.value, data);
    if (data.message === "have not been logged in yet") {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
    } else {
      const result = stripe.redirectToCheckout({
        sessionId: data.id,
      });
      console.log(result.error);
    }
  };

  return (
    <div className="p-4">
      {donate.title && (
        <div className="d-flex">
          <div className="col-6 col-md-7">
            <img
              className="w-100"
              src={`${process.env.REACT_APP_BACKEND}/${donate.img}`}
              alt=""
            />
            <h4 className="my-2">{donate.title}</h4>
            <p style={{ fontSize: "1.2rem" }}>{donate.desc}</p>
          </div>
          <div className="col-6 col-md-5" style={{ paddingLeft: "1rem" }}>
            <h4 style={{ color: "#f28076" }}>THÔNG TIN QUYÊN GÓP</h4>
            <p style={{ color: "gray" }}>
              <span
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {donate.currentAmount.toLocaleString("vi-VN")}đ
              </span>{" "}
              / {donate.amount.toLocaleString("vi-VN")}đ
            </p>
            <ProgressBar
              striped
              now={((donate.currentAmount / donate.amount) * 100).toFixed(1)}
              variant="success"
            />
            <div className="d-flex justify-content-between my-2">
              <div>
                <p className="my-1" style={{ color: "gray" }}>
                  Lượt quyên góp
                </p>
                <h5>{donate.count}</h5>
              </div>
              <div>
                <p className="my-1" style={{ color: "gray" }}>
                  Đạt được
                </p>
                <h5>
                  {((donate.currentAmount / donate.amount) * 100).toFixed(1)}%
                </h5>
              </div>
              <div>
                <p className="my-1" style={{ color: "gray" }}>
                  Thời hạn còn
                </p>
                <h5>
                  {differenceInDays(donate.endDate, new Date()) > 0
                    ? differenceInDays(donate.endDate, new Date()) + 1
                    : "Đã hết thời hạn"}
                </h5>
              </div>
            </div>
            <Button
              onClick={() => setHideForm(!hideForm)}
              className="w-100 border-0 py-2"
              style={{ backgroundColor: "#f28076" }}
            >
              Quyên góp
            </Button>
            {!hideForm && (
              <Form className="my-5">
                <h5>Thông tin quyên góp</h5>
                <div className="d-flex justify-content-between">
                  <Form.Group>
                    <Form.Label htmlFor="amount">
                      Số tiền muốn quyên góp (x1000)
                    </Form.Label>
                    <Form.Control
                      id="amount"
                      type="number"
                      min="1"
                      placeholder="1000000"
                      ref={amountInput}
                    />
                    <Button onClick={donateHandler} className="my-2">
                      Click để quyên góp
                    </Button>
                  </Form.Group>
                  <Form.Group className="col-6">
                    <Form.Label htmlFor="note">
                      Ghi chú {"("}nếu có{")"}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      id="note"
                      rows={3}
                      ref={noteInput}
                    />
                  </Form.Group>
                </div>
              </Form>
            )}{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
