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

   // fonction pour récupérer les catégories
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des catégories');
  }
};