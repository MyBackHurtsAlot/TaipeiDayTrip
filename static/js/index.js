let page = 0
let isLoading = false


let keywordInput = document.querySelector(".bannerSearchBar")
let search = document.querySelector(".searchIconBackground")
let indexAttractions = document.querySelector(".indexAttractions")

// let main = document.querySelector(".main")
// let indexAttractions = document.querySelector(".indexAttractions")
let target = document.querySelector(".footerContainer")



let options = {
    // root: main,
    rootMargin: "0px",
    threshold: 0.1
}

currentPage = async () => {
    if ((page !== null) && (isLoading === false)) {
        isLoading = true
        await fetch(`/api/attractions?page=${page}`)
            .then((response) => {
                return response.json()
            }).then((data) => {
                let indexData = data.data
                // console.log(indexData.length)

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


                page = data.nextPage // page 4 can still shows up
                isLoading = false
                // console.log(page)
                // }
            })
    }

}

const callback = (entries, observer) => {
    // console.log("call" + page)
    entries.forEach(entry => {
        // console.log(entry)
        if (entry.isIntersecting) {
            // console.log("test" + page)
            if (page !== null) {
                if (keywordInput.value === "") {
                    currentPage()
                } else if (keywordInput.value !== "") {
                    keywordSearch(keyword)
                    // console.log(keyword)
                } else {
                    observer.unobserve(target);
                    page = 0
                }
            }
            else {
                observer.unobserve(target);
                page = 0
            }
        }
    })
}

let observer = new IntersectionObserver(callback, options)
observer.observe(target)

