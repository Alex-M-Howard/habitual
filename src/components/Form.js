import { Button, Grid, TextField } from "@mui/material";
import useFields from "@/hooks/useFields";
import { useTheme } from "@mui/material/styles";

function Form({ fields, initialValues, handleSubmit, buttonText }) {
  const [formData, handleChange] = useFields(initialValues);
  const theme = useTheme();

  const renderFields = fields.map((field) => {
    return (
      <Grid item key={field.name}>
        <TextField
          className="Form-input"
          name={field.name}
          label={field.label}
          value={formData[field.name]}
          type={field.name === "password" ? "password" : "text"}
          onChange={handleChange}
          required
          style={{ width: "350px" }}
          InputProps={{
            style: { color: `${theme.palette.text.main}` },
          }}
        />
      </Grid>
    );
  });

  return (
    <form
      className="Form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(formData);
      }}
      style={{ width: "100vw" }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={2}
        sx={{ mt: 3 }}>
        {renderFields}
        <Grid item>
          <Button
            variant="outlined"
            type="submit"
            sx={{width: "350px"}}>
            {buttonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default Form;
