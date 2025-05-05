document.addEventListener('DOMContentLoaded', function () {
    fetch('data/sample.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const brandSelect = document.getElementById('brand-select');
            const modelSelect = document.getElementById('model-select');
            const yearSelect = document.getElementById('year-select');
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

            // Populate the brand dropdown
            Object.keys(groupedData).forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            });

            // Handle brand selection
            brandSelect.addEventListener('change', () => {
                const selectedBrand = brandSelect.value;
                modelSelect.innerHTML = '<option value="">Select Model</option>';
                yearSelect.innerHTML = '<option value="">Select Year</option>';
                yearSelect.disabled = true;
                catalog.innerHTML = '';

                if (selectedBrand) {
                    modelSelect.disabled = false;
                    Object.keys(groupedData[selectedBrand]).forEach(model => {
                        const option = document.createElement('option');
                        option.value = model;
                        option.textContent = model;
                        modelSelect.appendChild(option);
                    });
                } else {
                    modelSelect.disabled = true;
                }
            });

            // Handle model selection
            modelSelect.addEventListener('change', () => {
                const selectedBrand = brandSelect.value;
                const selectedModel = modelSelect.value;
                yearSelect.innerHTML = '<option value="">Select Year</option>';
                catalog.innerHTML = '';

                if (selectedModel) {
                    yearSelect.disabled = false;
                    Object.keys(groupedData[selectedBrand][selectedModel]).forEach(year => {
                        const option = document.createElement('option');
                        option.value = year;
                        option.textContent = year;
                        yearSelect.appendChild(option);
                    });
                } else {
                    yearSelect.disabled = true;
                }
            });

            // Handle year selection
            yearSelect.addEventListener('change', () => {
                const selectedBrand = brandSelect.value;
                const selectedModel = modelSelect.value;
                const selectedYear = yearSelect.value;
                catalog.innerHTML = '';

                if (selectedYear) {
                    const images = groupedData[selectedBrand][selectedModel][selectedYear];
                    images.forEach(imageUrl => {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = `${selectedBrand} ${selectedModel} ${selectedYear}`;
                        catalog.appendChild(img);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            document.getElementById('catalog').innerHTML = '<p>Error loading data. Please check the console for details.</p>';
        });
});
