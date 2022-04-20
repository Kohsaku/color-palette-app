import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  Button,
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
    paddingLeft: "5vh",
  },
  collections: {
    marginBottom: "10vh",
  },
}));

interface ITEM {
  children: React.ReactNode;
  sx?: SxProps;
  background: string;
}

interface COLLECTIONS {
  createdAt: any;
  name: string;
  colors: string[];
}

const Item = ({ sx, children, background }: ITEM) => (
  <Paper
    square={true}
    sx={{
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

const onClickCopy = (hex: string) => {
  navigator.clipboard.writeText(hex);
};

const Collection: React.FC = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState<COLLECTIONS[]>([
    { createdAt: null, name: "", colors: [] },
  ]);

  //   const getFirestore = async () => {
  //     const q = query(collection(db, "palettes"), orderBy("createdAt", "desc"));
  //     const querySnapshot = await getDocs(q);
  //     setCollections(
  //       querySnapshot.docs.map((doc) => ({
  //         createdAt: doc.data().createdAt,
  //         name: doc.data().name,
  //         colors: doc.data().colors,
  //       }))
  //     );
  //   };

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
        createdAt: doc.data().createdAt,
        name: doc.data().name,
        colors: doc.data().colors,
      }))
    );
  };

  useEffect(() => {
    getFirestore();
  }, []);

  const handleClick = () => {
    console.log(collections);
  };

  return (
    <Grid container md={15} direction="row" className={classes.topContainer}>
      <Menu />
      <Grid
        item
        container
        md={12}
        direction="row"
        rowSpacing={15}
        columnSpacing={15}
      >
        {collections.map((collection) => (
          <Grid item container md={3}>
            {collection.colors.map((color) => (
              <Grid item>
                <ButtonBase onClick={() => onClickCopy(color)}>
                  <Item background={color}>{color}</Item>
                </ButtonBase>
              </Grid>
            ))}
            <Typography variant="h5">{collection.name}</Typography>
            {/* 作成日時の表示方法とレイアウトを考える */}
            {/* <Typography variant="h5">
              {new Timestamp(
                collection.createdAt.seconds,
                collection.createdAt.nanoseconds
              ).toDate()}
            </Typography> */}
          </Grid>
        ))}
        <Grid item>
          <Button onClick={handleClick}>button</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Collection;
