const buttonContainer = document.getElementById('button-container');
const cardContainer = document.getElementById('card-container');
const errorContent = document.getElementById('error-content');
const sortButton = document.getElementById('sort-button')

let selectedCategory = 1000;
let sortByView = false;

sortButton.addEventListener('click', () =>{
    sortByView =  true;
    dataByCategories(selectedCategory, sortByView);
})


const categories = () => {
   const url = 'https://openapi.programming-hero.com/api/videos/categories';
    fetch(url)
    .then((res) => res.json())
    .then(({data}) => {
        data.forEach( (card) => {
            console.log(card)
            const newButton = document.createElement('button');
            newButton.className = `category-button text-[#252525b3] px-5 py-[10px] bg-[#25252533] hover:bg-[#FF1F3D] hover:text-[#FFF] rounded-md font-medium duration-[0.5s]`
            newButton.innerText = card.category;
            newButton.addEventListener('click',() => {
                dataByCategories(card.category_id)
                const allButtons = document.querySelectorAll('.category-button');
                for (const button of allButtons){
                    button.classList.remove('bg-[#FF1F3D]');
                }
                newButton.classList.add('bg-[#FF1F3D]');
            });
            buttonContainer.appendChild(newButton);
        })
    })
}

const dataByCategories = (categoryID, sortByView) => {
    selectedCategory =  categoryID;
    const url = `https://openapi.programming-hero.com/api/videos/category/${categoryID}`
    fetch(url)
    .then((res) => res.json())
    .then(({data}) => {

        if(sortByView){
            data.sort((a, b) =>{
                const totalSortViewsFirst = a.others?.views;
                const totalSortViewsSecond = b.others?.views;
                const totalSortViewsFirstNumber = parseFloat(totalSortViewsFirst.replace('K', '')) || 0;
                const totalSortViewsSecondNumber = parseFloat(totalSortViewsSecond.replace('K', '')) || 0;
                return totalSortViewsSecondNumber - totalSortViewsFirstNumber;
            })
        }
        if(data.length === 0){
            errorContent.classList.remove('hidden')
        }
        else {
            errorContent.classList.add('hidden')
        }
        cardContainer.innerHTML = ''
        data.forEach((content) => {
            let verifiedBadge = '';
            if (content.authors[0].verified){
                verifiedBadge = `<img src="Assets/fi_10629607.svg" alt="">`
            }

            const newCard = document.createElement('div');
            newCard.classList = `flex flex-col just justify-end border-[1px] border-[#17171733] rounded-xl p-3`
            newCard.innerHTML = `
                <div class="w-full h-[200px]"><img class="w-full h-full object-cover" src="${content.thumbnail}" alt=""></div>
                    <div class="mt-5 flex gap-3">
                        <div class="w-[50px] h-[50px] bg-black rounded-full"><img class="w-[50px] h-[50px] rounded-full" src="${content.authors[0].profile_picture}" alt=""></div>
                        <h2 class="text-[#171717] font-bold">${content.title}</h2>
                    </div>
                    <div class="mt-3 flex gap-3">
                        <p class="text-[#171717B2]">${content.authors[0].profile_name}</p>
                        ${verifiedBadge}
                    </div>
                    <p class="text-[0.875rem] mt-3">${content.others.views}</p>
            `
            cardContainer.appendChild(newCard);
            
            
        })
    })
}

categories()
dataByCategories(selectedCategory, sortByView)