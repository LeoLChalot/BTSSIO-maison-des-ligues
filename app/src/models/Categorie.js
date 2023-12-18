import axios from 'axios'
class Categorie {
  constructor(nom) {
    this.id_category = uuidv4()
    this.nom = nom
  }

  static async getAllCategories() {
    console.log('getAllCategories')
    try {
      const {data} = await axios.get(
        'http://localhost:3000/m2l/boutique/categorie'
      )
      return data
    } catch (error) {
      console.error('Error retrieving categories:', error)
      throw error
    }
  }

  static async getCategoryById(id_categorie) {
    try {
      const {data} = await axios.get(
        `http://localhost:3000/m2l/boutique/categorie/${id_categorie}`
      )
      return data
    } catch (error) {
      console.error('Error retrieving category:', error)
      throw error
    }
  }

  static async getCategoryByName(nom) {
    try {
      const {data} = await axios.get(
        `http://localhost:3000/m2l/boutique/categorie/${nom}`
      )
      return data
    } catch (error) {
      console.error('Error retrieving category:', error)
      throw error
    }
  }

  static async addCategory(nom) {
    try {
      const {data} = await axios.post(
        'http://localhost:3000/m2l/boutique/categorie',
        {nom}
      )
      return data
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  }

  static async deleteCategory(id_category) {
    try {
      const {data} = await axios.delete(
        `http://localhost:3000/m2l/boutique/categorie/${id_category}`
      )
      return data
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }
}

export default Categorie