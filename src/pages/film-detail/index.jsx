import React, {useEffect, useState} from 'react';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";
import {Link, useLocation, useParams, useNavigate} from "react-router-dom";
import {
    interfaceFilterBack,
    interfaceFilterCancel, interfaceFilterEdit,
    interfaceFilterSave,
    interfaceLagsActors, interfaceLagsDirector,
    interfaceLagsFilmName,
    interfaceLagsGenres,
    interfaceLagsYear
} from "../../misc/constants/localization";

const FilmDetail = ({film, onSave, onCancel}) => {
    const [editMode, setEditMode] = useState(false);
    const [editedFilm, setEditedFilm] = useState({...film});
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const lang = searchParams.get('lang');
    console.log(editedFilm)

    const navigate = useNavigate();

    const [filmData, setFilmData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams()

    console.log(filmData)

    useEffect(() => {
        fetch(`http://localhost:8081/api/film/${id}`)
            .then(response => response.json())
            .then(data => {
                setFilmData(data);
                setEditedFilm(data);
            })
            .catch(error => {
                console.error('Error:', error);
                console.log(error);
            });
    }, [isLoading, id]);

    const handleSave = () => {
        const filmToSave = {
            ...editedFilm,
            director: editedFilm.director.name
        };
        console.log(editedFilm);
        fetch(`http://localhost:8081/api/film/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filmToSave),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setFilmData(data);
                setEditedFilm(data);
                setEditMode(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleChange = (event) => {
        let value = event.target.value;
        if (event.target.name === 'actors' || event.target.name === 'genres') {
            value = value.split(',').map(name => ({ name: name.trim() }));
        } else if (event.target.name === 'director') {
            value = { name: value.trim() };
        }
        setEditedFilm({...editedFilm, [event.target.name]: value});
    };

    const handleCancel = () => {
        setEditedFilm(filmData);
        setFilmData(filmData);
        setEditMode(false);
        if (onCancel) onCancel();
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    return (
        <div>
            {editMode ? (
                <div>
                    {filmData ? (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>{interfaceLagsFilmName[lang]}</TableCell>
                                        <TableCell>{interfaceLagsYear[lang]}</TableCell>
                                        <TableCell>{interfaceLagsDirector[lang]}</TableCell>
                                        <TableCell>{interfaceLagsActors[lang]}</TableCell>
                                        <TableCell>{interfaceLagsGenres[lang]}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell><TextField
                                            name={'title'}
                                            value={editedFilm.title} onChange={handleChange}/></TableCell>
                                        <TableCell><TextField
                                            name={'year'}
                                            value={editedFilm.year} onChange={handleChange}/></TableCell>
                                        <TableCell><TextField
                                            name={'director'}
                                            value={editedFilm.director.name} onChange={handleChange}/></TableCell>
                                        <TableCell><TextField
                                            name={'actors'}
                                            value={Array.isArray(editedFilm.actors) ? editedFilm.actors.map(actor => actor.name).join(', ') : ''}
                                            onChange={handleChange}/></TableCell>
                                        <TableCell><TextField
                                            name={'genres'}
                                            value={Array.isArray(editedFilm.genres) ? editedFilm.genres.map(genre => genre.name).join(', ') : ''}
                                            onChange={handleChange}/></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            ) : (
                <div>
                    {filmData ? (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>{interfaceLagsFilmName[lang]}</TableCell>
                                        <TableCell>{interfaceLagsYear[lang]}</TableCell>
                                        <TableCell>{interfaceLagsDirector[lang]}</TableCell>
                                        <TableCell>{interfaceLagsActors[lang]}</TableCell>
                                        <TableCell>{interfaceLagsGenres[lang]}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>{filmData.title}</TableCell>
                                        <TableCell>{filmData.year}</TableCell>
                                        <TableCell>{filmData.director.name}</TableCell>
                                        <TableCell>{filmData.actors.map(
                                            actor => actor.name
                                        ).join(', ')}</TableCell>
                                        <TableCell>{filmData.genres.map(
                                            genre => genre.name
                                        ).join(', ')}</TableCell>
                                    </TableRow>
                                    </TableBody>
                                        </Table>
                        </TableContainer>
                        ) : (
                        <p>Loading...</p>
                        )}
                </div>
                )}

            {editMode ? (
                <div>
                    <Button onClick={handleSave}>{interfaceFilterSave[lang]}</Button>
                    <Button onClick={handleCancel}>{interfaceFilterCancel[lang]}</Button>
                </div>
            ) : (
                <Button onClick={handleEdit}>{interfaceFilterEdit[lang]}</Button>
            )}
            <Button onClick={() => navigate('/films')}>{interfaceFilterBack[lang]}</Button>
        </div>

);
};

export default FilmDetail;