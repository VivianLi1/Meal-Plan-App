const API_KEY = "87eae80801d542f3848a76c8eed5a462";
const url = `https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2`
const mediaQuery = '(max-width: 1024px)';


document.addEventListener('DOMContentLoaded', () => {
    addNavBarBurgerItems();
    addPageNav();
    addFilterMenuButtonListener();
    addFilterButtonsListener();
});

function addNavBarBurgerItems(){
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
    
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);    
    
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
    
            });
        });
        
        const mediaQueryList = window.matchMedia(mediaQuery);
        mediaQueryList.addEventListener('change', event => {
            let slash = document.getElementById("slash");
            if (event.matches) {
                slash.style.display = "none";
            } else {
                slash.style.display = "";
            }
        });
    }
}

function addPageNav(){
    let home = document.getElementById("HomePage");
    let recipes = document.getElementById("RecipesPage");
    let menu = document.getElementById("MenuPage");

    document.getElementById("homeButton").addEventListener("click", () =>{
        recipes.style.display = "none";
        menu.style.display = "none";
        home.style.display = "block";
    });

    document.getElementById("recipesButton").addEventListener("click", () =>{
        recipes.style.display = "block";
        menu.style.display = "none";
        home.style.display = "none";
    });

    document.getElementById("menuButton").addEventListener("click", () =>{
        recipes.style.display = "none";
        menu.style.display = "block";
        home.style.display = "none";
    });
}

function addFilterMenuButtonListener(){
    let filterButton = document.getElementById("filterButton");
    let filterItems = filterButton.nextElementSibling;
    let caret = filterButton.firstElementChild;
    filterButton.addEventListener("click", (event) =>{
        filterItems.classList.toggle('open');
        caret.classList.toggle('open-caret');
        event.preventDefault();
        event.stopPropagation();
        document.addEventListener("click", ()=> {
            filterItems.classList.remove('open');
            caret.classList.remove('open-caret');
        });
    });
}

function addFilterButtonsListener(){
    let restrictions = document.getElementById("filterRestrictions");
    let diets = document.getElementById("filterDiets");
    let cuisines = document.getElementById("filterCuisines");

    document.getElementById("filterRestrictionsButton").addEventListener("click", ()=>{
        restrictions.style.display = "block";
        diets.style.display = "none";
        cuisines.style.display = "none";
    });
    document.getElementById("filterDietsButton").addEventListener("click", ()=>{
        restrictions.style.display = "none";
        diets.style.display = "block";
        cuisines.style.display = "none";
    });
    document.getElementById("filterCuisinesButton").addEventListener("click", ()=>{
        restrictions.style.display = "none";
        diets.style.display = "none";
        cuisines.style.display = "block";
    });
}