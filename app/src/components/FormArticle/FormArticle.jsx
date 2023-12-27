import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './FormArticle.css';


const FormArticle = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const ls = localStorage

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/m2l/boutique/categorie');
        setCategories(data);
      } catch (error) {
        console.error('Error retrieving categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    if(data.photo){
      console.log(data.photo[0])
      formData.append('photo', data.photo[0]);
    }
    // formData.append('photo', data.photo[0]);

    Object.keys(data).forEach((key) => {
      if (key !== 'photo') {
        formData.append(key, data[key]);
      }
    });

    try {
      const {data} = await axios.post('http://localhost:3000/m2l/boutique/article', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear the form fields after successful submission
      Object.keys(data).forEach((key) => {
        setValue(key, "");
      });

      alert(data.message);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <label htmlFor="nom">Nom:</label>
      <input {...register('nom')} />
      <label htmlFor="description">Description:</label>
      <textarea {...register('description')} />
      <label htmlFor="prix">Prix:</label>
      <input type="number" {...register('prix')} step={0.01} />
      <label htmlFor="quantite">Quantité:</label>
      <input type="number" {...register('quantite')} />
      <label htmlFor="categorie">Catégorie:</label>
      <select {...register('categorie')} defaultValue={categories[0]?.id_categorie}>
        {categories.map((cat) => (
          <option key={cat.id_categorie} value={cat.id_categorie}>
            {cat.nom}
          </option>
        ))}
      </select>
      <input
        type="file"
        onChange={(e) => {
          setValue('photo', e.target.files);
        }}
      />
      <button type="submit">Ajouter l'article</button>
    </form>
  );
};

export default FormArticle;
