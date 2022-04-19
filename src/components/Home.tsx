import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  SxProps,
  Theme,
  createTheme,
  Button,
  ButtonBase,
  TextField,
  IconButton,
  Modal,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@mui/styles";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// ↓スタイルや型定義に関する記述--------
const theme = createTheme();
const useStyles = makeStyles((theme) => ({
  box: {
    paddingTop: "2vh",
  },
  container: {
    paddingLeft: "50vh",
    backgroundColor: "white",
    width: "50vw",
  },
}));

interface ITEM {
  children: React.ReactNode;
  sx?: SxProps;
  background: string;
  fontColor: () => string;
}

const Item = ({ sx, children, background, fontColor }: ITEM) => (
  <Paper
    square={true}
    sx={{
      color: fontColor,
      backgroundColor: background,
      paddingTop: (theme: Theme) => theme.spacing(13),
      height: (theme: Theme) => theme.spacing(13),
      width: (theme: Theme) => theme.spacing(26),
      textAlign: "center",
    }}
  >
    {children}
  </Paper>
);

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
// ---------------------
// ↓コンポーネントの開始-----------------------
const Home: React.FC = () => {
  const classes = useStyles();
  const [isLogin, setIsLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState({
    createdAt: "",
    name: "",
    colors: [
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
    ],
  });
  const [displayPalette, setDisplayPalette] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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

  const handleClick = () => {
    const randomColor = palette.colors.map(
      (hex) => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );
    setDisplayPalette(true);
    setPalette({ ...palette, colors: randomColor });
    console.log(palette);
  };

  //背景色の合わせて文字色変更の方法を考える。
  const fontColorChange = (hex: string) => {
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);
    let color = r * 299 + g * 587 + (b * 114) / 1000 < 128 ? "white" : "black";
    console.log(color);

    return r * 299 + g * 587 + (b * 114) / 1000 < 128 ? "white" : "black";
  };

  const onClickCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPalette({ ...palette, name: event.target.value });
    console.log(palette);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const colRef = collection(db, "palettes");
    await addDoc(colRef, {
      createdAt: Timestamp.fromDate(new Date()),
      name: palette.name,
      colors: palette.colors,
    });
  };

  return (
    <Box className={classes.box}>
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
          <List>
            {isLogin ? (
              <ListItem button onClick={handleLogout}>
                <Link to="login">
                  <Typography>ログアウト</Typography>
                </Link>
              </ListItem>
            ) : (
              <ListItem button>
                <Link to="login">
                  <Typography>ログイン</Typography>
                </Link>
              </ListItem>
            )}
            <ListItem button>
              <Link to="collection">
                <Typography>保存一覧</Typography>
              </Link>
            </ListItem>
          </List>
        </Paper>
      </Modal>
      <Grid container xs={9} className={classes.container}>
        <Grid item xs={9} sx={{ paddingTop: "2vh" }}>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{ marginBottom: "1vh" }}
          >
            generate
          </Button>
        </Grid>
        {displayPalette &&
          palette.colors.map((hex) => (
            <Grid key={hex}>
              <ButtonBase onClick={() => onClickCopy(hex)}>
                <Item background={hex} fontColor={() => fontColorChange(hex)}>
                  {hex}
                </Item>
              </ButtonBase>
            </Grid>
          ))}
        <Grid item xs={9}>
          <TextField
            label="name"
            variant="standard"
            onChange={handleChange}
            sx={{ marginTop: "1vh" }}
          />
        </Grid>
        <Grid item xs={9}>
          <form onSubmit={handleSubmit}>
            <Button type="submit" variant="contained" sx={{ marginTop: "1vh" }}>
              保存する
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
