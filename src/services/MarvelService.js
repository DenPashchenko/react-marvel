import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _baseUrl = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'dbda21f20f090270a370173079ee2473';
    const _baseOffsetForChars = 210;
    const _limitForChars = 9;
    const _baseOffsetForComics = 100;
    const _limitForComics = 8;

    const getAllCharacters = async (offset = _baseOffsetForChars) => {
        const response = await request(
            `${_baseUrl}characters?limit=${_limitForChars}&offset=${offset}&apikey=${_apiKey}`);
        return response.data.results.map(_transformCharacter);

    }

    const getCharacterById = async (id) => {
        const response = await request(`${_baseUrl}characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(response.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const response = await request(`${_baseUrl}characters?name=${name}&apikey=${_apiKey}`);
        return response.data.results.map(_transformCharacter);
    }

    const getAllComics = async (offset = _baseOffsetForComics) => {
        const response = await request(
            `${_baseUrl}comics?orderBy=issueNumber&limit=${_limitForComics}&offset=${offset}&apikey=${_apiKey}`);
        return response.data.results.map(_transformComic);
    }

    const getComicById = async (id) => {
        const response = await request(`${_baseUrl}comics/${id}?apikey=${_apiKey}`);
        return _transformComic(response.data.results[0]);
    }

    const _transformCharacter = (character) => {
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

    const _transformComic = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description || comic.textObjects[0]?.text || 'There is no description',
            price: comic.prices[0].price
				? `${comic.prices[0].price}$`
				: "not available",
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            language: comic.textObjects[0]?.language || 'en-us',
            pageCount: comic.pageCount ? `${comic.pageCount} p.` : 'No info about the number of pages'
        }
    }

    return { 
        loading, 
        error, 
        getAllCharacters, 
        getCharacterById, 
        getCharacterByName, 
        getAllComics, 
        getComicById, 
        clearError 
    }
}

export default useMarvelService;