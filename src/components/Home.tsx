import React, { useState } from "react";
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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

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

const Home: React.FC = () => {
  const classes = useStyles();
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
