import React, { useState } from 'react';

const SearchLocationInput = () => {
    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState([]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);

        // Create a new instance of google.maps.places.AutocompleteService
        const autocompleteService = new window.google.maps.places.AutocompleteService();

        // Use AutocompleteService to get predictions based on the input value
        autocompleteService.getPlacePredictions(
            {
                input: inputValue,
                componentRestrictions: { country: 'VN' } // Restrict predictions to Vietnam
            },
            (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setPredictions(predictions);
                } else {
                    setPredictions([]);
                }
            }
        );
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter a location"
                value={query}
                onChange={handleInputChange}
            />
            <ul>
                {predictions.map((prediction) => (
                    <li key={prediction.place_id}>{prediction.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchLocationInput;
