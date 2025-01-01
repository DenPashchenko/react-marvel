import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

const setContent = (process, data, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return newItemLoading ? <Component data={data} /> : <Spinner />;
        case 'confirmed':
            return <Component data={data} />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [characters, setCharacters] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [listEnded, setListEnded] = useState(false);

    const { getAllCharacters, process, setProcess } = useMarvelService();
    const itemRefs = useRef([]);

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        setNewItemLoading(!initial);
        getAllCharacters(offset)
            .then(onCharsLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharsLoaded = (newCharacters) => {
        let isListEnded = false;
        if (newCharacters.length < 9) {
            isListEnded = true;
        }

        setCharacters(characters => [...characters, ...newCharacters]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setListEnded(isListEnded);
    }

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const charItems = characters.map((item, i) => {
        let imgStyle = { 'objectFit': 'cover' };
        if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = { 'objectFit': 'contain' };
        }

        return (
            <CSSTransition classNames="char__item" key={item.id} in={true} timeout={1000}>
                <li className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            </CSSTransition>
        )
    });

    const buttonStyle = { 'display': listEnded ? 'none' : 'block' };

    return (
        <div className="char__list">
            {setContent(process, charItems, View, newItemLoading)}
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

const View = ({ data }) => {
    return (
        <ul className="char__grid">
            <TransitionGroup component={null}>
                {data}
            </TransitionGroup>
        </ul>

    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;