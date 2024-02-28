import { Button, Container, Form, Table } from "react-bootstrap";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  //state danh sách người dùng
  const [users, setUsers] = useState([]);
  //state danh sách người dùng được hiển thị
  const [displayedUsers, setDisplayedUsers] = useState([]);
  //state số trang hiện tại
  const [page, setPage] = useState(1);
  //state số trang tối đa mà server có thể trả về
  const [totalPages, setTotalPages] = useState(0);
  //state bộ lọc
  const [filter, setFilter] = useState("Tất cả vai trò");
  //state từ khóa tìm kiếm
  const [keywords, setKeywords] = useState("");
  // //state mảng checkbox
  // const [isChecked, setIsChecked] = useState([]);
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //   //state checkbox chọn tất cả
  //   const [checkForAll, setCheckForAll] = useState(false);
  //   //state mảng chứa nhiều phần tử muốn xóa
  //   const [deleteMany, setDeleteMany] = useState([]);

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

  //hàm lấy danh sách người dùng
  const fetchUsers = useCallback((page) => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/get/${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          setUsers(data.result);
          setTotalPages(data.totalPages);
          setDisplayedUsers(data.result);
          //   setIsChecked(Array(data.result.length).fill(false));
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchUsers(page), [page]);

  //hàm xử lý việc xóa một người dùng
  const deleteUser = (id) => {
    const isDelete = window.confirm("Bạn có chắc muốn xóa người dùng này?");
    if (isDelete) {
      fetch(`http://localhost:5000/users/delete/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.message === "Xóa thành công!") {
              alert("Xóa thành công!");
              const index = users.findIndex((user) => user._id === id);
              users.splice(index, 1);
              // console.log(donates);
              setUsers([...users]);
            } else if (data.message === "Không thể xóa người dùng là admin!") {
              alert("Không thể xóa người dùng là admin!");
            } else if (data.message === "Xóa không thành công!") {
              alert("Xóa không thành công!");
            }
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //hàm xử lý việc reset mật khẩu cho người dùng
  const resetPass = (email) => {
    const isReset = window.confirm(
      "Bạn có chắc muốn đặt lại mật khẩu cho người dùng này?"
    );
    if (isReset) {
      fetch(`${process.env.REACT_APP_BACKEND}/users/reset-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
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

  //hàm xử lý việc tìm kiếm người dùng theo từ khóa
  const search = (keywords) => {
    fetch("http://localhost:5000/users/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: keywords }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDisplayedUsers(data.result);
        if (data.result.length === 0) {
          alert("Không tìm thấy người dùng theo từ khóa đã cho.");
        }
      })
      .catch((err) => console.log(err));
  };

  //   //hàm xóa nhiều phần tử
  //   const deleteManyHandler = () => {
  //     const isDelete = window.confirm("Bạn có chắc muốn xóa đợt quyên góp này?");
  //     if (isDelete) {
  //       fetch("http://localhost:5000/donates/delete/", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           deleteMany: deleteMany,
  //         }),
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           if (!data.err) {
  //             if (data.message === "Xóa thành công!") {
  //               alert("Xóa thành công!");
  //               deleteMany.forEach((id) => {
  //                 let index = donates.findIndex((donate) => donate._id === id);
  //                 donates.splice(index, 1);
  //               });
  //               // console.log(donates);
  //               const newArr = [...donates];
  //               setDonates(newArr);
  //               setIsChecked(Array(newArr.length).fill(false));
  //             }
  //           } else {
  //             navigate("/server-error");
  //           }
  //         })
  //         .catch((err) => console.log(err));
  //     }
  //   };

  //hàm cập nhật role của người dùng từ client lên admin
  const updateRoleToAdmin = (id) => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/update-role-to-admin/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          alert("Cập nhật thành công!");
          setUsers(data.result);
          setDisplayedUsers(data.result);
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="col-11 my-4">
      {isLoggedIn && (
        <div>
          <div className="my-5" style={{ textAlign: "center" }}>
            <h4 className="my-2">Tìm kiếm người dùng</h4>
            <Container
              className="col-9 col-sm-8 col-md-6 col-lg-4 col-xxl-3 p-2 d-flex justify-content-around rounded-5"
              style={{
                backgroundColor: "white",
                border: "0.1rem solid #f28076",
              }}
            >
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="border-0"
                type="text"
                placeholder="Nhập từ khóa"
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
                  if (e.target.value === "Tất cả vai trò") {
                    setDisplayedUsers(users);
                  } else if (e.target.value === "Client") {
                    setDisplayedUsers(
                      users.filter((user) => user.role === "client")
                    );
                  } else if (e.target.value === "Admin") {
                    setDisplayedUsers(
                      users.filter((user) => user.role === "admin")
                    );
                  }
                }}
              >
                <option value={filter}>{filter}</option>
                {["Tất cả vai trò", "Client", "Admin"]
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
                  setDisplayedUsers(users);
                  //   setCheckForAll(false);
                  //   setIsChecked(Array(users.length).fill(false));
                  setKeywords("");
                }}
                className="px-2"
                style={{ cursor: "pointer" }}
              >
                <ArrowClockwise />
              </div>
            </div>
            {/* {deleteMany.length > 0 && (
          <Button
            onClick={deleteManyHandler}
            className="border-0"
            style={{ backgroundColor: "red" }}
          >
            Xóa phần tử đã chọn
          </Button>
        )} */}
          </div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {/* <th>
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
            </th> */}
                <th className="col-1">#</th>
                <th>Email</th>
                <th className="col-2">Vai trò</th>
                <th className="col-2">Reset mật khẩu</th>
                <th className="col-1">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user, i) => (
                <tr key={user._id}>
                  {/* <td>
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
              </td> */}
                  <td>{i + 1}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      style={{ color: user.role === "admin" ? "red" : "black" }}
                    >
                      {user.role}{" "}
                    </span>
                    {user.role === "client" && (
                      <span
                        onClick={() => updateRoleToAdmin(user._id)}
                        className="rounded-2 px-1 my-5"
                        style={{
                          backgroundColor: "#fbc193",
                          cursor: "pointer",
                        }}
                      >
                        Làm admin
                      </span>
                    )}
                  </td>

                  <td>
                    <Button
                      onClick={() => resetPass(user.email)}
                      className="border-0"
                      style={{ backgroundColor: "#4eb09b" }}
                    >
                      Reset
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => deleteUser(user._id)}
                      className="border-0"
                      style={{ backgroundColor: "red" }}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-2" style={{ textAlign: "right" }} colSpan={5}>
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

export default Users;
