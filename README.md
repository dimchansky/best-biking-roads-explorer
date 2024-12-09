# Best Biking Roads Explorer

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://dimchansky.github.io/best-biking-roads-explorer/)

**Best Biking Roads Explorer** is a user-friendly web application designed to help motorcycling enthusiasts discover and navigate the most interesting motorcycling routes. By allowing users to filter roads by country, type, and rating, this application simplifies the process of finding the perfect motorcycling path tailored to individual preferences. Additionally, it offers the functionality to export filtered routes to GPX format, enabling seamless integration with navigation apps like OsmAnd for on-the-go routing.

[**Access the Live App Here**](https://dimchansky.github.io/best-biking-roads-explorer/)

## Features

- **Comprehensive Filtering:** Easily filter motorcycling roads based on:
    - **Country:** Select your desired country to view its top motorcycling routes.
    - **Road Type:** Choose from various road types to find routes that match your motorcycling style.
    - **Rating:** Filter roads by their ratings to discover the best-reviewed paths.

- **Interactive Map Interface:**
    - Visualize all available motorcycling routes on an interactive map.
    - Click on any road to view its name and access a direct link to its dedicated page on [BestBikingRoads.com](https://www.bestbikingroads.com/).

- **GPX Export:**
    - Export your selected and filtered motorcycling routes to a GPX file.
    - Import the GPX file into your preferred navigation app (e.g., OsmAnd) for real-time routing and navigation during your motorcycling adventures.

## How It Works

1. **Data Acquisition:**
    - All motorcycling routes are sourced from [BestBikingRoads.com](https://www.bestbikingroads.com/) using a dedicated utility written in Go (`main.go`) located in the root folder of the project.
    - This utility fetches and processes the route data, making it ready for use within the application.

2. **Using the Application:**
    - **Filtering Routes:**
        - Navigate to the filter section to select your preferred country, road type, and rating range.
        - The map will dynamically update to display roads that match your selected criteria.

    - **Exploring Roads:**
        - Click on any displayed road on the map to view its name.
        - Click on the road name link to visit its detailed page on [BestBikingRoads.com](https://www.bestbikingroads.com/), where you can find more information about the route.

    - **Exporting to GPX:**
        - After applying your desired filters, click the "Export to GPX" button.
        - Download the generated GPX file and import it into your navigation app to start your motorcycling journey with ease.

## Acknowledgements
- Data sourced from [BestBikingRoads.com](https://www.bestbikingroads.com/).
- Map rendering powered by [Leaflet.js](https://leafletjs.com/).