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

  static async getCategoryById(id_categorie) {}

  static async getCategoryByName(nom) {}

  static async addCategory(nom) {}

  static async deleteCategory(id_category) {}
}

export default Categorie