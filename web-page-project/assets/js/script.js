// This file contains the JavaScript code for the web page. It handles the logic for fetching data from sample.json, categorizing it by brand, model, and year, and dynamically updating the HTML content.

document.addEventListener('DOMContentLoaded', function () {
    fetch('data/sample.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const catalog = document.getElementById('catalog');
            const groupedData = {};

            // Group data by brand, model, and year
            Object.keys(data).forEach(key => {
                const [brand, model, year, imageName] = key.split('/');
                const imageUrl = data[key];

                if (!groupedData[brand]) groupedData[brand] = {};
                if (!groupedData[brand][model]) groupedData[brand][model] = {};
                if (!groupedData[brand][model][year]) groupedData[brand][model][year] = [];

                groupedData[brand][model][year].push(imageUrl);
            });

            // Function to render the catalog
            function renderCatalog(filterType = null, filterValue = null) {
                catalog.innerHTML = ''; // Clear the catalog

                Object.keys(groupedData).forEach(brand => {
                    if (filterType === 'brand' && filterValue !== brand) return;

                    const brandDiv = document.createElement('div');
                    brandDiv.classList.add('brand');
                    brandDiv.innerHTML = `<h2>${brand}</h2>`;

                    Object.keys(groupedData[brand]).forEach(model => {
                        if (filterType === 'model' && filterValue !== model) return;

                        const modelDiv = document.createElement('div');
                        modelDiv.classList.add('model');
                        modelDiv.innerHTML = `<h3>${model}</h3>`;

                        Object.keys(groupedData[brand][model]).forEach(year => {
                            if (filterType === 'year' && filterValue !== year) return;

                            const yearDiv = document.createElement('div');
                            yearDiv.classList.add('year');
                            yearDiv.innerHTML = `<h4>${year}</h4>`;

                            const imagesDiv = document.createElement('div');
                            imagesDiv.classList.add('images');

                            groupedData[brand][model][year].forEach(imageUrl => {
                                const img = document.createElement('img');
                                img.src = imageUrl;
                                img.alt = `${brand} ${model} ${year}`;
                                imagesDiv.appendChild(img);
                            });

                            yearDiv.appendChild(imagesDiv);
                            modelDiv.appendChild(yearDiv);
                        });

                        brandDiv.appendChild(modelDiv);
                    });

                    catalog.appendChild(brandDiv);
                });
            }

            // Initial render
            renderCatalog();

            // Add event listeners for filters
            document.getElementById('filter-brand').addEventListener('click', () => {
                const brand = prompt('Enter a brand to filter:');
                if (brand) renderCatalog('brand', brand);
            });

            document.getElementById('filter-model').addEventListener('click', () => {
                const model = prompt('Enter a model to filter:');
                if (model) renderCatalog('model', model);
            });

            document.getElementById('filter-year').addEventListener('click', () => {
                const year = prompt('Enter a year to filter:');
                if (year) renderCatalog('year', year);
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            document.getElementById('catalog').innerHTML = '<p>Error loading data. Please check the console for details.</p>';
        });
});