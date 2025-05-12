document.addEventListener('DOMContentLoaded', function () {
    const fileSelect = document.createElement('select'); // Вибір JSON-файлу
    const brandSelect = document.getElementById('brand-select');
    const modelSelect = document.getElementById('model-select');
    const yearSelect = document.getElementById('year-select');
    const catalog = document.getElementById('catalog');
    let groupedData = {};
    let currentGalleryImages = [];
    let currentImageIndex = 0;

    // Додати модальне вікно для перегляду галереї
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <button class="prev">&lt;</button>
            <img id="modal-image" src="" alt="Full View">
            <button class="next">&gt;</button>
        </div>
    `;
    document.body.appendChild(modal);

    const modalImage = document.getElementById('modal-image');
    const closeModal = modal.querySelector('.close');
    const prevButton = modal.querySelector('.prev');
    const nextButton = modal.querySelector('.next');

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateModalImage();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentImageIndex < currentGalleryImages.length - 1) {
            currentImageIndex++;
            updateModalImage();
        }
    });

    function updateModalImage() {
        modalImage.src = currentGalleryImages[currentImageIndex];
    }

    // Додати вибір файлу до фільтрів
    const filtersSection = document.getElementById('filters');
    const fileGroup = document.createElement('div');
    fileGroup.classList.add('filter-group');
    fileGroup.innerHTML = `
        <label for="file-select">Data File:</label>
    `;
    fileGroup.appendChild(fileSelect);
    filtersSection.insertBefore(fileGroup, filtersSection.firstChild);

    // Завантажити список JSON-файлів із папки data
    fetch('assets/data/')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load file list');
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const files = Array.from(doc.querySelectorAll('a'))
                .map(link => link.href.split('/').pop())
                .filter(file => file.endsWith('.json'));
            populateFileDropdown(files);
        })
        .catch(error => {
            console.error('Error loading file list:', error);
            catalog.innerHTML = '<p>Error loading file list. Please try again later.</p>';
        });

    function populateFileDropdown(files) {
        fileSelect.innerHTML = '<option value="">Select File</option>';
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            fileSelect.appendChild(option);
        });

        fileSelect.addEventListener('change', handleFileChange);
    }

    function handleFileChange() {
        const selectedFile = fileSelect.value;
        if (selectedFile) {
            fetch(`assets/data/${selectedFile}`)
                .then(response => response.json())
                .then(data => {
                    processData(data);
                })
                .catch(error => {
                    console.error('Error loading data:', error);
                    catalog.innerHTML = '<p>Error loading data. Please try again later.</p>';
                });
        } else {
            groupedData = {};
            resetFilters();
        }
    }

    function processData(data) {
        groupedData = {};

        // Групувати дані за брендом, моделлю та роком
        Object.keys(data).forEach(key => {
            const [brand, model, year, imageName] = key.split('/');
            const imageUrl = data[key];

            if (!groupedData[brand]) groupedData[brand] = {};
            if (!groupedData[brand][model]) groupedData[brand][model] = {};
            if (!groupedData[brand][model][year]) groupedData[brand][model][year] = [];

            groupedData[brand][model][year].push(imageUrl);
        });

        populateBrandDropdown();
    }

    function populateBrandDropdown() {
        brandSelect.innerHTML = '<option value="">Select Brand</option>';
        Object.keys(groupedData).forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });

        brandSelect.addEventListener('change', handleBrandChange);
    }

    function handleBrandChange() {
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

            modelSelect.addEventListener('change', handleModelChange);
        } else {
            modelSelect.disabled = true;
        }
    }

    function handleModelChange() {
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

            yearSelect.addEventListener('change', handleYearChange);
        } else {
            yearSelect.disabled = true;
        }
    }

    function handleYearChange() {
        const selectedBrand = brandSelect.value;
        const selectedModel = modelSelect.value;
        const selectedYear = yearSelect.value;
        catalog.innerHTML = '';

        if (selectedYear) {
            const images = groupedData[selectedBrand][selectedModel][selectedYear];
            currentGalleryImages = images; // Зберегти всі зображення для галереї
            images.forEach((imageUrl, index) => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${selectedBrand} ${selectedModel} ${selectedYear}`;
                img.onload = () => {
                    if (img.naturalWidth > 1 && img.naturalHeight > 1) {
                        img.addEventListener('click', () => {
                            currentImageIndex = index;
                            updateModalImage();
                            modal.style.display = 'flex';
                        });
                        catalog.appendChild(img);
                    } else {
                        img.remove(); // Видалити зображення, якщо його розмір 1 піксель
                    }
                };
                img.onerror = () => {
                    img.remove(); // Видалити зображення, якщо воно не завантажується
                };
            });
        }
    }

    function resetFilters() {
        brandSelect.innerHTML = '<option value="">Select Brand</option>';
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        yearSelect.innerHTML = '<option value="">Select Year</option>';
        yearSelect.disabled = true;
        modelSelect.disabled = true;
        catalog.innerHTML = '';
    }
});
