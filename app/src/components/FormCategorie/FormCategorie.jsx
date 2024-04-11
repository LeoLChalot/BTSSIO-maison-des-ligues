import { useForm } from 'react-hook-form';
import axios from 'axios';

const FormCategorie = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {

    // Here you can handle the data submission, such as sending it to an API endpoint
    const response = await axios.post(
      `http://${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}/m2l/boutique/categorie`,
      { data }
    )

    console.log(response.data)
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
