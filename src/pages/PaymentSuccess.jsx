import { useCallback, useEffect } from "react";
import { Container } from "react-bootstrap";

const PaymentSuccess = () => {
  //hàm cập nhật trạng thái và ngày tháng quyên góp thành công
  const updatePaymentStatus = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/donates/check-payment`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => updatePaymentStatus(), []);
  return (
    <Container>
      <h3>Cảm ơn bạn đã quyên góp!</h3>
    </Container>
  );
};

export default PaymentSuccess;
