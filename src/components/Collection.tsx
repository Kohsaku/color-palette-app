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
  fontColor: any;
}

interface COLLECTIONS {
  createdAt: any;
  name: string;
  colors: string[];
}

type CHANGE_TO_16 = {
  (arr: number[]): string;
};

type HSL_TO_RGB = {
  (hsl: string): string;
};

type ON_CLICK_COPY = {
  (hex: string): void;
};

type FONT_COLOR_CHANGE = {
  (hex: string): string;
};

const Item = ({ children, background, fontColor }: ITEM) => (
  <Paper
    square={true}
    sx={{
      color: fontColor,
      bgcolor: background,
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

  const changeTo16: CHANGE_TO_16 = (arr) => {
    let result: any;
    let hue = arr[0];
    let saturation = arr[1];
    let lightness = arr[2];

    if (
      (hue || hue === 0) &&
      hue <= 360 &&
      (saturation || saturation === 0) &&
      saturation <= 100 &&
      (lightness || lightness === 0) &&
      lightness <= 100
    ) {
      var red = 0;
      var green = 0;
      var blue = 0;
      var q = 0;
      var p = 0;
      var hueToRgb;

      hue = Number(hue) / 360;
      saturation = Number(saturation) / 100;
      lightness = Number(lightness) / 100;

      if (saturation === 0) {
        red = lightness;
        green = lightness;
        blue = lightness;
      } else {
        hueToRgb = function (p: number, q: number, t: number) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;

          if (t < 1 / 6) {
            p += (q - p) * 6 * t;
          } else if (t < 1 / 2) {
            p = q;
          } else if (t < 2 / 3) {
            p += (q - p) * (2 / 3 - t) * 6;
          }

          return p;
        };

        if (lightness < 0.5) {
          q = lightness * (1 + saturation);
        } else {
          q = lightness + saturation - lightness * saturation;
        }
        p = 2 * lightness - q;

        red = hueToRgb(p, q, hue + 1 / 3);
        green = hueToRgb(p, q, hue);
        blue = hueToRgb(p, q, hue - 1 / 3);
      }

      result = `#${Math.round(red * 255).toString(16)}${Math.round(
        green * 255
      ).toString(16)}${Math.round(blue * 255).toString(16)}`;
    }

    return result;
  };

  const hslToRgb: HSL_TO_RGB = (hsl) => {
    let sliced = hsl.slice(4, -1);
    let splited = sliced.split(",");
    let toInt = splited.map((str) => parseInt(str));
    return changeTo16(toInt);
  };

  const fontColorChange: FONT_COLOR_CHANGE = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 <= 140 ? "#ffffff" : "f000000";
  };

  const onClickCopy: ON_CLICK_COPY = (hex) => {
    navigator.clipboard.writeText(hex);
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
            {collection.colors.map((color) => {
              let hex = hslToRgb(color);
              return (
                <Grid item>
                  <ButtonBase onClick={() => onClickCopy(hex)}>
                    <Item
                      background={color}
                      fontColor={() => fontColorChange(hex)}
                    >
                      {hex}
                    </Item>
                  </ButtonBase>
                </Grid>
              );
            })}
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h6" sx={nameStyle}>
                  パレット名 : {collection.name}
                </Typography>
              </Grid>
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
