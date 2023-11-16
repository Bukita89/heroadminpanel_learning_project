

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров
import {useHttp} from '../../hooks/http.hook';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import store from '../../store';

import { heroAdded } from '../heroesList/heroesSlice';

import { selectAll } from '../heroesFilters/filtersSlice';

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState('');
    const [heroDesc, setHeroDesc] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    const dispatch = useDispatch();
    const {request} = useHttp();

    const renderFilters = (filters, status) => {

        if( status === 'loading' ){
            return <option>Загрузка фильтров...</option>
        } else if(status === 'error'){
            return <option>Произошла ошибка</option>
        };

        if( filters && filters.length !== 0 ){
            return filters.map(({slug, name}) => {
                if(slug === 'all') return;
                return <option value={slug} key={slug}>{name}</option>
            });
        }
    };

    const renderedFilterOptions = renderFilters(filters, filtersLoadingStatus);

    const onSubmitForm = (e) => {
        e.preventDefault();
        const hero = {
            id: uuidv4(),
            name: heroName,
            description: heroDesc,
            element: heroElement
        };
        request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(hero))
        .then(dispatch(heroAdded(hero)))
        .catch(err => console.log(err));

        setHeroName('');
        setHeroDesc('');
        setHeroElement('');
    };

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitForm}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    onChange={(e) => {setHeroName(e.target.value)}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    onChange={(e) => {setHeroDesc(e.target.value)}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    onChange={(e) => {setHeroElement(e.target.value)}}>
                    { filters ? renderedFilterOptions : <option >Я владею элементом...</option>}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;