import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CharInfo = (props) => {

    const [character, setCharacter] = useState(null);

    const { loading, error, getCharacterById, clearError } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const onCharLoaded = (character) => {
        setCharacter(character);
    }

    const updateChar = () => {
        const { charId } = props;
        if (!charId) {
            return;
        }

        clearError();
        getCharacterById(charId)
            .then(onCharLoaded);
    }

    const skeleton = character || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !character)
        ? <View character={character} />
        : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({ character }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = character;
    function getComicId(resourceURI) {
        return resourceURI.slice(resourceURI.lastIndexOf('/') + 1);
    }

    let comicsView = 'There are no comics with this character';
    if (comics.length > 0) {
        comicsView = comics.map((item, i) => {
            if (i >= 10) {
                return;
            }

            return (
                <li key={i} className="char__comics-item">
                    <Link to={`/comics/${getComicId(item.resourceURI)}`}>
                        {item.name}
                    </Link>
                </li>
            )
        });
    }

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' };
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsView}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;