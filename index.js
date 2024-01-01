import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  // If the name parameter is present in the query string, fetch the joke
  if (req.query.name) {
    return res.redirect(`/getJoke/${req.query.name}`);
  }

  res.render('index');
});

app.get('/getJoke/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const apiResponse = await axios.get(
      `https://v2.jokeapi.dev/joke/Any?type=single&contains=${name}`
    );

    console.log('API Response:', apiResponse.data);

    if (apiResponse.data.error) {
      throw new Error(apiResponse.data.error);
    }

    const joke = apiResponse.data.joke;

    console.log('Name:', name);
    console.log('Joke:', joke);

    res.render('joke', { name, joke });
  } catch (error) {
    console.error('Error:', error.message);
    res.render('error', { error: 'Failed to fetch a joke. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
