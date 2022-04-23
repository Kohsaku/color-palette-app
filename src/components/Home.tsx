import React, { useState, useEffect } from "react";
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
  Modal,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import Menu from "./Menu";

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
      paddingTop: (theme: Theme) => theme.spacing(12),
      height: (theme: Theme) => theme.spacing(12),
      width: (theme: Theme) => theme.spacing(24),
      textAlign: "center",
    }}
  >
    {children}
  </Paper>
);

const generateButtonStyle = {
  bgcolor: "#e84393",
  marginBottom: "2vh",
};

const textFieldStyle = {
  position: "absolute" as "absolute",
  top: "84%",
};

const buttonStyle = {
  position: "absolute" as "absolute",
  top: "92%",
  bgcolor: "#e84393",
};

const ModalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  p: 4,
  bgcolor: "#d1d8e0",
  color: "#130f40",
};

// ---------------------
// ↓コンポーネントの開始-----------------------
const Home: React.FC = () => {
  const classes = useStyles();
  const [isLogin, setIsLogin] = useState(false);
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

  const handleClick = () => {
    const randomColor = palette.colors.map(
      (hex) => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );
    setDisplayPalette(true);
    setPalette({ ...palette, colors: randomColor });
  };

  //背景色の合わせて文字色変更の方法を考える。
  const fontColorChange = (hex: string) => {
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);
    return r * 299 + g * 587 + (b * 114) / 1000 < 128 ? "white" : "black";
  };

  const onClickCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPalette({ ...palette, name: event.target.value });
  };

  // 名前を入れなければ送信できないようにする
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subColRef = collection(
      db,
      "users",
      `${auth.currentUser?.uid}`,
      "palettes"
    );
    try {
      await setDoc(doc(subColRef), {
        createdAt: Timestamp.fromDate(new Date()),
        name: palette.name,
        colors: palette.colors,
      }).then(() => setOpenModal(true));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleClose = () => setOpenModal(false);

  return (
    <Box className={classes.box}>
      <Menu />
      <Grid container xs={9} className={classes.container}>
        <Grid item xs={9} sx={{ paddingTop: "2vh" }}>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={generateButtonStyle}
          >
            カラーパレットを作成する
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
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs={9}>
          <form onSubmit={handleSubmit}>
            <Button
              type="submit"
              variant="contained"
              sx={buttonStyle}
              disabled={isLogin === false || palette.name === ""}
            >
              保存する
            </Button>
          </form>
        </Grid>
      </Grid>
      <Modal open={openModal} onClose={handleClose}>
        <Paper sx={ModalStyle}>
          <Typography variant="h6">保存が完了しました!</Typography>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Home;
