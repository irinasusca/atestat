fetch('https://atestat.onrender.com/api')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)