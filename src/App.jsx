import { Typography, Button, FormGroup, FormControlLabel, Checkbox, Box, Slider, TextField, InputAdornment, Snackbar, Alert } from "@mui/material"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { nanoid } from "nanoid";
import { useEffect } from "react";

import { passwordStore } from "./utils/store";

function App() {
  const setPassword = passwordStore((state) => state.setPassword);
  const setAlert = passwordStore((state) => state.setAlert);
  const form = passwordStore((state) => state.form);
  const alert = passwordStore((state) => state.alert);
  const password = passwordStore((state) => state.password);
  const setStrength = passwordStore((state) => state.setStrength);
  const changeFieldForm = passwordStore((state) => state.changeFieldForm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  const generatePassword = () => {
    let pass = '';
    let str = '';
    const charts = {
      lowercase: 'qwertyuiopasdfghjklzxcvbnm',
      uppercase: 'QWERTYUIOPASDFGHJKLZXCVBNM',
      numbers: '0123456789',
      symbols: '!@#$%&_?/-~',
    };

    (form.isLowercase) && (str += charts.lowercase);
    (form.isUppercase) && (str += charts.uppercase);
    (form.isNumbers) && (str += charts.numbers);
    (form.isSymbols) && (str += charts.symbols);

    for (let i = 1; i <= form.passwordLen; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }

  const analyzePassword = () => {
    let score = 0;

    if (form.isLowercase) score += 1;
    if (form.isUppercase) score += 2;
    if (form.isSymbols) score += 2;
    if (form.isNumbers) score += 1;

    score *= form.passwordLen;

    return (score < 32) ? 1 : (
      (score < 64) ? 2 : (
        (score < 128) ? 3 : 4
      )
    )
  }

  const handleGenerate = () => {
    setPassword('');
    setStrength(null);
    setAlert({ ...alert, open: false });

    if (form.isLowercase || form.isUppercase || form.isNumbers || form.isSymbols) {
      generatePassword();
      setStrength(analyzePassword());
    } else {
      setAlert({ type: 'error', message: 'Генерация невозможна. Выберите хотя бы один из вариантов.', open: true });
    }

    analyzePassword();
  }

  const handleCopy = (text) => {
    text && navigator.clipboard.writeText(text)
      .then(() => {
        setAlert({
          type: 'success',
          message: 'Пароль успешно скопирован!',
          open: true,
        })
      })
      .catch(err => {
        setAlert({ type: 'error', message: `Ошибка при копировании: ${err}`, open: true });
      })
  }

  return (
    <>
      <Box component="section" sx={{ maxWidth: '25rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '1rem', textAlign: 'center', margin: '3rem auto' }}>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={alert.open}
          autoHideDuration={5000}
        >
          <Alert
            severity={alert.type}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        </Snackbar>

        <Typography variant="body1" sx={{ color: '#595861', }}>Генератор Паролей</Typography>

        <TextField
          hiddenLabel
          size="small"
          disabled
          value={password}
          sx={{
            backgroundColor: '#24232a', "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#fff", // Цвет текста
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <ContentCopyIcon
                  sx={{ color: '#a5ffaf', fontSize: '1.2rem', cursor: 'pointer' }}
                  onClick={() => handleCopy(password)}
                ></ContentCopyIcon>
              </InputAdornment>
            ),
          }}
        />

        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', backgroundColor: '#24232a', padding: '1rem 3rem' }}
        >
          <FormGroup>
            <FormControlLabel
              control={<Slider
                aria-label="Password Length"
                defaultValue={15}
                value={form.passwordLen}
                onChange={(e) => changeFieldForm('passwordLen', e.target.value)}
                valueLabelDisplay="auto"
                min={8}
                max={64}
              />}
              label="Количество Символов"
              sx={{
                flexDirection: 'column-reverse',
                alignItems: 'flex-start',
                color: '#dfdde5',
                fontSize: '.6rem',
                mb: '1rem',
              }}
            />

            <FLCComponent title="Включить Прописные Буквы" checked={form.isLowercase} onChange={(e) => changeFieldForm('isLowercase', e.target.checked)} />
            <FLCComponent title="Включить Заглавные Буквы" checked={form.isUppercase} onChange={(e) => changeFieldForm('isUppercase', e.target.checked)} />
            <FLCComponent title="Включить Цифры" checked={form.isNumbers} onChange={(e) => changeFieldForm('isNumbers', e.target.checked)} />
            <FLCComponent title="Включить Символы" checked={form.isSymbols} onChange={(e) => changeFieldForm('isSymbols', e.target.checked)} />
          </FormGroup>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: '#18171f', }}>
            <Typography variant="overline" sx={{ color: '#595861' }}>НАДЁЖНОСТЬ</Typography>
            <StrengthLevel />
          </Box>

          <Button
            color="primary"
            size="large"
            variant="contained"
            onClick={() => handleGenerate()}
          >
            {'СОЗДАТЬ ->'}
          </Button>
        </Box>
      </Box>
    </>
  )
}

const FLCComponent = ({ checked, onChange, title, }) => {
  return (
    <FormControlLabel
      control={<Checkbox
        checked={checked}
        onChange={onChange}
        sx={{
          '& .MuiSvgIcon-root': {
            color: '#a5ffaf',
          },
        }}
      />}
      label={title}
      sx={{
        color: '#dfdde5',
      }}
    />
  );
}

const StrengthLevel = () => {
  const strength = passwordStore((state) => state.strength);
  let bgColors = [
    { color: '#E32636', title: 'ПРОСТОЙ' },
    { color: '#ED760E', title: 'СРЕДНИЙ' },
    { color: '#f3cb6f', title: 'НОРМАЛЬНЫЙ' },
    { color: '#00FF7F', title: 'СЛОЖНЫЙ' },
  ];
  const styles = { border: '2px solid #dfdde5', borderRadius: '.1rem', padding: '.5rem .2rem' };

  return (
    <Box sx={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
      <Typography variant="body1" sx={{ color: '#dfdde5', }}>{bgColors[strength - 1]?.title || ''}</Typography>

      <Box sx={{ display: 'flex', gap: '.2rem' }}>
        {[1, 2, 3, 4].map((item, id) => <Box key={nanoid()} sx={(id < strength) ? { backgroundColor: bgColors[strength - 1].color, ...styles } : { backgroundColor: 'transparent', ...styles }}></Box>)}
      </Box>
    </Box>
  )
}

export default App
