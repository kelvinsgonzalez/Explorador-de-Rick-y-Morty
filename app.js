document.addEventListener('DOMContentLoaded', () => {
    // 1. REFERENCIAS AL DOM
    const charactersContainer = document.getElementById('characters-container');
    const nameFilter = document.getElementById('name-filter');
    const statusFilter = document.getElementById('status-filter');
    const genderFilter = document.getElementById('gender-filter');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    // 2. ESTADO
    const BASE_URL = 'https://rickandmortyapi.com/api/character';
    let currentPageUrl = BASE_URL;
    let prevPageUrl = null;
    let nextPageUrl = null;

    // 3. FUNCIÓN PARA OBTENER PERSONAJES
    const fetchCharacters = async (url) => {
        charactersContainer.innerHTML = `<p class="text-center text-xl col-span-full">Cargando personajes... 🛸</p>`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('No se encontraron personajes con esos filtros.');

            const data = await response.json();
            prevPageUrl = data.info.prev;
            nextPageUrl = data.info.next;

            renderCharacters(data.results);
            updatePaginationButtons();
        } catch (error) {
            charactersContainer.innerHTML = `<p class="text-center text-xl col-span-full text-red-400">${error.message}</p>`;
            prevPageUrl = null;
            nextPageUrl = null;
            updatePaginationButtons();
        }
    };

    // 4. FUNCIÓN PARA MOSTRAR PERSONAJES
    const renderCharacters = (characters) => {
        charactersContainer.innerHTML = characters.map(character => {
            const statusColor = character.status === 'Alive' ? 'bg-green-500' :
                                character.status === 'Dead' ? 'bg-red-500' :
                                'bg-gray-500';

            return `
                <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img src="${character.image}" alt="${character.name}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h2 class="text-2xl font-bold mb-2">${character.name}</h2>
                        <p class="flex items-center gap-2">
                            <span class="h-3 w-3 rounded-full ${statusColor}"></span>
                            ${character.status} - ${character.species}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    };

    // 5. ACTUALIZA LOS BOTONES
    const updatePaginationButtons = () => {
        prevButton.disabled = !prevPageUrl;
        nextButton.disabled = !nextPageUrl;
    };

    // 6. FILTRAR POR NOMBRE, ESTADO Y GÉNERO
    const applyFilters = () => {
        const name = nameFilter.value.trim();
        const status = statusFilter.value;
        const gender = genderFilter.value;

        const queryParams = new URLSearchParams();
        if (name) queryParams.set('name', name);
        if (status) queryParams.set('status', status);
        if (gender) queryParams.set('gender', gender);

        const filterUrl = `${BASE_URL}?${queryParams.toString()}`;
        currentPageUrl = filterUrl;
        fetchCharacters(currentPageUrl);
    };

    // 7. EVENTOS
    prevButton.addEventListener('click', () => {
        if (prevPageUrl) {
            currentPageUrl = prevPageUrl;
            fetchCharacters(prevPageUrl);
        }
    });

    nextButton.addEventListener('click', () => {
        if (nextPageUrl) {
            currentPageUrl = nextPageUrl;
            fetchCharacters(nextPageUrl);
        }
    });

    nameFilter.addEventListener('input', () => {
        clearTimeout(nameFilter._timeout);
        nameFilter._timeout = setTimeout(applyFilters, 400); // debounce
    });

    statusFilter.addEventListener('change', applyFilters);
    genderFilter.addEventListener('change', applyFilters);

    // 8. CARGA INICIAL
    fetchCharacters(currentPageUrl);
});
