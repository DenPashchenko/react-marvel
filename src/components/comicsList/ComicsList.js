import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(100);
    const [listEnded, setListEnded] = useState(false);

    const { getAllComics, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        setNewItemLoading(!initial);
        getAllComics(offset)
            .then(onComicsLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onComicsLoaded = (newComics) => {
        let isListEnded = false;
        if (newComics.length < 8) {
            isListEnded = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setListEnded(isListEnded);
    }

    function renderItems(arr) {
        const comicItems = arr.map((item, i) => {
            return (
                <li className="comics__item"
                    key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {comicItems}
            </ul>
        )
    }

    const buttonStyle = { 'display': listEnded ? 'none' : 'block' };

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comics), newItemLoading)}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={buttonStyle}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;