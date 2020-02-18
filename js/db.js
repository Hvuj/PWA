//offline data
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
            //probably multiple tabs opened at once
            console.log(err, 'persistence failed')
        } else if (err.code == 'unimplemented') {
            //lack of browser support
            console.log(err, 'persistence is not available')
        }
    });


//real time listener
db.collection('recipes').onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        // console.log(change, change.doc.data(), change.doc.id)
        if (change.type === 'added') {
            //add doc data to web page
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            //delete doc from the web page
            removeRecipe(change.doc.id);
        }
    })
});

//add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', event => {
    event.preventDefault();

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipes').add(recipe).catch(err => {
        console.log(err, 'error')
    });

    form.title.value = '';
    form.ingredients.value = '';
});

//delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', (evnet) => {
    // console.log(event);
    if (evnet.target.tagName === 'I') {
        const id = event.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete();
    }
})