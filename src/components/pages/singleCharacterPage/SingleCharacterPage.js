import './singleCharacterPage.scss';
import useMarvelService from '../../../services/MarvelService';
import AppBanner from '../../appBanner/AppBanner';
import setContent from '../../../utilities/setContent';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from "react-helmet";

const SingleCharacterPage = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const { getCharacterById, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateCharacter();
    }, [id])

    const onCharLoaded = (char) => {
        setCharacter(char);
    }

    const updateCharacter = () => {
        clearError();
        getCharacterById(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, character, View)}
        </>
    )
}

const View = ({ data }) => {
    const { name, description, thumbnail } = data;

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