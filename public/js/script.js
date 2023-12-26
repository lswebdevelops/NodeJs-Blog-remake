document.addEventListener('DOMContentLoaded',  ()=> {
    const allButtons = document.querySelectorAll('.searchBtn')
    const searchBar = document.querySelector('.searchBar')
    const searchBtn = document.querySelector('.searchBtn')
    const searchInput = document.getElementById('searchInput')
    const searchClose = document.getElementById('searchClose')

    for(let i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', () => {
            searchBar.style.visibility = 'visible';
            searchBtn.style.visibility = 'hidden';
            searchBar.classList.add('open')
            this.setAttribute('aria-expanded', 'true')
            searchInput.focus();
        })
    }
    
    searchClose.addEventListener('click', () => {
        searchBar.style.visibility = 'hidden';
        searchBtn.style.visibility = 'visible';
            searchBar.classList.remove('open')
            this.setAttribute('aria-expanded', 'false')
            
        })
 

})