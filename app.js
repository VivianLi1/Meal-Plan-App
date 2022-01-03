const APP_KEY = "4eb0f6bbfbecb2a6875d5652e7f76a48";
const APP_ID = "f4b3de52";

const mediaQuery = '(max-width: 1024px)';

let fetchedRecipes = [];
let myRecipes = [];

document.addEventListener('DOMContentLoaded', () => {
    addNavBarBurgerItems();
    addPageNav();
    addFilterMenuButtonListener();
    addFilterButtonsListeners();
    document.getElementById("searchButton").addEventListener("click", ()=>{
        closeFilters();
        document.getElementById("recipeCol1").innerText = "";
        document.getElementById("recipeCol2").innerText = "";
        document.getElementById("recipeCol3").innerText = "";
        currRecipeCol = 1;
        fetchedRecipes = [];
        OFFSET = 0;
        getRecipes(generateURL());
    })
    //testRecipes();
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

function closeFilters(){
    document.getElementById("filterRestrictions").style.display = "none";
    document.getElementById("filterDiets").style.display = "none";
    document.getElementById("filterCuisines").style.display = "none";
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

    let url = `https://secure-anchorage-65790.herokuapp.com/https://api.edamam.com/api/recipes/v2?app_key=${APP_KEY}&app_id=${APP_ID}&type=public&imageSize=LARGE&q=${queryText}`
    url = addFilterToURL(url, healthArr, "health");
    url = addFilterToURL(url, mealArr, "mealType");
    url = addFilterToURL(url, cuisineArr, "cuisineType");

    return url;
}

function addFilterToURL(url, arr, filterType){
    arr.forEach(item =>{
        url+=`&${filterType}=${item}`
    })

    return url;
}

let OFFSET = 0;
let currRecipeCol = 1;
function getRecipes(url){
    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {

        let currRecipes = data.hits;
        fetchedRecipes = fetchedRecipes.concat(currRecipes);
        console.log(data.count);

        currRecipes.map((recipe, index) =>{
            recipe = recipe.recipe;

            let name = recipe.label;
            let cuisineType = recipe.cuisineType;
            let calPerServing = Math.floor(recipe.calories/recipe.yield);
            let ingredients = recipe.ingredientLines;
            let imageURL = recipe.images.REGULAR.url;
            let recipeURL = recipe.url;

            let recipeDiv = displayRecipe(name, calPerServing, imageURL, currRecipeCol);
            recipeDiv.addEventListener("click", ()=>{
                populateModalContent(imageURL, name, calPerServing, cuisineType, ingredients, recipeURL, index+OFFSET);
            });

            currRecipeCol = incCol(currRecipeCol);

        });

        let loadMoreButton = document.getElementById("loadMore");
        if(data._links.hasOwnProperty("next")){ 
            loadMoreButton.style.display = "block";
            loadMoreButton.addEventListener("click", () =>{
                OFFSET += 20;
                getRecipes(data._links.next.href);
            });
        }else{
            loadMoreButton.style.display = "none";
        }
    })
}

function testRecipes(){
    fetch("./ex_json.json")
    .then(response => {
        return response.json();
    })
    .then(data => {
        //console.log(data.hits);
        let currRecipes = data.hits;
        fetchedRecipes = fetchedRecipes.concat(currRecipes);
        let currRecipeCol = 1;

        currRecipes.map((recipe, index) =>{
            recipe = recipe.recipe;

            let name = recipe.label;
            let cuisineType = recipe.cuisineType;
            let calPerServing = Math.floor(recipe.calories/recipe.yield);
            let ingredients = recipe.ingredientLines;
            let imageURL = recipe.images.REGULAR.url;
            let recipeURL = recipe.url;

            recipeDiv = displayRecipe(name, calPerServing, imageURL, currRecipeCol);
            recipeDiv.addEventListener("click", ()=>{
                populateModalContent(imageURL, name, calPerServing, cuisineType, ingredients, recipeURL, index);
            });

            currRecipeCol = incCol(currRecipeCol);

        });
    });
}

function incCol(currRecipeCol){
    if(currRecipeCol == 3){
        return 1;
    }else{
        return currRecipeCol + 1;
    }
}

let currMyRecipeCol = 1;
function populateModalContent(imageURL, name, calPerServing, cuisineType, ingredients, recipeURL, index){
    let modal = document.getElementById("recipeModal");

    document.getElementById("currRecipeImg").src = imageURL;
    document.getElementById("currRecipeName").innerText = name;
    document.getElementById("currRecipeCals").innerText = calPerServing;
    document.getElementById("currRecipeCuisine").innerText = cuisineType;

    let ingredientDiv = document.getElementById("currRecipeIngredients");
    ingredientDiv.innerText = "";
    ingredients.forEach(ingredient => {
        let ingredientElement = document.createElement("p");
        ingredientElement.innerText = ingredient;
        ingredientDiv.appendChild(ingredientElement);
    })

    document.getElementById("recipeURLButton").onclick = () =>{
        document.getElementById("recipeURLButton").href = recipeURL;
    }

    document.getElementById("addToMyRecipesButton").onclick = () =>{
        addToMyRecipes(index);
        console.log(fetchedRecipes);
        console.log(myRecipes);
    }

    modal.classList.add("is-active");
    modal.firstElementChild.onclick = () =>{
        modal.classList.remove("is-active");
    }
    modal.lastElementChild.onclick = () =>{
        modal.classList.remove("is-active");
    }
}

function displayRecipe(name, calPerServing, imageURL, currRecipeCol){
    //div containing recipe
    let recipeDiv = document.createElement("div");
    recipeDiv.className = "columns is-mobile recipe";
    recipeDiv.style.borderRadius = ".5em";
    recipeDiv.style.padding = "3px";

    //div containing recipe image
    let recipeImgDiv = document.createElement("div");
    recipeImgDiv.className = "column is-one-third"
    let img = document.createElement("img");
    img.src = imageURL;
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.borderRadius = "5px";
    recipeImgDiv.appendChild(img);

    //div containing recipe information (name and calories)
    let recipeInfoDiv = document.createElement("div");
    recipeInfoDiv.className = "column is-two-thirds";
    recipeInfoDiv.style.position = "relative";
    //name
    let nameNode = document.createElement("h1");
    nameNode.innerText = name;
    nameNode.style.fontSize = "large";
    recipeInfoDiv.appendChild(nameNode);
    //calories
    let calNode = document.createElement("p");
    calNode.innerText = `${calPerServing} kcal/serving`
    calNode.style.position = "absolute";
    calNode.style.bottom = "10%";
    recipeInfoDiv.appendChild(calNode);

    
    recipeDiv.appendChild(recipeImgDiv);
    recipeDiv.appendChild(recipeInfoDiv);
    document.getElementById(`recipeCol${currRecipeCol}`).appendChild(recipeDiv);

    return recipeDiv;
}

hasRecipes = false;
function addToMyRecipes(recipeIndex){
    myRecipes.push(fetchedRecipes[recipeIndex]);

    if(!hasRecipes){
        hasRecipes = true;
        document.getElementById("myRecipeHolder").style.display = "none";
    }

    let name = fetchedRecipes[recipeIndex].recipe.label;
    let calPerServing = Math.floor(fetchedRecipes[recipeIndex].recipe.calories/fetchedRecipes[recipeIndex].recipe.yield);
    let cuisineType = fetchedRecipes[recipeIndex].recipe.cuisineType;
    let ingredients = fetchedRecipes[recipeIndex].recipe.ingredientLines;
    let recipeURL = fetchedRecipes[recipeIndex].recipe.url;

    let imageURL = fetchedRecipes[recipeIndex].recipe.images.REGULAR.url;
    if(fetchedRecipes[recipeIndex].recipe.images.hasOwnProperty("LARGE")){
        imageURL = fetchedRecipes[recipeIndex].recipe.images.LARGE.url;
    }
    

    displayMyRecipe(name, calPerServing, imageURL, cuisineType, ingredients, recipeURL, currMyRecipeCol);
    document.getElementById("recipeModal").classList.remove("is-active");
    
    currMyRecipeCol = incCol(currMyRecipeCol);
}

function displayMyRecipe(name, calPerServing, imageURL, cuisineType, ingredients, recipeURL, currRecipeCol){
    let myRecipeDiv = document.createElement("div");
    //myRecipeDiv.style.padding = "20px";
    //myRecipeDiv.style.position = "relative";
    myRecipeDiv.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${imageURL})`;
    myRecipeDiv.className = "myRecipeDiv";

    let myRecipeDivHeader = document.createElement("div");
    myRecipeDivHeader.className = "columns is-mobile";
    myRecipeDivHeader.style.marginBottom = "8%";
    //name
    let myRecipeNameDiv = document.createElement("div");
    myRecipeNameDiv.className = "column is-7";
    let myRecipeName = document.createElement("h1");
    myRecipeName.innerText = name;
    myRecipeName.style.fontSize = "large";
    myRecipeNameDiv.appendChild(myRecipeName);
    //cuisine and calories
    let myRecipeInfoDiv = document.createElement("div");
    myRecipeInfoDiv.className = "column is-4 is-offset-1";
    myRecipeInfoDiv.style.textAlign = "right";
    let cals = document.createElement("p");
    cals.innerText = calPerServing + " kcal/serving";
    myRecipeInfoDiv.appendChild(cals);
    let cuisine = document.createElement("p");
    cuisine.innerText = cuisineType;
    myRecipeInfoDiv.appendChild(cuisine);

    let ingredientDiv = document.createElement("div");
    ingredients.forEach(ingredient => {
        let ingredientElement = document.createElement("p");
        ingredientElement.innerText = ingredient;
        ingredientElement.style.fontSize = "small";
        ingredientElement.padding = "4px";
        ingredientDiv.appendChild(ingredientElement);
    });

    let buttonDiv = document.createElement("div");
    buttonDiv.className = "centerAbsDiv";
    buttonDiv.style.bottom = "5%";
    let fullRecipeButton = document.createElement("a");
    fullRecipeButton.innerText = "view full recipe";
    fullRecipeButton.className = "modalButton";
    fullRecipeButton.style.marginRight = "30px";
    let addToMenuButton = document.createElement("a");
    addToMenuButton.innerText = "add to my menu";
    addToMenuButton.className = "modalButton";
    buttonDiv.appendChild(fullRecipeButton);
    buttonDiv.appendChild(addToMenuButton);

    myRecipeDivHeader.appendChild(myRecipeNameDiv);
    myRecipeDivHeader.appendChild(myRecipeInfoDiv);
    myRecipeDiv.appendChild(myRecipeDivHeader);
    myRecipeDiv.appendChild(ingredientDiv);
    myRecipeDiv.appendChild(buttonDiv);
    document.getElementById(`myRecipeCol${currRecipeCol}`).appendChild(myRecipeDiv);

    fullRecipeButton.rel = "noopener noreferrer";
    fullRecipeButton.target = "_blank";
    fullRecipeButton.href = recipeURL;

    addToMenuButton.onclick = () => {
        addToMyMenu();
    }

    return myRecipeDiv;

}

function addToMyMenu(){

}

