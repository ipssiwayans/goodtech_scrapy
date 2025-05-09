   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:5000',
   });

   export const fetchAllArticles = async () => {
     try {
       const response = await api.get('/articles');
       return response.data.articles;
     } catch (error) {
       throw new Error('Erreur lors de la récupération des articles');
     }
   };