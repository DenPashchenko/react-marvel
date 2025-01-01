import './singleComicPage.scss';
import useMarvelService from '../../../services/MarvelService';
import AppBanner from '../../appBanner/AppBanner';
import setContent from '../../../utilities/setContent';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet";

const SingleComicPage = () => {
    const { id } = useParams();
    const [comic, setComic] = useState(null);
    const { getComicById, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [id])

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const updateComic = () => {
        clearError();
        getComicById(id)
            .then(onComicLoaded)
            .then(() => setProcess('confirmed'));
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, comic, View)}
        </>
    )
}

const View = ({ data }) => {
    const { title, description, pageCount, thumbnail, language, price } = data;

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} comics book`}
                />
                <title>{title}</title>
            </Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all comics</Link>
        </div>
    )
}

export default SingleComicPage;