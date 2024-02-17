import { useState, useCallback, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  List,
  Box2Heart,
  PatchPlus,
  ArrowRightSquare,
  ArrowLeftSquare,
  PersonFill,
  PersonVcardFill,
  KeyFill,
} from "react-bootstrap-icons";
import { Button, Container } from "react-bootstrap";

import styles from "./rootlayout.module.css";

const RootLayout = () => {
  //state chiều dài co giãn của menu
  const [isToggle, setIsToggle] = useState(false);
  //state email người dùng
  const [email, setEmail] = useState("");
  //state role người dùng
  const [role, setRole] = useState("");

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
          setRole("");
        } else {
          setEmail(data.email);
          setRole(data.role);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchIsLoggedIn(), []);

  //hàm xử lý việc đăng xuất
  const logoutHandler = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Đăng xuất thành công!") {
          alert("Đăng xuất thành công!");
          window.location.href = "/login";
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="d-flex"
      style={{ backgroundColor: "#ffb6af", minHeight: "100vh" }}
    >
      {!isToggle && (
        <div
          className="d-flex flex-column align-items-center"
          style={{
            backgroundColor: "#f28076",
            width: "4rem",
          }}
        >
          <div className={styles.menuItems}>
            <ArrowRightSquare
              onClick={() => setIsToggle(!isToggle)}
              className={styles.icons}
            />
          </div>
          <NavLink
            to="/"
            className={styles.menuItems}
            style={({ isActive }) =>
              isActive ? { color: "#ffd700" } : { color: "white" }
            }
          >
            <List className={styles.icons} />
          </NavLink>{" "}
          <NavLink
            to="/history"
            className={styles.menuItems}
            style={({ isActive }) =>
              isActive ? { color: "#ffd700" } : { color: "white" }
            }
          >
            <Box2Heart className={styles.icons} />
          </NavLink>
          {role === "admin" && (
            <NavLink
              to="/users"
              className={styles.menuItems}
              style={({ isActive }) =>
                isActive ? { color: "#ffd700" } : { color: "white" }
              }
            >
              <PersonVcardFill className={styles.icons} />
            </NavLink>
          )}
          {role === "admin" && (
            <NavLink
              to="/add"
              className={styles.menuItems}
              style={({ isActive }) =>
                isActive ? { color: "#ffd700" } : { color: "white" }
              }
            >
              <PatchPlus className={styles.icons} />
            </NavLink>
          )}
          {email !== "" && (
            <NavLink
              to="/change-pass"
              className={`d-flex ${styles.menuItems}`}
              style={({ isActive }) =>
                isActive ? { color: "#ffd700" } : { color: "white" }
              }
            >
              <KeyFill className={styles.icons} />
            </NavLink>
          )}
        </div>
      )}
      {isToggle && (
        <div
          className="d-flex flex-column px-3"
          style={{
            backgroundColor: "#f28076",
          }}
        >
          <div className={styles.menuItems}>
            <ArrowLeftSquare
              onClick={() => setIsToggle(!isToggle)}
              className={styles.icons}
            />
          </div>
          <NavLink
            to="/"
            className={`d-flex ${styles.menuItems}`}
            style={({ isActive }) =>
              isActive ? { color: "#ffd700" } : { color: "white" }
            }
          >
            <List className={styles.icons} />
            <p className={styles.iconContent}>Trang chủ</p>
          </NavLink>
          <NavLink
            to="/history"
            className={`d-flex ${styles.menuItems}`}
            style={({ isActive }) =>
              isActive ? { color: "#ffd700" } : { color: "white" }
            }
          >
            <Box2Heart className={styles.icons} />
            <p className={styles.iconContent}>Lịch sử quyên góp</p>
          </NavLink>
          {role === "admin" && (
            <NavLink
              to="/users"
              className={`d-flex ${styles.menuItems}`}
              style={({ isActive }) =>
                isActive ? { color: "#ffd700" } : { color: "white" }
              }
            >
              <PersonVcardFill className={styles.icons} />
              <p className={styles.iconContent}>Danh sách người dùng</p>
            </NavLink>
          )}
          {role === "admin" && (
            <NavLink
              to="/add"
              className={`d-flex ${styles.menuItems}`}
              style={({ isActive }) =>
                isActive ? { color: "#ffd700" } : { color: "white" }
              }
            >
              <PatchPlus className={styles.icons} />
              <p className={styles.iconContent}>Thêm đợt từ thiện</p>
            </NavLink>
          )}
          {email !== "" && (
            <NavLink
              to="/change-pass"
              className={`d-flex ${styles.menuItems}`}
              style={({ isActive }) =>
                isActive ? { color: "#ffd700" } : { color: "white" }
              }
            >
              <KeyFill className={styles.icons} />
              <p className={styles.iconContent}>Thay đổi mật khẩu</p>
            </NavLink>
          )}
        </div>
      )}
      <div className="w-100">
        <Container className="col-11 d-flex justify-content-between my-3">
          <h4>HỆ THỐNG QUYÊN GÓP TỪ THIỆN</h4>
          <div className="d-flex align-items-center">
            {email === "" ? (
              <Button
                onClick={() => navigate("/sign-up")}
                className="mx-2 border-0"
                style={{ backgroundColor: "#f28076" }}
              >
                Đăng ký
              </Button>
            ) : (
              <div className="mx-2">
                <PersonFill />
                {email}
              </div>
            )}
            <Button
              onClick={
                email === ""
                  ? () => {
                      navigate("/login");
                    }
                  : logoutHandler
              }
              className="border-0"
              style={{ backgroundColor: "#f28076" }}
            >
              {email === "" ? "Đăng nhập" : "Đăng xuất"}
            </Button>
          </div>
        </Container>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
