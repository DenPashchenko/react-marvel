class MarvelService {
    _baseUrl = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'dbda21f20f090270a370173079ee2473';
    _baseOffset = 210;

    getResource = async (url) => {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }

        return await response.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const response = await this.getResource(`${this._baseUrl}characters?limit=9&offset=${offset}&apikey=${this._apiKey}`);
        return response.data.results.map(this._transformCharacter);
            
    }

    getCharacterById = async (id) => {
        const response = await this.getResource(`${this._baseUrl}characters/${id}?apikey=${this._apiKey}`);
        return this._transformCharacter(response.data.results[0]);
    }

    _transformCharacter = (character) => {
        return {
            id: character.id,
            name: character.name,
            description: character.description,
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items
        }
    }
}

export default MarvelService;