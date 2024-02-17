import { Button, Container, Form, Table } from "react-bootstrap";
import {
  EnvelopePaperHeartFill,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";

const HomePage = () => {
  //state danh sách 8 đợt từ thiện
  const [donates, setDonates] = useState([]);
  //state danh sách từ thiện được hiển thị
  const [displayedDonates, setDisplayedDonates] = useState([]);
  //state số trang hiện tại
  const [page, setPage] = useState(1);
  //state số trang tối đa mà server có thể trả về
  const [totalPages, setTotalPages] = useState(0);
  //state bộ lọc
  const [filter, setFilter] = useState("Tất cả");
  //state từ khóa tìm kiếm
  const [keywords, setKeywords] = useState("");
  //state mảng checkbox
  const [isChecked, setIsChecked] = useState([]);
  //state role người dùng
  const [role, setRole] = useState("");

  //state checkbox chọn tất cả
  const [checkForAll, setCheckForAll] = useState(false);
  //state mảng chứa nhiều phần tử muốn xóa
  const [deleteMany, setDeleteMany] = useState([]);

  //hàm kiểm tra người dùng đã đăng nhập chưa
  const fetchIsLoggedIn = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "have not been logged in yet.") {
          setRole("");
        } else {
          setRole(data.role);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchIsLoggedIn(), []);

  const navigate = useNavigate();
  //hàm lấy danh sách 8 đợt từ thiện sắp đến thời hạn
  const fetchDonates = useCallback((page) => {
    fetch(`${process.env.REACT_APP_BACKEND}/donates/get-8-donates/${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          setDonates(data.result);
          setTotalPages(data.totalPages);
          setDisplayedDonates(data.result);
          setIsChecked(Array(data.result.length).fill(false));
          // console.log(data.result);
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchDonates(page), [page]);

  //hàm xử lý việc xóa một đợt quyên góp
  const deleteDonate = (id) => {
    const isDelete = window.confirm("Bạn có chắc muốn xóa đợt quyên góp này?");
    if (isDelete) {
      fetch(`http://localhost:5000/donates/delete/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.message === "Xóa thành công!") {
              alert("Xóa thành công!");
              const index = donates.findIndex((donate) => donate._id === id);
              donates.splice(index, 1);
              // console.log(donates);
              setDonates([...donates]);
            }
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //hàm xử lý việc tìm kiếm đợt quyên góp theo từ khóa
  const search = (keywords) => {
    fetch("http://localhost:5000/donates/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: keywords }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDisplayedDonates(data.result);
        if (data.result.length === 0) {
          alert("Không tìm thấy đợt quyên góp theo từ khóa đã cho.");
        }
      })
      .catch((err) => console.log(err));
  };

  //hàm xóa nhiều phần tử
  const deleteManyHandler = () => {
    const isDelete = window.confirm("Bạn có chắc muốn xóa đợt quyên góp này?");
    if (isDelete) {
      fetch("http://localhost:5000/donates/delete/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleteMany: deleteMany,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.message === "Xóa thành công!") {
              alert("Xóa thành công!");
              deleteMany.forEach((id) => {
                let index = donates.findIndex((donate) => donate._id === id);
                donates.splice(index, 1);
              });
              // console.log(donates);
              const newArr = [...donates];
              setDonates(newArr);
              setIsChecked(Array(newArr.length).fill(false));
            }
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container className="col-11 my-4">
      <div className="my-5" style={{ textAlign: "center" }}>
        <EnvelopePaperHeartFill size={80} style={{ color: "white" }} />
        <h4 className="my-2">Tìm kiếm chủ đề mà bạn quan tâm</h4>
        <Container
          className="col-9 col-sm-8 col-md-6 col-lg-4 col-xxl-3 p-2 d-flex justify-content-around rounded-5"
          style={{ backgroundColor: "white", border: "0.1rem solid #f28076" }}
        >
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="border-0"
            type="text"
            placeholder="Gây quỹ trao tặng"
          />
          <div
            onClick={() => {
              if (keywords.trim().length !== 0) {
                search(keywords);
              }
            }}
            className="rounded-5 px-2 py-1"
            style={{
              backgroundColor: "#f28076",
              color: "white",
              cursor: "pointer",
            }}
          >
            <span>
              <Search />
            </span>
            Tìm kiếm
          </div>
        </Container>
      </div>
      <div className="my-1 d-flex justify-content-between align-items-center">
        <div className="col-2 d-flex align-items-center">
          <Form.Select
            onChange={(e) => {
              setFilter(e.target.value);
              if (e.target.value === "Tất cả") {
                setDisplayedDonates(donates);
              } else if (e.target.value === "Vì trẻ em") {
                setDisplayedDonates(
                  donates.filter((item) => item.type === "Vì trẻ em")
                );
              } else if (e.target.value === "Người già, người khuyết tật") {
                setDisplayedDonates(
                  donates.filter(
                    (item) => item.type === "Người già, người khuyết tật"
                  )
                );
              } else if (e.target.value === "Bảo vệ môi trường") {
                setDisplayedDonates(
                  donates.filter((item) => item.type === "Bảo vệ môi trường")
                );
              }
            }}
          >
            <option value={filter}>{filter}</option>
            {[
              "Tất cả",
              "Vì trẻ em",
              "Người già, người khuyết tật",
              "Bảo vệ môi trường",
            ]
              .filter((item) => item !== filter)
              .sort((a, b) => a - b)
              .map((item) => (
                <option key={(Math.random() * 10).toString()} value={item}>
                  {item}
                </option>
              ))}
          </Form.Select>
          <div
            onClick={() => {
              setDisplayedDonates(donates);
              setCheckForAll(false);
              setIsChecked(Array(donates.length).fill(false));
              setKeywords("");
            }}
            className="px-2"
            style={{ cursor: "pointer" }}
          >
            <ArrowClockwise />
          </div>
        </div>
        {deleteMany.length > 0 && (
          <Button
            onClick={deleteManyHandler}
            className="border-0"
            style={{ backgroundColor: "red" }}
          >
            Xóa phần tử đã chọn
          </Button>
        )}
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {role === "admin" && (
              <th>
                <input
                  onChange={() => {
                    if (checkForAll) {
                      setIsChecked(Array(displayedDonates.length).fill(false));
                      setCheckForAll(false);
                      setDeleteMany([]);
                    } else {
                      setIsChecked(Array(displayedDonates.length).fill(true));
                      setCheckForAll(true);
                      setDeleteMany((prevState) => {
                        displayedDonates.forEach((donate) =>
                          prevState.push(donate._id)
                        );
                        return prevState;
                      });
                    }
                  }}
                  type="checkbox"
                  checked={checkForAll}
                />
              </th>
            )}
            <th className="col-1">#</th>
            <th>Tiêu đề</th>
            <th>Tiến độ</th>
            <th className="col-2">Số ngày còn lại</th>
            <th className="col-1">Chi tiết</th>
            {role === "admin" && <th className="col-2">Cập nhật</th>}
            {role === "admin" && <th className="col-1">Xóa</th>}
          </tr>
        </thead>
        <tbody>
          {displayedDonates.map((donate, i) => (
            <tr key={donate._id}>
              {role === "admin" && (
                <td>
                  <input
                    onClick={() => {
                      setIsChecked((prevState) => {
                        const newArr = [...prevState];
                        newArr[i] = !newArr[i];
                        return newArr;
                      });
                      if (deleteMany.includes(donate._id)) {
                        setDeleteMany((prevState) => {
                          const newArr = prevState.filter(
                            (item) => item !== donate._id
                          );
                          return newArr;
                        });
                      } else {
                        setDeleteMany((prevState) => {
                          const newArr = [...prevState];
                          newArr.push(donate._id);
                          return newArr;
                        });
                      }
                    }}
                    type="checkbox"
                    checked={isChecked[i]}
                  />
                </td>
              )}
              <td>{i + 1}</td>
              <td>{donate.title}</td>
              <td>
                {donate.currentAmount.toLocaleString("vi-VN")}/
                {donate.amount.toLocaleString("vi-VN")}
              </td>
              <td>
                {differenceInDays(donate.endDate, new Date()) + 1 > 0
                  ? differenceInDays(donate.endDate, new Date()) + 1
                  : "Đã hết thời hạn"}
              </td>
              <td>
                <Link to={`/detail/${donate._id}`}>Xem thêm</Link>
              </td>
              {role === "admin" && (
                <td>
                  <Button
                    onClick={() => navigate(`/update/${donate._id}`)}
                    className="border-0"
                    style={{ backgroundColor: "#4eb09b" }}
                  >
                    Cập nhật
                  </Button>
                </td>
              )}
              {role === "admin" && (
                <td>
                  <Button
                    onClick={() => deleteDonate(donate._id)}
                    className="border-0"
                    style={{ backgroundColor: "red" }}
                  >
                    Xóa
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              className="p-2"
              style={{ textAlign: "right" }}
              colSpan={role === "admin" ? 8 : 5}
            >
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
    </Container>
  );
};

export default HomePage;
