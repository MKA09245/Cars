# Web Page Project

## Overview
This project is a simple web page that categorizes and displays data from a JSON file. The data is organized by brand, model, and year, and is dynamically rendered using JavaScript.

## Project Structure
```
web-page-project
├── assets
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── script.js
├── data
│   └── sample.json
├── index.html
└── README.md
```

## Files Description

- **index.html**: The main HTML document that serves as the entry point for the web application. It links to the CSS and JavaScript files.

- **assets/css/style.css**: Contains the styles for the web page, defining the layout, colors, fonts, and other visual aspects.

- **assets/js/script.js**: Contains the JavaScript code that fetches data from `sample.json`, categorizes it by brand, model, and year, and updates the HTML content dynamically.

- **data/sample.json**: A JSON file that contains an array of data objects with properties for brand, model, and year.

## Setup Instructions

1. Clone the repository or download the project files.
2. Open the `index.html` file in a web browser to view the web page.
3. Ensure that the `sample.json` file is correctly formatted and located in the `data` directory for the JavaScript to fetch the data successfully.

## Usage
The web page will display the categorized data once loaded. You can modify the `sample.json` file to change the data displayed on the web page.