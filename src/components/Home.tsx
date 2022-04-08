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
    paddingTop: "10vh",
  },
  container: {
    paddingLeft: "36vh",
    backgroundColor: "white",
    width: "50vw",
  },
}));

interface ITEM {
  children: React.ReactNode;
  sx?: SxProps;
  background: string;
}

const Item = ({ sx, children, background }: ITEM) => (
  <Paper
    square={true}
    sx={{
      color: "white",
      backgroundColor: background,
      paddingTop: (theme: Theme) => theme.spacing(15),
      height: (theme: Theme) => theme.spacing(15),
      width: (theme: Theme) => theme.spacing(30),
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPalette({ ...palette, name: event.target.value });
    console.log(palette);
  };

  // ↓エラー発生箇所：エラー文 "Uncaught (in promise) FirebaseError: Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore"
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const colRef = collection(db, "palettes");
    await addDoc(colRef, {
      createdAt: Timestamp.fromDate(new Date()),
      name: palette.name,
      colors: palette.colors,
    });
    await setOpenModal(true);
  };

  return (
    <Box className={classes.box}>
      <Grid container className={classes.container}>
        <Grid item sx={{ paddingTop: "10vh" }}>
          <Button onClick={handleClick}>generate</Button>
        </Grid>
        {displayPalette &&
          palette.colors.map((hex) => (
            <Grid key={hex}>
              <ButtonBase>
                <Item background={hex}>{hex}</Item>
              </ButtonBase>
            </Grid>
          ))}
        <Grid item>
          <TextField label="name" variant="standard" onChange={handleChange} />
        </Grid>
        <Grid item>
          <form onSubmit={handleSubmit}>
            <Button type="submit">保存する</Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
