import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Warning as WarningIcon } from '@mui/icons-material';
import api from '../services/api';

interface Medicamento {
    id: string;
    nome: string;
    fabricante: string;
    lote: string;
    quantidade: number;
    dataValidade: string;
}

const EstoqueMedicamentos: React.FC = () => {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [medicamentosProximosVencimento, setMedicamentosProximosVencimento] = useState<Medicamento[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<'nome' | 'fabricante'>('nome');
    const [novoMedicamento, setNovoMedicamento] = useState<Partial<Medicamento>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        carregarMedicamentos();
        verificarVencimentoProximo();
    }, []);

    const carregarMedicamentos = async () => {
        try {
            const response = await api.get('/medicamentos/relatorio');
            setMedicamentos(response.data.medicamentos);
            setMedicamentosProximosVencimento(response.data.medicamentosProximosVencimento);
        } catch (error) {
            setError('Erro ao carregar medicamentos');
        }
    };

    const verificarVencimentoProximo = async () => {
        try {
            const response = await api.get('/medicamentos/vencimento');
            setMedicamentosProximosVencimento(response.data);
        } catch (error) {
            setError('Erro ao verificar medicamentos próximos do vencimento');
        }
    };

    const handleSearch = async () => {
        try {
            const endpoint = searchType === 'nome' ? '/medicamentos/nome' : '/medicamentos/fabricante';
            const response = await api.get(endpoint, { params: { [searchType]: searchTerm } });
            setMedicamentos(response.data);
        } catch (error) {
            setError('Erro ao buscar medicamentos');
        }
    };

    const handleCadastrarMedicamento = async () => {
        try {
            await api.post('/medicamentos', novoMedicamento);
            setOpenDialog(false);
            setNovoMedicamento({});
            carregarMedicamentos();
        } catch (error) {
            setError('Erro ao cadastrar medicamento');
        }
    };

    const handleAtualizarEstoque = async (id: string, quantidade: number) => {
        try {
            await api.put(`/medicamentos/${id}/estoque`, { quantidade });
            carregarMedicamentos();
        } catch (error) {
            setError('Erro ao atualizar estoque');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Controle de Estoque de Medicamentos
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {medicamentosProximosVencimento.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <WarningIcon sx={{ mr: 1 }} />
                        Existem {medicamentosProximosVencimento.length} medicamentos próximos do vencimento
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Buscar medicamento"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setSearchType('nome')}
                            color={searchType === 'nome' ? 'primary' : 'inherit'}
                        >
                            Por Nome
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setSearchType('fabricante')}
                            color={searchType === 'fabricante' ? 'primary' : 'inherit'}
                        >
                            Por Fabricante
                        </Button>
                    </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Cadastrar Medicamento
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Fabricante</TableCell>
                                <TableCell>Lote</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Data de Validade</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {medicamentos.map((medicamento) => (
                                <TableRow key={medicamento.id}>
                                    <TableCell>{medicamento.nome}</TableCell>
                                    <TableCell>{medicamento.fabricante}</TableCell>
                                    <TableCell>{medicamento.lote}</TableCell>
                                    <TableCell>{medicamento.quantidade}</TableCell>
                                    <TableCell>
                                        {new Date(medicamento.dataValidade).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            onClick={() => handleAtualizarEstoque(medicamento.id, 1)}
                                        >
                                            +1
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => handleAtualizarEstoque(medicamento.id, -1)}
                                        >
                                            -1
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Cadastrar Novo Medicamento</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Nome"
                            value={novoMedicamento.nome || ''}
                            onChange={(e) => setNovoMedicamento({ ...novoMedicamento, nome: e.target.value })}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Fabricante"
                            value={novoMedicamento.fabricante || ''}
                            onChange={(e) => setNovoMedicamento({ ...novoMedicamento, fabricante: e.target.value })}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Lote"
                            value={novoMedicamento.lote || ''}
                            onChange={(e) => setNovoMedicamento({ ...novoMedicamento, lote: e.target.value })}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Quantidade"
                            type="number"
                            value={novoMedicamento.quantidade || ''}
                            onChange={(e) => setNovoMedicamento({ ...novoMedicamento, quantidade: parseInt(e.target.value) })}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Data de Validade"
                            type="date"
                            value={novoMedicamento.dataValidade || ''}
                            onChange={(e) => setNovoMedicamento({ ...novoMedicamento, dataValidade: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                        <Button onClick={handleCadastrarMedicamento} variant="contained">
                            Cadastrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default EstoqueMedicamentos; 