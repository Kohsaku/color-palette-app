import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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

const style = {
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
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();

  const getAuthentication = () => {
    const user = auth.currentUser;
    user ? setIsLogin(true) : setIsLogin(false);
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
      <IconButton onClick={handleOpenModal}>
        <MenuIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style} flex-direction="culumn">
          {location.pathname === "/" ? (
            <List>
              {isLogin ? (
                <ListItem button onClick={handleLogout}>
                  <Link to="/login">
                    <Typography>ログアウト</Typography>
                  </Link>
                </ListItem>
              ) : (
                <ListItem button>
                  <Link to="/login">
                    <Typography>ログイン</Typography>
                  </Link>
                </ListItem>
              )}
              <ListItem button>
                <Link to="/collection">
                  <Typography>保存一覧</Typography>
                </Link>
              </ListItem>
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
