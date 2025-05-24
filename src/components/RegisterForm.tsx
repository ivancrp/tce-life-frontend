import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { RegisterUserData, ESTADO_CIVIL_OPTIONS, ESCOLARIDADE_OPTIONS, TIPO_SANGUINEO_OPTIONS, RACA_OPTIONS, GENDER_OPTIONS } from '../types';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid, Typography, Paper, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterUserData>({
    name: '',
    nomeSocial: '',
    email: '',
    password: '',
    cpf: '',
    dateOfBirth: new Date(),
    gender: '',
    naturalidade: '',
    nomeMae: '',
    nomePai: '',
    estadoCivil: '',
    escolaridade: '',
    telefone: '',
    celular: '',
    tipoSanguineo: '',
    raca: '',
    insurance: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: date
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await AuthService.register(formData);
      navigate('/login', { state: { message: 'Registro realizado com sucesso! Por favor, faça login.' } });
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar o registro. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Cadastro de Paciente
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Dados Pessoais */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Dados Pessoais
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="name"
              label="Nome Completo"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="nomeSocial"
              label="Nome Social"
              value={formData.nomeSocial}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="cpf"
              label="CPF"
              value={formData.cpf}
              onChange={handleChange}
              inputProps={{ maxLength: 11 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Nascimento"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Gênero</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gênero"
              >
                {GENDER_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="naturalidade"
              label="Naturalidade"
              value={formData.naturalidade}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="nomeMae"
              label="Nome da Mãe"
              value={formData.nomeMae}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="nomePai"
              label="Nome do Pai"
              value={formData.nomePai}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Estado Civil</InputLabel>
              <Select
                name="estadoCivil"
                value={formData.estadoCivil}
                onChange={handleChange}
                label="Estado Civil"
              >
                {ESTADO_CIVIL_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Escolaridade</InputLabel>
              <Select
                name="escolaridade"
                value={formData.escolaridade}
                onChange={handleChange}
                label="Escolaridade"
              >
                {ESCOLARIDADE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Contato */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Contato
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="email"
              type="email"
              label="E-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              label="Senha"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="telefone"
              label="Telefone Fixo"
              value={formData.telefone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="celular"
              label="Celular"
              value={formData.celular}
              onChange={handleChange}
            />
          </Grid>

          {/* Informações de Saúde */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Informações de Saúde
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Tipo Sanguíneo</InputLabel>
              <Select
                name="tipoSanguineo"
                value={formData.tipoSanguineo}
                onChange={handleChange}
                label="Tipo Sanguíneo"
              >
                {TIPO_SANGUINEO_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Raça/Cor</InputLabel>
              <Select
                name="raca"
                value={formData.raca}
                onChange={handleChange}
                label="Raça/Cor"
              >
                {RACA_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="insurance"
              label="Plano de Saúde"
              value={formData.insurance}
              onChange={handleChange}
            />
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error" align="center">
                {error}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Registrar'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RegisterForm; 