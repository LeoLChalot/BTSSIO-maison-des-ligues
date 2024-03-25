import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types';
const ViewContext = createContext()

export const ViewProvider = ({ children }) => {
    const [view, setView] = useState(false)


    const updateView = (view) => {
        setView(view ? true : false)
    }

    return (
        <ViewContext.Provider value={{ view, updateView }}>
            {children}
        </ViewContext.Provider>
    )
}


export const useRender = () => {
    return useContext(ViewContext)
}


ViewProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };