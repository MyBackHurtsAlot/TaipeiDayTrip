// ====== Set dateTime ======
let time = document.querySelector(".dateTime")

time.addEventListener("input", () => {
    //Changes dateTime into dateTimeSelected to display date
    time.className = "dateTimeSelected"
})

// ====== Set Fee ======
let showMorningFee = document.querySelector(".morning")

showMorningFee.addEventListener("click", () => {
    let morningFee = document.querySelector(".morningFee")
    morningFee.style.display = "inline-block"
    let noonFee = document.querySelector(".noonFee")
    noonFee.style.display = "none"
    let none = document.querySelector(".none")
    none.style.display = "none"
})

let showNoonFee = document.querySelector(".noon")

showNoonFee.addEventListener("click", () => {
    let noonFee = document.querySelector(".noonFee")
    noonFee.style.display = "inline-block"
    let morningFee = document.querySelector(".morningFee")
    morningFee.style.display = "none"
    let none = document.querySelector(".none")
    none.style.display = "none"
})

// ======= Fetch =======
let attractionId = 1

window.addEventListener("load", () => {
    // Fetch path name(type:string) when window is loaded then split
    let path = window.location.pathname.split("/")

    attractionId = path[2]

    attractionPage = async () => {
        await fetch(`/api/attraction/${attractionId}`)
            .then((response) => {
                return response.json()
            }).then((data) => {
                let attractionData = data.data

                let img = attractionData.images
                let name = attractionData.name
                let category = attractionData.category
                let mrt = attractionData.mrt
                let description = attractionData.description
                let address = attractionData.address
                let transport = attractionData.transport


                // ======= Top Right Infos ========
                let rightText = document.querySelector(".rightText")
                rightText.className = "rightText"

                //NAME
                let nameWrap = document.createElement("div")
                nameWrap.className = "nameWrap"
                let topLine1 = document.createTextNode(name)

                //CATEGORY
                let catMrtWrap = document.createElement("div")
                catMrtWrap.className = "catMrtWrap"
                let topLine2 = document.createTextNode(category + " at " + mrt)

                rightText.appendChild(nameWrap)
                nameWrap.appendChild(topLine1)
                rightText.appendChild(catMrtWrap)
                catMrtWrap.appendChild(topLine2)

                // ======== Bottom Infos ========
                let attractionBottomWrap = document.querySelector(".attractionBottomWrap")
                attractionBottomWrap.className = "attractionBottomWrap"

                // Description
                let descriptionWrap = document.createElement("div")
                descriptionWrap.className = "descriptionWrap"
                let Spotdescription = document.createTextNode(description)

                // Address
                let addressWrap = document.createElement("div")
                addressWrap.className = "addressWrap"
                let addressLine1Wrap = document.createElement("div")
                addressLine1Wrap.className = "addressLine1Wrap"
                let addressLine1 = document.createTextNode("景點地址：")
                addressLine1.className = "addressLine1"
                let addressLine2Wrap = document.createElement("div")
                addressLine2Wrap.className = "addressLine2Wrap"
                let addressLine2 = document.createTextNode(address)
                addressLine2.className = "addressLine2"

                // Transport
                let transportWrap = document.createElement("div")
                transportWrap.className = "transportWrap"
                let transportLine1Wrap = document.createElement("div")
                transportLine1Wrap.className = "transportLine1Wrap"
                let transportLine1 = document.createTextNode("交通方式：")
                transportLine1.className = "transportLine1"
                let transportLine2Wrap = document.createElement("div")
                transportLine2Wrap.className = "transportLine2Wrap"
                let transportLine2 = document.createTextNode(transport)
                transportLine2.className = "transportLine2"

                attractionBottomWrap.appendChild(descriptionWrap)
                descriptionWrap.appendChild(Spotdescription)
                attractionBottomWrap.appendChild(addressWrap)
                addressWrap.appendChild(addressLine1Wrap)
                addressLine1Wrap.appendChild(addressLine1)
                addressWrap.appendChild(addressLine2Wrap)
                addressLine2Wrap.appendChild(addressLine2)
                attractionBottomWrap.appendChild(transportWrap)
                transportWrap.appendChild(transportLine1Wrap)
                transportLine1Wrap.appendChild(transportLine1)
                transportWrap.appendChild(transportLine2Wrap)
                transportLine2Wrap.appendChild(transportLine2)


                // ======== Top Left ========
                // Dots
                for (let i = 0; i < img.length; i++) {
                    // imgSlider = img[i]
                    let topLeft = document.querySelector(".topLeft")
                    topLeft.className = "topLeft"
                    let dotControl = document.querySelector(".dotControl")
                    dotControl.className = "dotControl"

                    let dot = document.createElement("span")
                    dot.setAttribute("num", `${i}`)
                    dot.className = "dot"
                    // dot.setAttribute("src", "../static/imgs/AttractionPage/dot.png")//USING CSS IS MUCH EASIER

                    topLeft.appendChild(dotControl)
                    dotControl.appendChild(dot)
                }


                // Shows FirstImg
                let currentImg = 0
                let imgSlider = img[currentImg]

                let topLeft = document.querySelector(".topLeft")
                topLeft.className = "topLeft"

                let sliderWrap = document.createElement("div")
                sliderWrap.className = "sliderWrap"
                let slider = document.createElement("img")
                slider.className = "slider"
                slider.setAttribute("src", imgSlider)

                topLeft.appendChild(sliderWrap)
                sliderWrap.appendChild(slider)

                let dot = 0

                // ======== Slider Right ========
                let nextImg = document.querySelector(".sliderArrowRight")
                nextImg.onclick = () => {

                    // Change image to next or set to 0
                    if (currentImg < img.length - 1) {
                        currentImg++
                        // console.log("img =" + currentImg)
                    } else {
                        currentImg = 0
                    }
                    // DON'T NEED TO SET dot to next or set to 1
                    // if (dot < img.length - 1) {
                    //     dot++
                    //     // console.log("dot =" + dot)
                    // } else {
                    //     dot = 1
                    // }

                    // Append next image when onclick
                    let nextSlider = img[currentImg]

                    let newSlider = document.createElement("img")
                    newSlider.className = "newSlider"
                    newSlider.setAttribute("src", nextSlider)

                    sliderWrap.appendChild(newSlider)

                    // Add  class name = "slider" to new ones and remove className = "newSlider"
                    document.querySelector(".newSlider").classList.add("slider")
                    document.querySelector(".newSlider").classList.remove("newSlider")

                    // Hide prevImg
                    allSliders = document.querySelectorAll(".slider")
                    for (let i = 1; i < allSliders.length; i++) {
                        allSliders[i - 1].setAttribute("style", "display:none")
                    }

                    // Show dots matches img
                    allDots = document.querySelectorAll(".dot")
                    for (let i = 0; i < img.length; i++) {
                        allDots[i].className = allDots[i].className.replace(" currentDot", "")
                    }
                    allDots[currentImg].className += " currentDot";
                }

                // Slider Left
                let prevImg = document.querySelector(".sliderArrowLeft")
                prevImg.onclick = () => {
                    // console.log(img)
                    if (currentImg === 0) {
                        currentImg += img.length - 1
                        // console.log("img =" + currentImg)
                    } else {
                        currentImg--
                        // console.log("img--" + currentImg)
                    }
                    if (dot === 0) {
                        dot += img.length - 1
                        // console.log("dot =" + dot)
                    } else {
                        dot--
                        // console.log("dot--" + dot)
                    }
                    let prevSlider = img[currentImg]
                    let newSlider = document.createElement("img")
                    newSlider.className = "newSlider"
                    newSlider.setAttribute("src", prevSlider)

                    sliderWrap.appendChild(newSlider)
                    document.querySelector(".newSlider").classList.add("slider")
                    document.querySelector(".newSlider").classList.remove("newSlider")

                    allSliders = document.querySelectorAll(".slider")
                    for (let i = 1; i < allSliders.length; i++) {
                        // console.log(allSliders[i - 1])
                        // console.log(allSliders)
                        allSliders[i - 1].setAttribute("style", "display:none")
                    }

                    allDots = document.querySelectorAll(".dot")
                    for (let i = 0; i < img.length; i++) {
                        allDots[i].className = allDots[i].className.replace(" currentDot", "")
                    }
                    allDots[currentImg].className += " currentDot";

                }

            })
    }
    attractionPage()
})