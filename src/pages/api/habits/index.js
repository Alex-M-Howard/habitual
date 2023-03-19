import Habits from "@/models/habits";
const jsonschema = require("jsonschema");
const habitNewSchema = require("../../../models/schemas/habitNew.json");

export default async function handler(req, res) {
  let response;
  
  switch (req.method) {
    case "GET":
      response = await Habits.findAll();
      return res.status(200).json(response);

    
    
    case "POST":
      const validator = jsonschema.validate(req.body, habitNewSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }
      
      response = await Habits.add(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    
    
    case "PUT":
      return res.status(200).json({ message: "Update habit" });

    
    
    case "DELETE":
      return res.status(200).json({ message: "Delete habit" });

    
    
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
