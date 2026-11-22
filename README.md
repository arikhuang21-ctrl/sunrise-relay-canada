# Sunrise Relay: Canada

**CCT360 · Project 2 · Group 14**  
Jiachen Huang and Jun Ye

An interactive website exploring current weather and daylight across Vancouver, Calgary, Toronto, Ottawa, and Montreal. Forecast data shapes the city cards and browsing experience; photographs show representative city scenes.

## Live website

https://arikhuang21-ctrl.github.io/sunrise-relay-canada/

## Run locally

Open the project folder with VS Code Live Server. An internet connection is required for weather data. Opening `index.html` directly as a `file://` page may block the API request.

## Features

- Retrieves current conditions and daily forecast data for five Canadian cities from the Open-Meteo Forecast API.
- Displays temperature, wind, snowfall, precipitation chance, sunrise, sunset, and daylight duration.
- Supports city selection, forecast filters, Celsius/Fahrenheit, forecast refresh, and an enlarged photo gallery.
- Updates weather labels and visual details using the returned forecast data.

## Sources and credits

- Weather data: [Open-Meteo Forecast API](https://open-meteo.com/en/docs) · [Attribution](https://open-meteo.com/en/licence)
- City photographs are included in `assets/`; photographer credits and source pages are linked on the website.

Photographs are representative scenes, not live weather images. Forecasts are model estimates and are not emergency alerts.
