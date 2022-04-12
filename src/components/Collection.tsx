import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { Button, Grid, Paper, Theme, SxProps, ButtonBase } from "@mui/material";

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
    <Grid container xs={12}>
      collection
      <Button onClick={handleClick}>button</Button>
      {collections.map((collection) => (
        <Grid item xs={4}>
          {collection.colors.map((color) => (
            <Grid>
              <ButtonBase>
                <Item background={color}>{color}</Item>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default Collection;
