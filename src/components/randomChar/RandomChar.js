import './randomChar.scss';
import useMarvelService from '../../services/MarvelService';
import mjolnir from '../../resources/img/mjolnir.png';
import setContent from '../../utilities/setContent';
import { useState, useEffect } from 'react';

const RandomChar = () => {

    const [character, setCharacter] = useState({});

    const textLimit = 185;
    const emptyDescriptionText = 'Description not defined.';

    const { getCharacterById, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [])

    const _beautifyDescription = (desc) => {
        if (desc == '') {
            return emptyDescriptionText;
        }

        if (desc.length >= textLimit) {
            return desc.slice(0, textLimit - 3) + '...';
        }

        return desc;
    }

    const onCharLoaded = (character) => {
        const description = _beautifyDescription(character.description);

        character.description = description;
        setCharacter(character);
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacterById(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    return (
        <div className="randomchar">
            {setContent(process, character, View)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button
                    className="button button__main"
                    onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )
}

const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki } = data;

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' };
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character"
                className="randomchar__img" style={imgStyle} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;