import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { paletteSubmit } from "../features/paletteSlice";
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
import { collection, Timestamp, doc, setDoc } from "firebase/firestore";
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
  background: void;
  fontColor: any;
}

type FONT_COLOR_CHANGE = {
  (hex: string): string;
};

type ON_CLICK_COPY = {
  (hex: string): string;
};

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
  bgcolor: "#006341",
  marginBottom: "2vh",
  "&:hover": {
    background: "#C6893F",
  },
};

const textFieldStyle = {
  position: "absolute" as "absolute",
  top: "84%",
};

const buttonStyle = {
  position: "absolute" as "absolute",
  top: "92%",
  bgcolor: "#006341",
  "&:hover": {
    background: "#C6893F",
  },
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
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(false);
  const [palette, setPalette] = useState({
    createdAt: "",
    name: "",
    colors: [
      "hsl(0, 80, 60)",
      "hsl(0, 80, 60)",
      "hsl(0, 80, 60)",
      "hsl(0, 80, 60)",
      "hsl(0, 80, 60)",
      "hsl(0, 80, 60)",
      "hsl(0, 80, 60)",
      "hsl(0, 80, 60)",
      "hsl(0, 80, 60)",
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
    // const randomColor = palette.colors.map(
    //   (hex) => "#" + Math.floor(Math.random() * 16777215).toString(16)
    // );
    const randomColor = palette.colors.map((hue) => {
      let h = Math.random() * 360;
      return `hsl(${h}, 70%, 50%)`;
    });
    setDisplayPalette(true);
    setPalette({ ...palette, colors: randomColor });
  };

  const changeTo16 = (arr: number[]) => {
    const RGB_MAX = 255;
    const HUE_MAX = 360;
    const SATURATION_MAX = 100;
    const LIGHTNESS_MAX = 100;
    let r, g, b, max, min;

    let h = arr[0] % HUE_MAX;
    let s = arr[1] / SATURATION_MAX;
    let l = arr[2] / LIGHTNESS_MAX;

    if (l < 0.5) {
      max = l + l * s;
      min = l - l * s;
    } else {
      max = l + (1 - l) * s;
      min = l - (1 - l) * s;
    }

    const hp = HUE_MAX / 6;
    const q = h / hp;
    if (q <= 1) {
      r = max;
      g = (h / hp) * (max - min) + min;
      b = min;
    } else if (q <= 2) {
      r = ((hp * 2 - h) / hp) * (max - min) + min;
      g = max;
      b = min;
    } else if (q <= 3) {
      r = min;
      g = max;
      b = ((h - hp * 2) / hp) * (max - min) + min;
    } else if (q <= 4) {
      r = min;
      g = ((hp * 4 - h) / hp) * (max - min) + min;
      b = max;
    } else if (q <= 5) {
      r = ((h - hp * 4) / hp) * (max - min) + min;
      g = min;
      b = max;
    } else {
      r = max;
      g = min;
      b = ((HUE_MAX - h) / hp) * (max - min) + min;
    }

    let red = r * RGB_MAX;
    let green = g * RGB_MAX;
    let blue = b * RGB_MAX;
    return `${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
  };

  const hslToRgb = (hsl: string) => {
    let sliced = hsl.slice(4, -1);
    let splited = sliced.split(",");
    let toInt = splited.map((str) => parseInt(str));
    changeTo16(toInt);
  };

  const fontColorChange: FONT_COLOR_CHANGE = (hex) => {
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 <= 140 ? "#ffffff" : "f000000";
  };

  const onClickCopy: ON_CLICK_COPY = (hex) => {
    navigator.clipboard.writeText(hex);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPalette({ ...palette, name: event.target.value });
  };

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
      dispatch(
        paletteSubmit({
          createdAt: Timestamp.fromDate(new Date()).toString(),
          name: palette.name,
          colors: palette.colors,
        })
      );
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
          palette.colors.map((hsl) => {
            let hex = hslToRgb(hsl);
            <Grid key={hsl}>
              <ButtonBase onClick={() => onClickCopy(hex)}>
                <Item background={hex} fontColor={() => fontColorChange(hex)}>
                  {hex}
                </Item>
              </ButtonBase>
            </Grid>;
          })}
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
