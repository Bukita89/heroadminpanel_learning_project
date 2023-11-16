
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
import {useHttp} from '../../hooks/http.hook';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from '../spinner/Spinner';
import { activeFilterChanged, fetchFilters, selectAll} from './filtersSlice';
import store from '../../store';

const HeroesFilters = () => {

    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);

    const filters = selectAll(store.getState());

    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchFilters(request));

        // eslint-disable-next-line
    }, []);

    const renderFiltersButtons = (filters, status) => {

        if( status === 'loading' ){
            return <Spinner/>
        } else if(status === 'error'){
            return <span>Произошла ошибка</span>
        };

        if( filters && filters.length !== 0 ){
            return filters.map(({name, btn_color, slug}) => {
                const activeClass = slug === activeFilter ? ' active' : '';
                return <button className={`btn btn-${btn_color}${activeClass}`} onClick={() => dispatch(activeFilterChanged(slug))}>{name}</button>
            });
        }
    };

    const filterButtons = renderFiltersButtons(filters, filtersLoadingStatus);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filterButtons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;