const { SearchRepository } = require('../repositories');
const searchRepository = new SearchRepository();

class SearchService {
    async searchCities(query) {
        if (!query) return { suggestions: [] };
        const cities = await searchRepository.getCities(query);
        
        const suggestions = cities.map(city => {
            return `${city.name}, ${city.state} (${city.country})`;
        });
        
        return { suggestions: Array.from(new Set(suggestions)) };
    }

    async searchAirports(query) {
        if (!query) return { suggestions: [] };
        const airports = await searchRepository.getAirports(query);
        
        const suggestions = airports.map(airport => {
            const cityName = airport.City ? airport.City.name : 'Unknown City';
            return `${cityName} (${airport.code})`;
        });
        
        return { suggestions: Array.from(new Set(suggestions)) };
    }
}

module.exports = SearchService;
