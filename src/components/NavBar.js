//General Imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import uuid4 from "uuid4";

//MaterialUI Imports
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useTheme } from "@mui/material/styles";

function NavBar(props) {
  const { window, onToggleTheme } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const router = useRouter();
  const user = useSelector((store) => store.user.loggedIn.user) || null;
  const theme = useTheme();

  const drawerWidth = 240;

  useEffect(() => {
    setNavItems(
      user
        ? ["Login", "Signup", "Profile", "Habits", "Info", "Logout", "Journals"]
        : ["Login", "Signup"]
    );
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center" }}
      style={{
        backgroundColor: `${theme.palette.background.navbar}`,
        height: "100%",
      }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link
          href="/"
          alt="home"
          style={{
            textDecoration: "none",
            color: `${theme.palette.text.navbar}`,
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
                    color: `${theme.palette.text.navbar}`,
                  }}
                >
                  {item}
                </Typography>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}

        <Brightness4Icon onClick={onToggleTheme} />
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav" position="sticky">
        <Toolbar
          style={{ backgroundColor: `${theme.palette.background.navbar}` }}
        >
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
              style={{
                textDecoration: "none",
                color: `${theme.palette.text.navbar}`,
              }}
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
                    color: `${theme.palette.text.navbar}`,
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

            <Button key="theme-toggle" onClick={onToggleTheme}>
              <Brightness4Icon
                style={{ color: `${theme.palette.text.navbar}` }}
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
