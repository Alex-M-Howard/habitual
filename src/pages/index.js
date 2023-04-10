import Head from "next/head";
import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Home() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Habitual - Daily Habit Tracker & Journal</title>
        <meta
          name="description"
          content="Habitual - Track your daily habits, keep a journal, and see data of all your habits."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="sm">
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          sx={{ minHeight: "85vh" }}>
          <Grid item>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ mt: 3, color: theme.palette.text.main }}>
                Habitual
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ color: theme.palette.text.main }}>
                Daily Habit Tracker & Journal
              </Typography>

              <Typography
                variant="body1"
                component="p"
                sx={{ color: theme.palette.text.main }}>
                Habitual is a habit tracking app that allows you to track your
                daily habits, keep a journal, and see data of all your habits.
                Improve your routines and achieve your personal goals with
                Habitual.
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box mt={2}>
              <Typography
                variant="body2"
                component="p"
                sx={{ color: theme.palette.text.main }}>
                &copy; {new Date().getFullYear()} Habitual. All rights reserved.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
