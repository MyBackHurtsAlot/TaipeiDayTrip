categories = () => {
    fetch(`/api/categories`).then((response) => {
        return response.json()
    }).then((data) => {
        let catData = data.data
        // console.log(catData)
        for (let i = 0; i < catData.length; i++) {

            let bannerCat = document.querySelector(".bannerCat")
            bannerCat.classname = "bannerCat"

            let bannerContnet = document.createElement("div")
            bannerContnet.className = "bannerContnet"

            let searhCat = document.createTextNode(catData[i])
            searhCat.className = "searhCat"

            bannerContnet.addEventListener("click", () => {
                keywordInput.value = bannerContnet.innerHTML
            })
            bannerCat.appendChild(bannerContnet)
            bannerContnet.appendChild(searhCat)
        }
    })

    let bannerCat = document.querySelector(".bannerCat")
    let catMenu = document.querySelector(".bannerSearchBar")
    catMenu.addEventListener("click", (e) => {
        stopFunc(e)
        bannerCat.style.visibility = "visible"
    })


    document.addEventListener("click", function (e) {
        bannerCat.style.visibility = "hidden"

    })
    function stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
}
categories()