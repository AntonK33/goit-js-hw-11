const axios = require('axios').default;
export { axiosRequest };
const pageSize = 40;
    let currentPage = 1;
const API_KEY = "32831732-fbbeddb34dab056c70c27a61e";   
function axiosRequest(query, currentPage) {    
    return axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${query}&per_page=${pageSize}&page=${currentPage}&image_type=photo&orientation=horizontal&safesearch=true`)    
}