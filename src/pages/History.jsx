import { Button, Container, Form, Table } from "react-bootstrap";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const History = () => {
  //state danh sách lịch sử quyên góp
  const [donates, setDonates] = useState([]);
  //state số trang hiện tại
  const [page, setPage] = useState(1);
  //state số trang tối đa mà server có thể trả về
  const [totalPages, setTotalPages] = useState(0);
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  //hàm lấy danh sách lịch sử quyên góp
  const fetchDonates = useCallback((page) => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/get-history/${page}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.message === "have not been logged in yet") {
            navigate("/login");
            setIsLoggedIn(false);
          } else {
            setIsLoggedIn(true);
            setDonates(data.result);
            setTotalPages(data.totalPages);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchDonates(page), [page]);

  return (
    <Container className="col-11 my-4">
      {isLoggedIn && (
        <div>
          <h4>Lịch sử quyên góp</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="col-1">#</th>
                <th className="col-1">Id</th>
                <th>Tên đợt quyên góp</th>
                <th className="col-2">Số tiền</th>
                <th className="col-1">Trạng thái</th>
                <th className="col-2">Đã quyên góp vào ngày</th>
                <th className="col-2">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {donates.map((donate, i) => (
                <tr key={donate._id}>
                  <td>{i + 1}</td>
                  <td>{donate._id}</td>
                  <td>{donate.donate.title}</td>
                  <td>
                    {(Number(donate.amount) * 1000).toLocaleString("vi-VN")}
                  </td>
                  <td>{donate.status}</td>
                  <td>
                    {donate.date ? format(donate.date, "dd/MM/yyyy") : ""}
                  </td>
                  <td>{donate.note}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-2" style={{ textAlign: "right" }} colSpan={7}>
                  {`${page} out of ${totalPages} ${
                    totalPages === 1 ? "page" : "pages"
                  }`}{" "}
                  <ChevronLeft
                    onClick={() => {
                      if (page > 1) {
                        setPage((prevState) => prevState - 1);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <span className="mx-2">{page}</span>
                  <ChevronRight
                    onClick={() => {
                      if (page < totalPages) {
                        setPage((prevState) => prevState + 1);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default History;
