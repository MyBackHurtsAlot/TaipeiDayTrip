let page = 0
let isLoading = false
let url = window.location.origin


let keywordInput = document.querySelector(".bannerSearchBar")
let search = document.querySelector(".searchIconBackground")
let indexAttractions = document.querySelector(".indexAttractions")

// Set footer as target
let target = document.querySelector(".footerContainer")




let options = {
    // root: main,
    rootMargin: "0px",
    threshold: 0.1
}

const initialLoad = async () => {
    if ((page !== null) && (isLoading === false)) {
        isLoading = true
        await fetch(`/api/attractions?page=${page}`)
            .then((response) => {
                return response.json()
            }).then((data) => {
                let indexData = data.data
                // console.log(indexData.ID)



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


                page = data.nextPage // page 4 can still shows up
                isLoading = false
                // console.log(page)
                // }

                // Select Attractions
                // let link = 

            })
    }

}

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
                } else if (keywordInput.value !== "") { // Shows search result
                    keywordSearch(keyword)
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


// ======== MemberShip ========
const navBarBtnLogin = document.querySelector(".navBarBtnLogin")
const overlay = document.querySelector(".overlay")
const registerContainer = document.querySelector(".registerContainer")
const signInContainer = document.querySelector(".signInContainer")
const signInToRegister = document.querySelector(".signInNoAccount")
const registerToSignIn = document.querySelector(".registerIsMember")
const navBarTpeText = document.querySelector(".navBarTpeText")




navBarBtnLogin.onclick = () => {
    signInContainer.style.display = "grid"
    overlay.style.display = "block"
}

overlay.onclick = () => {
    signInContainer.style.display = "none"
    registerContainer.style.display = "none"
    overlay.style.display = "none"

}

signInToRegister.onclick = () => {
    signInContainer.style.display = "none"
    registerContainer.style.display = "grid"

}

registerToSignIn.onclick = () => {
    signInContainer.style.display = "grid"
    registerContainer.style.display = "none"

}




// export default { currentPage, callback, observer, }