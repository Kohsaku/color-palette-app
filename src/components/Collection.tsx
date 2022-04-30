import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import {
  Grid,
  Paper,
  Theme,
  SxProps,
  ButtonBase,
  createTheme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Menu from "./Menu";

const theme = createTheme();
const useStyles = makeStyles((theme) => ({
  topContainer: {
    paddingTop: "10vh",
    paddingLeft: "25vh",
  },
  collections: {
    marginBottom: "5vh",
  },
}));

interface ITEM {
  children: React.ReactNode;
  sx?: SxProps;
  background: string;
  fontColor: () => string;
}

interface COLLECTIONS {
  createdAt: any;
  name: string;
  colors: string[];
}

const Item = ({ sx, children, background, fontColor }: ITEM) => (
  <Paper
    square={true}
    sx={{
      color: fontColor,
      backgroundColor: background,
      paddingTop: (theme: Theme) => theme.spacing(4),
      height: (theme: Theme) => theme.spacing(6),
      width: (theme: Theme) => theme.spacing(10),
      textAlign: "center",
    }}
  >
    {children}
  </Paper>
);

const nameStyle = {
  marginLeft: "2vh",
};

const onClickCopy = (hex: string) => {
  navigator.clipboard.writeText(hex);
};

const Collection: React.FC = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState<COLLECTIONS[]>([
    { createdAt: null, name: "", colors: [] },
  ]);

  const getFirestore = async () => {
    const subColRef = collection(
      db,
      "users",
      `${auth.currentUser?.uid}`,
      "palettes"
    );
    const q = query(subColRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    setCollections(
      querySnapshot.docs.map((doc) => ({
        createdAt:
          `${doc.data().createdAt.toDate().getFullYear()}` +
          "/" +
          `${doc.data().createdAt.toDate().getMonth() + 1}` +
          "/" +
          `${doc.data().createdAt.toDate().getDate()}` +
          "/" +
          `${doc.data().createdAt.toDate().getHours()}` +
          ":" +
          `${doc.data().createdAt.toDate().getMinutes()}`,
        name: doc.data().name,
        colors: doc.data().colors,
      }))
    );
  };

  useEffect(() => {
    getFirestore();
  }, []);

  const fontColorChange = (hex: string) => {
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 <= 140 ? "#ffffff" : "f000000";
  };

  return (
    <Grid container md={15} direction="row">
      <Menu />
      <Grid
        className={classes.topContainer}
        item
        container
        md={15}
        direction="row"
        rowSpacing={15}
        columnSpacing={15}
      >
        {collections.map((collection) => (
          <Grid item container md={3.5}>
            {collection.colors.map((color) => (
              <Grid item>
                <ButtonBase onClick={() => onClickCopy(color)}>
                  <Item
                    background={color}
                    fontColor={() => fontColorChange(color)}
                  >
                    {color}
                  </Item>
                </ButtonBase>
              </Grid>
            ))}
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h6" sx={nameStyle}>
                  パレット名 : {collection.name}
                </Typography>
              </Grid>
              {/* 作成日時の表示方法とレイアウトを考える */}
              <Grid item>
                <Typography variant="h6">
                  作成日時 : {collection.createdAt}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Collection;
