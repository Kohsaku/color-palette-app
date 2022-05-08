import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "../features/userSlice";
import { auth } from "../firebase";
import {
  Paper,
  IconButton,
  Modal,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const MenuStyle = {
  top: "10%",
  left: "12%",
};

const PaperStyle = {
  position: "absolute" as "absolute",
  top: "15%",
  left: "12%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 5,
};

const Menu = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const getAuthentication = () => {
    const user = auth.currentUser;
    user ? dispatch(login(true)) : dispatch(logout(false));
  };

  useEffect(() => {
    getAuthentication();
  }, []);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const handleLogout = () => {
    auth.signOut();
  };
  return (
    <div>
      <IconButton sx={MenuStyle} onClick={handleOpenModal}>
        <MenuIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={PaperStyle} flex-direction="culumn">
          {location.pathname === "/" ? (
            <List>
              {user.isLogin ? (
                <>
                  <ListItem button onClick={handleLogout}>
                    <Link to="/login">
                      <Typography>ログアウト</Typography>
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link to="/collection">
                      <Typography>保存一覧</Typography>
                    </Link>
                  </ListItem>
                </>
              ) : (
                <ListItem button>
                  <Link to="/login">
                    <Typography>ログイン</Typography>
                  </Link>
                </ListItem>
              )}
            </List>
          ) : (
            <List>
              <ListItem button>
                <Link to="/login">
                  <Typography>ログアウト</Typography>
                </Link>
              </ListItem>
              <ListItem button>
                <Link to="/">
                  <Typography>ホーム</Typography>
                </Link>
              </ListItem>
            </List>
          )}
        </Paper>
      </Modal>
    </div>
  );
};

export default Menu;
