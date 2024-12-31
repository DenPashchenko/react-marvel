import './singleCharacterPage.scss';
import useMarvelService from '../../../services/MarvelService';
import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import AppBanner from '../../appBanner/AppBanner';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from "react-helmet";

const SingleCharacterPage = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const { loading, error, getCharacterById, clearError } = useMarvelService();

    useEffect(() => {
        updateCharacter();
    }, [id])

    const onCharLoaded = (char) => {
        setCharacter(char);
    }

    const updateCharacter = () => {
        clearError();
        getCharacterById(id)
            .then(onCharLoaded);
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !character)
        ? <View character={character} />
        : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({ character }) => {
    const { name, description, thumbnail } = character;

    return (
        <div className="single-char">
            <Helmet>
                <meta
                    name="description"
                    content={`Info about ${name}`}
                />
                <title>{`About ${name}`}</title>
            </Helmet>
            <img src={thumbnail} alt={name} className="single-char__img" />
            <div className="single-char__info">
                <h2 className="single-char__name">{name}</h2>
                <p className="single-char__descr">{description}</p>
            </div>
        </div>
    )
}

export default SingleCharacterPage;