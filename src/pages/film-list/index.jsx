import React, {useState, useEffect, useRef} from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton, styled, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, TextField, Box
} from '@mui/material';
import {Link, useLocation} from "react-router-dom";
import {
    interfaceFilter, interfaceFilterApply, interfaceFilterCancel, interfaceFilterField, interfaceFilterMessages,
    interfaceLagsActors, interfaceLagsAdd, interfaceLagsApplyFilter, interfaceLagsCancel, interfaceLagsDisplayedRows,
    interfaceLagsFilmName,
    interfaceLagsGenres, interfaceLagsPages, interfaceLagsRowsPerPage, interfaceMessages
} from "../../misc/constants/localization";

const DeleteButton = styled('img')({
    width: '25px',
    height: '25px',
});

const TableRowStyled = styled(TableRow)({
    paddingLeft: '10px',
});

const FilmList = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const lang = searchParams.get('lang');

    const [entities, setEntities] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [filterData, setFilterData] = useState({
        title: '',
        actors: [],
        genres: [],
    });
    const [showDeleteButton, setShowDeleteButton] = useState(null);

    const currentPage = useRef(0);
    console.log(currentPage.current)

    useEffect(() => {
        fetch('http://localhost:8081/api/film/films')
            .then(response => response.json())
            .then(data => setEntities(data))
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
        ;
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8081/api/film/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filterData)
            });

            if (response.ok) {
                const result = await response.json();
                setEntities(result);
                console.log('Success:', result);
                handleCloseDialog();
            } else {
                console.error('Error:', response.statusText);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };



    const handleDelete = (id) => {
        fetch(`http://localhost:8081/api/film/${id}`, {method: 'DELETE'})
            .then(() => {
                setEntities(entities.filter(entity => entity.id !== id));
            });
        setOpenDialog(false);
    };

    const handleOpenDialog = (film) => {
        setSelectedFilm(film);
        setOpenDialog(true);
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChangePage = (event, newPage) => {
        currentPage.current = newPage;
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        currentPage.current=0
    };

    const handleAdd = () => {
        // Handle add entity
    };

    const handleOpenFilterDialog = () => {
        setOpenFilterDialog(true);
    };

    const handleCloseFilterDialog = () => {
        setOpenFilterDialog(false);
    };

    const handleFilterChange = (event) => {
        let value = event.target.value;
        if (event.target.name === 'actors' || event.target.name === 'genres') {
            value = value.split(',').map(item => item.trim());
        }
        setFilterData({ ...filterData, [event.target.name]: value });
    };

    console.log(filterData)

    if(isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>{interfaceLagsFilmName[lang]}</TableCell>
                            <TableCell>{interfaceLagsActors[lang]}</TableCell>
                            <TableCell>{interfaceLagsGenres[lang]}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entities.slice(currentPage.current * rowsPerPage, currentPage.current * rowsPerPage + rowsPerPage).map((entity) => (
                            <TableRowStyled key={entity.id}
                                            onMouseEnter={() => setShowDeleteButton(entity.id)}
                                            onMouseLeave={() => setShowDeleteButton(null)}>

                                <TableCell sx={{padding: '0px', display: 'flex', justifyContent: 'center'}}>
                                    {showDeleteButton === entity.id && (
                                        <IconButton onClick={() => handleOpenDialog(entity)}>
                                            <DeleteButton
                                                src={'https://w7.pngwing.com/pngs/616/710/png-transparent-rubbish-bins-waste-paper-baskets-recycling-bin-computer-icons-trash-miscellaneous-recycling-logo-thumbnail.png'}/>
                                        </IconButton>
                                    )}
                                </TableCell>

                                <TableCell><Link to={`/films/${entity.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {entity.title}
                                </Link></TableCell>

                                <TableCell><Link to={`/films/${entity.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{entity.actors.map(
                                    actor => actor.name
                                ).join(', ')}
                                </Link></TableCell>

                                <TableCell><Link to={`/films/${entity.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{entity.genres.map(
                                    actor => actor.name
                                ).join(', ')}
                                </Link></TableCell>
                            </TableRowStyled>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{width: '93%', display: 'flex', justifyContent: 'end', gap: '20px'}}>
                <Button onClick={handleAdd}>{interfaceLagsAdd[lang]}</Button>
                <Button onClick={handleOpenFilterDialog}>{interfaceFilter[lang]}</Button>

                <TablePagination
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${interfaceLagsDisplayedRows?.[lang]} ${count}`}
                    labelRowsPerPage={interfaceLagsRowsPerPage[lang]}
                    component="div"
                    count={entities.length}
                    page={currentPage.current}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />



            </div>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    style: {
                        width: '600px',
                        height: '150px',
                        display: 'flex',
                        alignContent: 'center',
                        alignItems: 'center',
                    },
                }}
            >
                <DialogTitle>
                    {interfaceMessages[lang]} "{selectedFilm?.title}"?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        {interfaceLagsCancel[lang]}
                    </Button>
                    <Button onClick={() => handleDelete(selectedFilm?.id)} color="primary">
                        {interfaceLagsApplyFilter[lang]}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openFilterDialog}
                onClose={handleCloseFilterDialog}
                PaperProps={{
                    style: {
                        width: '600px',
                        height: '370px',
                    },
                }}
            >

                <DialogTitle >
                    {interfaceFilterMessages[lang]}
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} gap={'20px'} flexDirection={'column'} paddingTop={'20px'}>
                    <TextField
                        name="title"
                        label={interfaceFilterField[lang] + ' ' + interfaceLagsFilmName[lang]}
                        value={filterData.title}
                        onChange={handleFilterChange}
                    />
                    <TextField
                        name="actors"
                        label={interfaceFilterField[lang] + ' ' + interfaceLagsActors[lang]}
                        value={filterData.actors}
                        onChange={handleFilterChange}
                    />
                    <TextField
                        name="genres"
                        label={interfaceFilterField[lang] + ' ' + interfaceLagsGenres[lang]}
                        value={filterData.genres}
                        onChange={handleFilterChange}
                    />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFilterDialog}>
                        {interfaceFilterCancel[lang]}
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {interfaceFilterApply[lang]}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default FilmList;