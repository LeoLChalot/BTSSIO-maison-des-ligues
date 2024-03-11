import React from 'react';
import { useForm } from 'react-hook-form';
import Categorie from '../../models/Categorie';
const FormCategorie = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Here you can handle the data submission, such as sending it to an API endpoint
    Categorie.addCategory(data.categorie)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Error adding category:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="categorie">Catégorie:</label>
      <input type="text" {...register('categorie')} required />

      <button type="submit">Ajouter</button>
    </form>
  );
};

export default FormCategorie;
