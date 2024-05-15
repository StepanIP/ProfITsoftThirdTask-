// FilmList.js
import React, { useState, useEffect } from 'react';
import FilmItem from '../FilmItem/FilmItem';
import { Link } from 'react-router-dom';

function FilmList() {
    const [films, setFilms] = useState([]);

    useEffect(() => {
        // TODO: Fetch films from backend
    }, []);

    const handleDelete = (id) => {
        // TODO: Delete film from backend
        // TODO: Remove film from state
    };

    return (
        <div>
            {films.map(film => (
                <FilmItem key={film.id} film={film} onDelete={handleDelete} />
            ))}
            <Link to="/films/new">Add Film</Link>
        </div>
    );
}

export default FilmList;