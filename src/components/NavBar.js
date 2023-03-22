//General Imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import uuid4 from "uuid4";

//MaterialUI Imports
import { AppBar, Box, Divider, Drawer } from "@mui/material";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useTheme } from "@mui/material/styles";



function NavBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);
  
  let isLoggedIn = true;
  const router = useRouter();
  const theme = useSelector(store => store.theme);

  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch({ type: "CHANGE_THEME" });
  };

  const drawerWidth = 240;

  useEffect(() => {
    setNavItems(isLoggedIn ? ["Companies", "Jobs", "Profile", "Logout"] : ["Login", "Signup"])    
  }, [isLoggedIn])

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center" }}
      style={{
        backgroundColor: `${theme.palette.secondary.main}`,
        height: "100%",
      }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link
          href="/"
          alt="home"
          style={{
            textDecoration: "none",
            color: `${theme.palette.text.main}`,
          }}
        >
          Habitual
        </Link>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem disablePadding key={uuid4()}>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Link
                href={`/${item.toLowerCase()}`}
                alt={item}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  sx={{
                    fontWeight: `${
                      router.pathname === `/${item.toLowerCase()}`
                        ? "bold"
                        : "normal"
                    }`,
                    color: `${theme.palette.text.main}`,
                  }}
                >
                  {item}
                </Typography>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
        <Brightness4Icon onClick={toggleTheme} />
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav" position="sticky">
        <Toolbar style={{ backgroundColor: `${theme.palette.primary.main}` }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Link
              href="/"
              alt="home"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Habitual
            </Link>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Link
                href={`/${item.toLowerCase()}`}
                alt={item}
                style={{ textDecoration: "none" }}
                key={uuid4()}
              >
                <Button
                  key={item}
                  sx={{
                    color: "#fff",
                    fontWeight: `${
                      router.pathname === `/${item.toLowerCase()}`
                        ? "bold"
                        : "normal"
                    }`,
                  }}
                >
                  {item}
                </Button>
              </Link>
            ))}
            <Button key="theme-toggle" onClick={toggleTheme}>
              <Brightness4Icon
                style={{ color: `${theme.palette.toggle.main}` }}
              />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default NavBar;
