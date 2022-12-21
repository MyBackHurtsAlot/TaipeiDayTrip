let page = 0
let keyword = ""
let isLoading = false
let url = window.location.origin
let indexData = {}


const keywordInput = document.querySelector(".bannerSearchBar")
const search = document.querySelector(".searchIconBackground")
const indexAttractions = document.querySelector(".indexAttractions")

// Set footer as target
const target = document.querySelector(".footerContainer")

const options = {
    // root: main,
    rootMargin: "0px",
    threshold: 0.1
}


// ========================= AppendChild ===========================
getData = async (d) => {
    isLoading = true
    // Get ids
    let idArr = []
    let getIds = () => {
        for (let i = 0; i < indexData.length; i++) {
            let firstId = indexData[i].ID
            // console.log(firstId)
            idArr.push(firstId)

        }
        return idArr
    }

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
            // console.log(firstName)
            nameArr.push(firstName)

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
    let id = getIds()
    let imgs = getImgs()
    let names = getName()
    let cat = getCat()
    let mrt = getMrt()
    let main = document.querySelector(".main")
    main.className = "main"
    let indexAttractions = document.querySelector(".indexAttractions")
    indexAttractions.className = "indexAttractions"


    for (let i = 0; i < indexData.length; i++) {
        let imgsWrap = document.createElement("a")
        imgsWrap.className = "imgsWrap"
        imgsWrap.setAttribute("href", `/attraction/${id[i]}`)
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
    isLoading = false
}

// ========================= initialLoad ===========================
initialLoad = async () => {
    if ((page !== null) && (isLoading === false)) {
        const response = await fetch(`/api/attractions?page=${page}`)
        const data = await response.json()
        indexData = data.data
        // console.log(indexData)
        page = data.nextPage // page 4 can still shows up
        getData(indexData)
    }
}


// ========================= KeyWord ===========================
keywordInput.addEventListener("change", () => {
    isLoading = true
    page = 0
    let kInput = document.querySelector(".bannerSearchBar")
    keyword = kInput.value
    keywordSearch(keyword)
    let clear = document.querySelector(".indexAttractions")
    while (clear.firstChild) {
        clear.removeChild(clear.firstChild)
    }
})

keywordSearch = async (keyword) => {
    observer.observe(target) // reobserve when page is scrolled to bottom that causes nextPage can't show up
    if ((page !== null) && (isLoading === false)) {
        isLoading = true
        const response = await fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
        const data = await response.json()
        indexData = data.data

        if (indexData.length === 0) {
            isLoading === false;
            popUpMsg("請輸入正確景點名稱", "好的")
        } else {
            getData(indexData)

        }
        page = data.nextPage // page 4 can still shows up
        // console.log("nextpage = " + page)
    }
}

search.addEventListener("click", () => {
    isLoading = false
    page = 0
    let kInput = document.querySelector(".bannerSearchBar")
    keyword = kInput.value
    keywordSearch(keyword)
    let clear = document.querySelector(".indexAttractions")
    while (clear.firstChild) {
        clear.removeChild(clear.firstChild)
    }
})

// ========================= Scroll ===========================
const callback = (entries, observer) => {
    // console.log("call" + page)
    entries.forEach(entry => {
        // console.log(entry)
        if (entry.isIntersecting) {
            // console.log("test" + page)
            if (page !== null) {  // Stops at page ===null
                if (keywordInput.value === "") { // Shows all attractions first
                    initialLoad()
                    // keywordSearch()
                } else if (keywordInput.value !== "") {
                    keywordSearch(keyword)
                    // Shows search result
                    // console.log(keyword)
                } else {
                    observer.unobserve(target); // unobserve search result
                    page = 0 // reset search result page to 0 to avoid from blocked by page !== null
                }
            }
            else {
                observer.unobserve(target); // unobserve all attrations
                page = 0 // reset search result page to 0 to avoid from blocked by page !== null
            }
        }
    })
}

let observer = new IntersectionObserver(callback, options)
observer.observe(target)


// =============== preload ==================