import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import {
  Button,
  Grid,
  Paper,
  Theme,
  SxProps,
  ButtonBase,
  createTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const theme = createTheme();
const useStyles = makeStyles((theme) => ({
  topContainer: {
    paddingTop: "10vh",
  },
  collections: {
    marginLeft: "5Vh",
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

const Collection: React.FC = () => {
  const classes = useStyles();
  const [collections, setCollections] = useState<COLLECTIONS[]>([
    { createdAt: null, name: "", colors: [] },
  ]);

  const getFirestore = async () => {
    const q = query(collection(db, "palettes"), orderBy("createdAt", "desc"));
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
    <Grid container md={12} direction="row" className={classes.topContainer}>
      <Grid item container md={9} direction="row">
        {collections.map((collection) => (
          <Grid item container md={3} className={classes.collections}>
            {collection.colors.map((color) => (
              <Grid item>
                <ButtonBase>
                  <Item background={color}>{color}</Item>
                </ButtonBase>
              </Grid>
            ))}
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
