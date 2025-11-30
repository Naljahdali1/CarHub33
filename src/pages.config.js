import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import CarDetails from './pages/CarDetails';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "SearchResults": SearchResults,
    "CarDetails": CarDetails,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};