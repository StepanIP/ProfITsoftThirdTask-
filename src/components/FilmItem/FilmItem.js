// FilmItem.js
import React from 'react';
import { Link } from 'react-router-dom';

function FilmItem({ film, onDelete }) {
    return (
        <div>
            <h2>{film.title}</h2>
            <p>{film.year}</p>
            <Link to={`/films/${film.id}`}>Details</Link>
            <button onClick={() => onDelete(film.id)}>Delete</button>
        </div>
    );
}

export default FilmItem;