const APP_KEY = "4eb0f6bbfbecb2a6875d5652e7f76a48";
const APP_ID = "f4b3de52";

const mediaQuery = '(max-width: 1024px)';

document.addEventListener('DOMContentLoaded', () => {
    addNavBarBurgerItems();
    addPageNav();
    addFilterMenuButtonListener();
    addFilterButtonsListeners();
    document.getElementById("searchButton").addEventListener("click", ()=>{
        getRecipes();
    })
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

function addFilterButtonsListeners(){
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

function getFilterValues(){
    let healthArr = [];
    let mealArr = [];
    let cuisineArr = [];

    let checkedItems = document.querySelectorAll('input[type=checkbox]:checked');
    checkedItems.forEach(item =>{
        if(item.classList.contains("restrictions")){
            healthArr.push(item.ariaLabel);
        }else if(item.classList.contains("meals")){
            mealArr.push(item.ariaLabel);
        }else if(item.classList.contains("cuisines")){
            cuisineArr.push(item.ariaLabel);
        }
    })

    console.log(healthArr);
    console.log(mealArr);
    console.log(cuisineArr);

    return{
        healthArr,
        mealArr,
        cuisineArr
    };

}

function generateURL(){
    const filteredArrs = getFilterValues();
    let healthArr = filteredArrs.healthArr;
    let mealArr = filteredArrs.mealArr;
    let cuisineArr = filteredArrs.cuisineArr;
    let queryText = document.getElementById("searchText").value;

    let url = `https://api.edamam.com/api/recipes/v2?app_id=${APP_ID}&type=public&imageSize=REGULAR&
               health=${healthArr}&mealType=${mealArr}&cuisineType=${cuisineArr}&q=${queryText}`
    return url;
}

function getRecipes(){
    fetch(generateURL(), {
        method: 'GET',
        headers: {
            "app_key": APP_KEY,
            "Access-Control-Allow-Origin": "*"
        }
    })
    .then(response => response.json())
    .then(data => console.log(data));
}