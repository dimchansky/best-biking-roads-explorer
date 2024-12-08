// js/app.js

const { createApp } = Vue;

// Define the maximum rating as a constant
const MAX_RATING = 5;

createApp({
    data() {
        return {
            // Hierarchical structure: Country -> Road Type -> Routes
            allRoutes: {}, // { countryName: { roadType: [route1, route2, ...], ... }, ... }

            // Hierarchical structure for filtered routes
            filteredRoutes: {}, // Similar structure as allRoutes

            // Centralized filter state
            filters: {
                countries: [], // Selected countries
                roadTypes: [], // Selected road types
                ratingRange: [1, 5] // Selected rating range
            },

            // Previous filter states for change detection
            previousFilters: {
                countries: [],
                roadTypes: [],
                ratingRange: [1, 5]
            },

            map: null,
            polylines: {}, // { routeId: Leaflet Polyline Layer, ... }
            infowindow: null,

            // Layer groups for each country (optional optimization)
            countryLayerGroups: {}, // { countryName: L.LayerGroup, ... }

            // Modal related data
            showModal: false,
            modalType: '',
            modalOptions: [],
            tempSelectedValues: [],
            tempRatingRange: [1, 5],
            searchQuery: '',
            ratingMarks: {
                1: '1.0',
                2: '2.0',
                3: '3.0',
                4: '4.0',
                5: '5.0'
            },

            // Tile Layers
            tileLayers: {},
            currentTileLayer: null,

            // Default Rating Range
            defaultRatingRange: [1, 5],
        };
    },
    computed: {
        /**
         * Computes the title of the modal based on the current modalType.
         * @returns {String} The title to be displayed in the modal header.
         */
        getModalTitle() {
            if (this.modalType === 'country') return 'Select Countries';
            if (this.modalType === 'roadType') return 'Select Road Types';
            if (this.modalType === 'rating') return 'Select Rating Range';
            return '';
        },
        /**
         * Filters the modalOptions based on the user's searchQuery.
         * Enables real-time search within the modal to find specific options.
         * @returns {Array} Filtered array of options matching the search query.
         */
        filteredModalOptions() {
            if (!this.searchQuery) return this.modalOptions;
            const query = this.searchQuery.toLowerCase();
            return this.modalOptions.filter(option => option.toLowerCase().includes(query));
        }
    },
    methods: {
        /**
         * Initializes the Leaflet map, sets up tile layers, and adds layer controls.
         */
        initMap() {
            // Initialize the map centered at latitude 20, longitude 0 with zoom level 2.
            this.map = L.map('map').setView([20, 0], 2);

            // Access tile layer configurations from constants.js.
            const tileLayerConfigs = window.APP_CONSTANTS.tileLayers;

            // Iterate through each tile layer configuration and create Leaflet tile layers.
            for (const key in tileLayerConfigs) {
                if (tileLayerConfigs.hasOwnProperty(key)) {
                    const config = tileLayerConfigs[key];
                    this.tileLayers[key] = L.tileLayer(config.url, config.options);
                }
            }

            // Set the default tile layer (e.g., Streets) and add it to the map.
            this.currentTileLayer = this.tileLayers.streets;
            this.currentTileLayer.addTo(this.map);

            // Prepare named base maps for the layer control using defined names in constants.js.
            const baseMapsNamed = {};
            for (const key in tileLayerConfigs) {
                if (tileLayerConfigs.hasOwnProperty(key)) {
                    const config = tileLayerConfigs[key];
                    baseMapsNamed[config.name] = this.tileLayers[key];
                }
            }

            // Add layer control to the map to allow users to switch between different tile layers.
            // The 'collapsed: false' option ensures that the control is always visible.
            L.control.layers(baseMapsNamed, null, { collapsed: false }).addTo(this.map);

            // Initialize the Leaflet popup instance for displaying route information.
            this.infowindow = L.popup();
        },

        /**
         * Asynchronously fetches all route data from JSON files corresponding to each country.
         * Populates allRoutes in a hierarchical structure: Country -> Road Type -> Routes (sorted by rating).
         */
        async fetchAllData() {
            // Iterate through each country defined in constants.js
            const fetchPromises = window.APP_CONSTANTS.countries.map(country => {
                const url = `./data/${country.Name}.json`;
                return fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load ${country.Name}.json`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Initialize the country in allRoutes if not already present
                        if (!this.allRoutes[country.Name]) {
                            this.allRoutes[country.Name] = {};
                            // Initialize a layer group for the country (optional)
                            this.countryLayerGroups[country.Name] = L.layerGroup().addTo(this.map);
                        }

                        data.forEach(route => {
                            // Assign a unique ID if not present
                            route.id = route.id || `${country.Code}-${route.title.replace(/\s+/g, '-')}`;

                            // **Convert rating from string to number with default value**
                            route.rating = parseFloat(route.rating);
                            if (isNaN(route.rating)) {
                                route.rating = 1; // Rating 1 by default
                            }

                            // Determine stroke color based on rating
                            let strokeColor = "#484848"; // Grey default
                            const ratingValue = route.rating;
                            if (ratingValue >= 4.3) {
                                strokeColor = "#FF0000"; // Red
                            } else if (ratingValue >= 3.3) {
                                strokeColor = "#0000FF"; // Blue
                            } else if (ratingValue >= 2.3) {
                                strokeColor = "#660033"; // Dark Red
                            }

                            // Decode polyline using @mapbox/polyline
                            const decodedPath = polyline.decode(route.polyline).map(coord => [coord[0], coord[1]]);

                            // Create polyline without adding to map
                            const polylineLayer = L.polyline(decodedPath, {
                                color: strokeColor,
                                weight: 4,
                                opacity: 0.7
                            });

                            // **Add click event listener**
                            polylineLayer.on('click', (e) => {
                                const miles = (route.length * 0.621371).toFixed(2);
                                const contentString = `
                                    <div class="info-window">
                                        <a href="https://www.bestbikingroads.com${route.url}" target="_blank">${route.title}</a><br/>
                                        Length: ${route.length} km / ${miles} miles<br/>
                                        Type: ${route.road_type_name}<br/>
                                        Rating: ${route.rating} (${route.comments_count})
                                    </div>
                                `;
                                this.infowindow.setLatLng(e.latlng)
                                    .setContent(contentString)
                                    .openOn(this.map);
                            });

                            // **Add double-click event to navigate to route URL**
                            polylineLayer.on('dblclick', () => {
                                window.location.href = `https://www.bestbikingroads.com${route.url}`;
                            });

                            // Initialize road type in allRoutes if not present
                            if (!this.allRoutes[country.Name][route.road_type_name]) {
                                this.allRoutes[country.Name][route.road_type_name] = [];
                            }

                            // Add the route to the corresponding road type array
                            this.allRoutes[country.Name][route.road_type_name].push(route);

                            // Store the polyline reference
                            this.polylines[route.id] = polylineLayer;
                        });

                        // After adding all routes, sort them by rating within each road type
                        for (const roadType in this.allRoutes[country.Name]) {
                            if (this.allRoutes[country.Name].hasOwnProperty(roadType)) {
                                this.allRoutes[country.Name][roadType].sort((a, b) => a.rating - b.rating);
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });

            // Await all fetch operations to complete
            await Promise.all(fetchPromises);

            // Populate filter options based on the loaded data
            this.populateFilters();

            // Do not initialize filteredRoutes with all routes on load
            // This ensures no routes are displayed until filters are applied
        },

        /**
         * Populates filter options based on the loaded data.
         */
        populateFilters() {
            // Populate road types from allRoutes globally
            const roadTypeSet = new Set();
            for (const country in this.allRoutes) {
                if (this.allRoutes.hasOwnProperty(country)) {
                    for (const roadType in this.allRoutes[country]) {
                        if (this.allRoutes[country].hasOwnProperty(roadType)) {
                            roadTypeSet.add(roadType);
                        }
                    }
                }
            }
            this.roadTypes = Array.from(roadTypeSet).sort();

            // **Pre-select all road types in the filter**
            this.filters.roadTypes = [...this.roadTypes];
        },

        /**
         * Applies user-selected filters to allRoutes and updates filteredRoutes accordingly.
         * Utilizes a hierarchical filtering approach: Country -> Road Type -> Rating.
         * Only applies fitBounds when the country filter is changed.
         */
        applyFilters() {
            // Detect changes in filter criteria
            const countriesChanged = !this.arraysEqual(this.filters.countries, this.previousFilters.countries);
            const roadTypesChanged = !this.arraysEqual(this.filters.roadTypes, this.previousFilters.roadTypes);
            const ratingChanged = !this.arraysEqual(this.filters.ratingRange, this.previousFilters.ratingRange);

            // Update previous filter states
            this.previousFilters.countries = [...this.filters.countries];
            this.previousFilters.roadTypes = [...this.filters.roadTypes];
            this.previousFilters.ratingRange = [...this.filters.ratingRange];

            // If no filters have changed, do nothing
            if (!countriesChanged && !roadTypesChanged && !ratingChanged) {
                return;
            }

            // Reset filteredRoutes
            this.filteredRoutes = {};

            // Handle No Country Selection
            if (this.filters.countries.length === 0) {
                // No countries selected: Do not display any roads
                // Do not apply fitBounds
                this.renderMap(false);
                return;
            }

            // Iterate through each selected country
            this.filters.countries.forEach(country => {
                if (this.allRoutes[country]) {
                    this.filteredRoutes[country] = {};

                    // Iterate through each selected road type
                    this.filters.roadTypes.forEach(roadType => {
                        if (this.allRoutes[country][roadType]) {
                            // Destructure rating range for clarity
                            const [lowerBound, upperBound] = this.filters.ratingRange;

                            // Apply the rating filter logic
                            const filteredByRating = this.allRoutes[country][roadType].filter(route => {
                                if (upperBound < MAX_RATING) {
                                    // If upperBound is less than MAX_RATING, exclude the upper boundary
                                    return route.rating >= lowerBound && route.rating < upperBound;
                                } else {
                                    // If upperBound is equal to MAX_RATING, include it
                                    return route.rating >= lowerBound && route.rating <= upperBound;
                                }
                            });

                            if (filteredByRating.length > 0) {
                                this.filteredRoutes[country][roadType] = filteredByRating;
                            }
                        }
                    });

                    // Remove country from filteredRoutes if no road types are present after filtering
                    if (Object.keys(this.filteredRoutes[country]).length === 0) {
                        delete this.filteredRoutes[country];
                    }
                }
            });

            // Determine whether to apply fitBounds
            let shouldFitBounds = false;
            if (countriesChanged) {
                // Country filter changed: Apply fitBounds
                shouldFitBounds = true;
            }
            // Else: Do not apply fitBounds for road type or rating changes

            // Render the updated filtered routes on the map with the determined fitBounds flag
            this.renderMap(shouldFitBounds);
        },

        /**
         * Renders the routes stored in filteredRoutes on the Leaflet map.
         * Conditionally applies fitBounds based on the shouldFitBounds flag.
         * @param {Boolean} shouldFitBounds - Determines whether to adjust the map view.
         */
        renderMap(shouldFitBounds = false) {
            // Determine which routes need to be displayed based on filteredRoutes
            const routesToDisplay = [];

            for (const country in this.filteredRoutes) {
                if (this.filteredRoutes.hasOwnProperty(country)) {
                    for (const roadType in this.filteredRoutes[country]) {
                        if (this.filteredRoutes[country].hasOwnProperty(roadType)) {
                            this.filteredRoutes[country][roadType].forEach(route => {
                                routesToDisplay.push(route);
                            });
                        }
                    }
                }
            }

            // Determine which routes are currently displayed on the map
            const currentlyDisplayedRouteIds = new Set(
                Object.keys(this.polylines).filter(routeId => this.map.hasLayer(this.polylines[routeId]))
            );

            // Determine which routes need to be added
            const routesToAdd = routesToDisplay.filter(route => !currentlyDisplayedRouteIds.has(route.id));

            // Determine which routes need to be removed
            const routesToRemove = Array.from(currentlyDisplayedRouteIds).filter(
                routeId => !routesToDisplay.find(route => route.id === routeId)
            );

            // Add new polylines to the map
            routesToAdd.forEach(route => {
                const polylineLayer = this.polylines[route.id];
                if (polylineLayer && !this.map.hasLayer(polylineLayer)) {
                    polylineLayer.addTo(this.map);
                }
            });

            // Remove obsolete polylines from the map
            routesToRemove.forEach(routeId => {
                const polylineLayer = this.polylines[routeId];
                if (polylineLayer && this.map.hasLayer(polylineLayer)) {
                    this.map.removeLayer(polylineLayer);
                }
            });

            // **Conditional fitBounds Logic**
            if (routesToDisplay.length > 0) {
                if (shouldFitBounds) {
                    const bounds = L.latLngBounds();
                    routesToDisplay.forEach(route => {
                        const polylineLayer = this.polylines[route.id];
                        if (polylineLayer) {
                            polylineLayer.getLatLngs().forEach(latlng => bounds.extend(latlng));
                        }
                    });
                    this.map.fitBounds(bounds);
                }
                // Else: Do not adjust the map view
            }
            // **Else:** Do not reset the map view to default
        },

        /**
         * Opens the filter modal based on the type of filter selected by the user.
         * @param {String} type - The type of filter modal to open ('country', 'roadType', 'rating').
         */
        openModal(type) {
            this.modalType = type;

            if (type === 'country') {
                // Populate modalOptions with a sorted list of country names.
                this.modalOptions = window.APP_CONSTANTS.countries.map(c => c.Name).sort();
                // Initialize tempSelectedValues with currently selected countries.
                this.tempSelectedValues = [...this.filters.countries];
            } else if (type === 'roadType') {
                // Populate modalOptions with all road types globally
                this.modalOptions = [...this.roadTypes].sort();
                // Initialize tempSelectedValues with currently selected road types
                this.tempSelectedValues = [...this.filters.roadTypes];
            } else if (type === 'rating') {
                // Initialize tempRatingRange with current min and max ratings.
                this.tempRatingRange = [...this.filters.ratingRange];
                // Initialize the rating slider after the DOM updates.
                this.$nextTick(() => {
                    this.initializeRatingSlider();
                });
            }

            // Reset the search query to clear any previous searches.
            this.searchQuery = '';
            // Display the modal.
            this.showModal = true;
        },

        /**
         * Closes the currently open filter modal.
         */
        closeModal() {
            this.showModal = false;
        },

        /**
         * Clears the current selections within the modal.
         * - For 'rating' modal: No action since 'Clear' button is removed.
         * - For other modals: Clears all selected options.
         */
        clearModalSelection() {
            if (this.modalType === 'rating') {
                // No action needed as 'Clear' button is removed for rating filter
                return;
            } else {
                // Clear all selected values.
                this.tempSelectedValues = [];
            }
        },

        /**
         * Selects all options within the modal.
         * - For non-rating modals: Selects all available options.
         */
        selectAllModalSelection() {
            // Only applicable for non-rating modals
            this.tempSelectedValues = [...this.modalOptions];
        },

        /**
         * Resets the rating range to its default values.
         * This method is called when the 'Reset Range' button is clicked.
         */
        resetRatingRange() {
            this.tempRatingRange = [...this.defaultRatingRange];
            this.updateRatingSlider();
        },

        /**
         * Applies the user's selections from the modal to the centralized filter state.
         */
        applyModalSelection() {
            if (this.modalType === 'country') {
                // Update selected countries
                this.filters.countries = [...this.tempSelectedValues];
            } else if (this.modalType === 'roadType') {
                // Update selected road types
                this.filters.roadTypes = [...this.tempSelectedValues];
            } else if (this.modalType === 'rating') {
                // Update rating range
                this.filters.ratingRange = [...this.tempRatingRange].map(v => parseFloat(v.toFixed(1)));
            }

            // Hide the modal after applying selections
            this.showModal = false;

            // Re-apply filters to update the displayed routes on the map
            this.applyFilters();
        },

        /**
         * Triggers the export of filtered routes to a GPX file.
         * Calls the external exportToGPX function defined in gpxExport.js.
         */
        exportToGPX() {
            window.exportToGPX(this.getAllFilteredRoutesFlat());
        },

        /**
         * Retrieves all filtered routes in a flat array suitable for GPX export.
         * @returns {Array} Array of route objects.
         */
        getAllFilteredRoutesFlat() {
            const flatRoutes = [];
            for (const country in this.filteredRoutes) {
                if (this.filteredRoutes.hasOwnProperty(country)) {
                    for (const roadType in this.filteredRoutes[country]) {
                        if (this.filteredRoutes[country].hasOwnProperty(roadType)) {
                            flatRoutes.push(...this.filteredRoutes[country][roadType]);
                        }
                    }
                }
            }
            return flatRoutes;
        },

        /**
         * Initializes the noUiSlider for the rating filter modal.
         * Sets up the slider with current tempRatingRange and configures its appearance and behavior.
         */
        initializeRatingSlider() {
            const slider = document.getElementById('rating-slider');

            if (slider && !slider.noUiSlider) {
                noUiSlider.create(slider, {
                    start: this.tempRatingRange, // Initial slider range [min, max]
                    connect: true, // Display a colored bar between the handles
                    range: {
                        'min': this.defaultRatingRange[0],
                        'max': this.defaultRatingRange[1]
                    },
                    step: 0.1, // Slider increments
                    tooltips: [true, true], // Show tooltips on both handles
                    format: {
                        to: function (value) {
                            return value.toFixed(1); // Format slider values to one decimal place
                        },
                        from: function (value) {
                            return Number(value); // Parse slider values as numbers
                        }
                    },
                    pips: {
                        mode: 'values', // Show pips at specific values
                        values: [1, 2, 3, 4, 5], // Positions of pips
                        density: 100, // Controls the spacing between pips
                        format: {
                            to: function (value) {
                                return value.toFixed(1); // Label pips with one decimal place
                            }
                        }
                    }
                });

                // Update the tempRatingRange when the slider is moved.
                slider.noUiSlider.on('update', (values) => {
                    this.tempRatingRange = values.map(v => parseFloat(v));
                });
            }
        },

        /**
         * Updates the noUiSlider's handles to reflect the current tempRatingRange.
         * Useful for resetting the slider to default values or programmatically changing the range.
         */
        updateRatingSlider() {
            const slider = document.getElementById('rating-slider');
            if (slider && slider.noUiSlider) {
                slider.noUiSlider.set(this.tempRatingRange);
            }
        },

        /**
         * Compares two arrays for equality.
         * @param {Array} arr1
         * @param {Array} arr2
         * @returns {Boolean} True if arrays are equal, else false.
         */
        arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) return false;
            const sortedArr1 = [...arr1].sort();
            const sortedArr2 = [...arr2].sort();
            for (let i = 0; i < sortedArr1.length; i++) {
                if (sortedArr1[i] !== sortedArr2[i]) return false;
            }
            return true;
        }
    },
    watch: {
        /**
         * Watcher for countries filter.
         * Re-applies filters whenever the countries selection changes.
         */
        'filters.countries'(newVal, oldVal) {
            this.applyFilters();
        },

        /**
         * Watcher for road types filter.
         * Re-applies filters whenever the road types selection changes.
         */
        'filters.roadTypes'(newVal, oldVal) {
            this.applyFilters();
        },

        /**
         * Watcher for rating range filter.
         * Re-applies filters whenever the rating range changes.
         */
        'filters.ratingRange'(newVal, oldVal) {
            this.applyFilters();
        }
    },
    /**
     * Lifecycle hook called after the Vue instance has been mounted.
     * Initializes the map and fetches all route data.
     */
    mounted() {
        this.initMap();
        this.fetchAllData();
    }
}).mount('#app');