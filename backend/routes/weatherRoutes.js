import express from "express";
import axios from "axios";

// helpers
import { stringValidator } from "../helpers.js";

const router = express.Router();

router.get("/city/:city", async (req, res) => {
  let city = req.params.city || "";
  const api_key = process.env.API_KEY || "";
  try {
    // check for api key
    if (!api_key) {
      res.status(500).json({ error: "Invalid API key" });
    }

    // check valid city string
    city = stringValidator(city, "city");

    // get weather data
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    const weatherResponse = await axios.get(url);
    const weatherData = weatherResponse.data;

    return res.status(200).json(weatherData);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: "city not found",
      });
    }
    console.error(error.message);
    return res
      .status(500)
      .json({ error: error.message });
  }
});

router.get('/icon/:id', async (req, res) => {
  const icon = req.params.id;
  const api_key = process.env.API_KEY || "";

  try {
    // check for api key
    if (!api_key) {
      res.status(500).json({ error: "Invalid API key" });
    }

    const url = `https://openweathermap.org/img/wn/${icon}@2x.png`
    const iconResponse = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(iconResponse.data, "binary").toString("base64");

    return res.status(200).json(base64);    
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: "icon not found",
      });
    }
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
})

export default router;
