import app from './app.js';

const PORT: number = parseInt(String(process.env.PORT || 3000), 10);

app.listen(PORT, (): void => console.log(`Server running on port ${PORT}`));
