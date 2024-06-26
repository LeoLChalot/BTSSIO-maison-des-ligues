import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './FormArticle.css'
import {
  Button,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from 'flowbite-react'
import {useAuth} from "../../hooks/useAuth";


const FormArticle = () => {
  const { register, handleSubmit, setValue } = useForm()
  const [categories, setCategories] = useState([])
  const [rerender, setRerender] = useState(false)
const {token} = useAuth();
console.log(useAuth());

  const baseUrl = `${JSON.stringify(import.meta.env.VITE_API_URL).replaceAll('"', '')}`

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/boutique/categories/all`
        )
        setCategories(data.infos.categories)
      } catch (error) {
        console.error('Error retrieving categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const onSubmit = async (data) => {
    const formData = new FormData()
    if (data.photo) {
      console.log(data.photo[0])
      formData.append('photo', data.photo[0])
    }

    // formData.append('photo', data.photo[0]);

    Object.keys(data).forEach((key) => {
      if (key !== 'photo') {
        formData.append(key, data[key])
      }
    })
	
    try {
      const { data } = await axios.post(
        `${baseUrl}/admin/article`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
	    'Authorization': `Bearer ${token}`
          },
        }
      )

      Object.keys(data).forEach((key) => {
        setValue(key, '')
      })
      alert(data.message)
      setRerender(!rerender)
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error)
    }
  }


  return (
    <form
      className="form"
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
    >
      <Label htmlFor="nom" value="Nom" />
      <TextInput {...register('nom')} required />
      <Label htmlFor="description" value="description" />
      <Textarea {...register('description')} required />
      <Label htmlFor="prix" value="Prix" />
      <TextInput type="number" {...register('prix')} step={0.01} required />
      <Label htmlFor="quantite" value="Quantité" />
      <TextInput type="number" {...register('quantite')} required />
      <Label htmlFor="categorie" value="Catégorie" />
      <Select
        {...register('categorie')}
        defaultValue={categories[0]?.id}
        required
      >
        {categories.map((categorie) => (
          <option key={categorie.id} value={categorie.id}>
            {categorie.nom}
          </option>
        ))}
      </Select>
      <FileInput
        type="file"
        onChange={(e) => {
          setValue('photo', e.target.files)
        }}
        required
      />
      <Button type="submit">Ajouter l&apos;article</Button>
    </form>
  )
}

export default FormArticle
