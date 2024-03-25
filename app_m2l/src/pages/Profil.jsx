import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { useAuth } from '../hooks/useAuth';
import TimelineFlowbite from '../components/Timeline/Timeline';

const Profil = () => {
  const { isLoggedIn, mail, isAdmin, pseudo, updateState } = useAuth()
  const navigate = useNavigate()

  const commandes = [
    { date: '2022-02-26', prix: 5.99 },
    { date: '2022-02-18', prix: 19.99 },
    { date: '2022-02-03', prix: 3.99 },
    { date: '2022-01-28', prix: 12.99 },
    { date: '2022-01-14', prix: 17.99 },
  ]


  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connexion')
    }

  }, [isLoggedIn, navigate])

  return (
    <div className='container'>
      <h1 className='text-3xl text-center font-bold'>Salut {pseudo} !</h1>
      <h3 className='text-xl text-center'>Content de vous voir !</h3>
      {/* <div className="grid grid-cols-2">
        <div className="bg-white rounded-xl">
          <h2 className="text-2xl font-bold">Informations personnelles</h2>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Pseudo :</span>
            <span>{pseudo}</span>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Modifier
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <span className="font-semibold">Adresse email :</span>
            <span>{mail}</span>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Modifier
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl">
          <h2 className="text-2xl font-bold">Historique des achats</h2>
          <TimelineFlowbite commandes={commandes} />
        </div>
      </div> */}
    </div>
  )
}

export default Profil
