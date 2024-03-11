import { Footer } from 'flowbite-react'

function FooterFlowbite() {
  return (


    <Footer class="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
      <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 | Léo Larou-Chalot | All Rights Reserved.
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="https://github.com/LeoLChalot/BTSSIO-maison-des-ligues/wiki" target="_blank" class="hover:underline me-4 md:me-6">Github - Wiki</a>
          </li>
          <li>
            <a href="https://github.com/LeoLChalot/BTSSIO-maison-des-ligues" target='_blank' class="hover:underline me-4 md:me-6">Github - Code source</a>
          </li>
          <li>
            <a href="https://leolchalot.github.io/larou-chalot-leo-portfolio/" target='_blank' class="hover:underline">Contact</a>
          </li>
        </ul>
      </div>
    </Footer>

    // <Footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
    //   <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
    //     <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    //     <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">Léo Larou-Chalot | © 2024 - Projet M2L - Repos <a href="https://github.com/LeoLChalot/BTSSIO-maison-des-ligues/wiki" className="hover:underline font-bold">Github</a>. All Rights Reserved.</span>
    //   </div>
    // </Footer >


  )
}

export default FooterFlowbite