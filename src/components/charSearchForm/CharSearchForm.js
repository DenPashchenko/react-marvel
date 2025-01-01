import './charSearchForm.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const CharSearchForm = () => {
    const [character, setCharacter] = useState(null);
    const { getCharacterByName, clearError, process, setProcess } = useMarvelService();

    const onCharLoaded = (char) => {
        setCharacter(char);
    }

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    const errorMessage = process === 'error' ? <div className='char__search-critical-error'><ErrorMessage /></div> : null;
    const results = !character
        ? null
        : character.length > 0
            ?
            <div className='char__search-wrapper'>
                <div className='char__search-success'>There is! Would you like to visit {character[0].name} page?</div>
                <Link to={`/characters/${character[0].id}`} className='button button__secondary'>
                    <div className='inner'>To page</div>
                </Link>
            </div>
            :
            <div className='char__search-error'>
                The character was not found. Check the name and try again.
            </div>

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    charName: ''
                }}
                validationSchema={Yup.object({
                    charName: Yup.string()
                        .required('This field is required')
                        .min(2, 'The name must be longer than 1 letter')
                })}
                onSubmit={({ charName }) => {
                    updateChar(charName);
                }}>
                <Form>
                    <label className='char__search-label' htmlFor='charName'>Or find a character by name:</label>
                    <div className='char__search-wrapper'>
                        <Field
                            id='charName'
                            name='charName'
                            type='text'
                            placeholder='Enter name' />
                        <button
                            type='submit'
                            className='button button__main'
                            disabled={process === 'loading'}>
                            <div className='inner'>find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component='div' className='char__search-error' name='charName' />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharSearchForm;