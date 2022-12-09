// let page = 0
let keyword = "";
keywordInput.addEventListener("change", () => {
    page = 0
    let input = document.querySelector(".bannerSearchBar")
    keyword = input.value
    keywordSearch(keyword)
    let clear = document.querySelector(".indexAttractions")
    while (clear.firstChild) {
        clear.removeChild(clear.firstChild)
    }
})
// console.log(keyword)

keywordSearch = async (keyword) => {
    observer.observe(target)
    if ((page !== null) && (isLoading === false)) {
        isLoading = true
        await fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
            .then((response) => {
                return response.json()
            }).then((data) => {

                let indexData = data.data

                if (indexData.length === 0) {
                    alert("無此資料")
                } else {

                    // Get imgs
                    let imgArr = []
                    let getImgs = () => {

                        for (let i = 0; i < indexData.length; i++) {
                            let firstImg = indexData[i].images
                            // console.log(firstImg[0])
                            imgArr.push(firstImg[0])
                            // console.log(imgArr)
                        }
                        return imgArr
                    }


                    // Get names
                    let nameArr = []
                    let getName = () => {
                        for (let i = 0; i < indexData.length; i++) {
                            let firstName = indexData[i].name
                            nameArr.push(firstName)
                            // console.log(imgArr)
                        }
                        return nameArr
                    }


                    // Get Categories
                    let catArr = []
                    let getCat = () => {
                        for (let i = 0; i < indexData.length; i++) {
                            let cat = indexData[i].category
                            catArr.push(cat)
                        }
                        return catArr
                    }

                    // Get MRTS
                    let mrtArr = []
                    let getMrt = () => {
                        for (let i = 0; i < indexData.length; i++) {
                            let mrt = indexData[i].mrt
                            mrtArr.push(mrt)
                        }
                        return mrtArr
                    }

                    let imgs = getImgs()
                    let names = getName()
                    let cat = getCat()
                    let mrt = getMrt()
                    let main = document.querySelector(".main")
                    main.className = "main"
                    let indexAttractions = document.querySelector(".indexAttractions")
                    indexAttractions.className = "indexAttractions"


                    for (let i = 0; i < indexData.length; i++) {
                        let imgsWrap = document.createElement("div")
                        imgsWrap.className = "imgsWrap"
                        let mainImgs = document.createElement("img")
                        mainImgs.className = "mainImgs"
                        mainImgs.setAttribute("src", imgs[i])

                        let namesWrap = document.createElement("div")
                        namesWrap.className = "namesWrap"
                        let mainNames = document.createElement("div")
                        mainNames.className = "mainNames"
                        let attName = document.createTextNode(names[i])

                        let contentWrap = document.createElement("div")
                        contentWrap.className = "contentWrap"

                        let catsWrap = document.createElement("span")
                        catsWrap.className = "catsWrap"
                        let mainCats = document.createElement("span")
                        mainCats.className = "mainCats"
                        let attCats = document.createTextNode(cat[i])

                        let mrtWrap = document.createElement("span")
                        mrtWrap.className = "mrtWrap"
                        let mainMrt = document.createElement("span")
                        mainMrt.className = "mainMrt"
                        let allMrt = document.createTextNode(mrt[i])

                        main.appendChild(indexAttractions)
                        indexAttractions.appendChild(imgsWrap)
                        imgsWrap.appendChild(mainImgs)

                        imgsWrap.appendChild(namesWrap)
                        namesWrap.appendChild(mainNames)
                        mainNames.appendChild(attName)

                        imgsWrap.appendChild(contentWrap)
                        contentWrap.appendChild(mrtWrap)
                        mrtWrap.appendChild(mainMrt)
                        mainMrt.appendChild(allMrt)

                        imgsWrap.appendChild(contentWrap)
                        contentWrap.appendChild(catsWrap)
                        catsWrap.appendChild(mainCats)
                        mainCats.appendChild(attCats)

                    }
                    page = data.nextPage
                    // console.log(page)
                    isLoading = false
                }
            })
    }
}


search.addEventListener("click", () => {
    page = 0
    let input = document.querySelector(".bannerSearchBar")
    keyword = input.value
    keywordSearch(keyword)
    let clear = document.querySelector(".indexAttractions")
    while (clear.firstChild) {
        clear.removeChild(clear.firstChild)
    }
    // console.log(keyword)
})
