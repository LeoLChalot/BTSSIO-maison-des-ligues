import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
class Categorie {
  constructor(nom) {
    this.id_category = uuidv4()
    this.nom = nom
  }

  static async getAllCategories() {
    console.log('getAllCategories')
    try {
      const { data } = await axios.get(
        'http://192.168.1.35:3000/m2l/boutique/categories'
      )
      return data
    } catch (error) {
      console.error('Error retrieving categories:', error)
      throw error
    }
  }

  // Categorie
// ...

static async getCategoryById(id_categorie) {
  try {
    const { data } = await axios.get(
      `http://192.168.1.35:3000/m2l/boutique/categories?id=${id_categorie}`
    );
    console.log({ Categorie: data });

    // Retournez toutes les données de la catégorie
    return data.infos[0].nom;
  } catch (error) {
    console.error('Error retrieving category:', error);
    throw error;
  }
}

// ...


  static async getCategoryByName(nom) {
    try {
      const { data } = await axios.get(
        `http://192.168.1.35:3000/m2l/boutique/categories?nom=${nom}`
      )
      return data
    } catch (error) {
      console.error('Error retrieving category:', error)
      throw error
    }
  }

  static async addCategory(nom) {
    try {
      const { data } = await axios.post(
        'http://192.168.1.35:3000/m2l/boutique/categorie',
        { nom }
      )
      return data
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  }

  static async deleteCategory(id_category) {
    try {
      const { data } = await axios.delete(
        `http://192.168.1.35:3000/m2l/boutique/categorie/${id_category}`
      )
      return data
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }
}

export default Categorie
