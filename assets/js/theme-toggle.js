document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('theme-toggle');
  const body = document.body;

  const updateButton = () => {
    toggleButton.textContent = body.classList.contains('dark-mode')
      ? '☀️ Tema claro'
      : '🌙 Tema oscuro';
  };

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') body.classList.add('dark-mode');
  updateButton();

  toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateButton();
  });
});
