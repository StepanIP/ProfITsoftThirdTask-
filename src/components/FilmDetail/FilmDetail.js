// src/components/FilmDetail/FilmDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function FilmDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [film, setFilm] = useState(null);

    useEffect(() => {
        // TODO: Fetch film from backend if id is provided
    }, [id]);

    const handleSave = () => {
        // TODO: Save film to backend
        navigate('/films');
    };

    const handleCancel = () => {
        navigate('/films');
    };

    return (
        <div>
            {/* TODO: Render film details */}
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
    );
}

export default FilmDetail;