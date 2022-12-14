
const bookingWrap = document.querySelector(".bookingWrap")
const purchasedItemsWrap = document.querySelector(".purchasedItemsWrap")
const purchasedItems_All_Wrap = document.querySelector(".purchasedItems_All_Wrap")
const emptyWrap = document.querySelector(".emptyWrap")
const yourName_input = document.querySelector(".yourName_input")
const yourEmail_input = document.querySelector(".yourEmail_input")
const hello_Username = document.querySelector(".hello_Username")
const iconDelete = document.querySelector(".iconDelete")
const purchasedItems_Name = document.querySelector(".purchasedItems_Name")
const memberInfoWrap = document.querySelector(".memberInfoWrap")
const paymentWrap = document.querySelector(".paymentWrap")
const totalWrap = document.querySelector(".totalWrap")
const hr = document.querySelectorAll("hr")

let attractionId = 0
let memberId = 0

initialLoad = checkStatus()
let isLoggedIn


// ====================== Empty Order ===================================
const emptyOrder = () => {
    bookingWrap.style.minHeight = "calc(100vh - 54px - 104px)"
    purchasedItemsWrap.style.display = "none"
    hr[0].style.display = "none"
    hr[1].style.display = "none"
    hr[2].style.display = "none"
    memberInfoWrap.style.display = "none"
    paymentWrap.style.display = "none"
    totalWrap.style.display = "none"
    popUpMsg("買個行程啦", "QQ")
    const cancel = document.querySelector(".cancel")
    cancel.onclick = () => {
        window.location.href = "/"
    }
}

// ====================== Log In Check ===================================
// window.onload = () => {
initialLoad.then(isLoggedIn => {
    // console.log(isLoggedIn)
    if (isLoggedIn === null) {
        window.location.href = "/"

    } else {
        memberId = isLoggedIn["id"]

        let reservationUserName = document.createTextNode(isLoggedIn.name)
        hello_Username.appendChild(reservationUserName)
        yourName_input.value = isLoggedIn.name
        yourEmail_input.value = isLoggedIn.email
        getData()
    }
})
// }

//====================== Delete Reservation ===================================
iconDelete.onclick = async () => {
    console.log(attractionId)
    let deleteItem = {
        "atractionId": attractionId,
        "memberId": memberId
    }

    const response = await fetch("/api/booking", {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify(deleteItem),
        headers: new Headers({
            "Content-Type": "application/JSON"
        })
    })
    const data = await response.json()
    if (data.ok) {
        emptyOrder()
    }
}

// ============================== Get Data ================================
getData = async () => {
    const response = await fetch(`/api/booking`)
    const data = await response.json()
    if (data.error) {
        emptyOrder()
    } else {
        let purchasedList = data.data
        console.log(purchasedList)
        let attractionList = purchasedList.attraction
        // console.log(attractionList)
        // console.log(data)

        attractionId = attractionList.id

        // Split Images into array
        let imgSplit = attractionList.image.split(" ")

        // Get infomations
        let purchasedImg = imgSplit[0]
        let purchasedName = attractionList.name
        let purchasedDate = purchasedList.date
        let purchasedTime = purchasedList.time
        let purchasedFee = purchasedList.price
        let purchasedAddress = attractionList.address


        const purchasedItems_ImgContainer = document.querySelector(".purchasedItems_ImgContainer")
        purchasedItems_ImgContainer.style.backgroundImage = `url(${purchasedImg})`

        const purchasedItems_Name = document.querySelector(".purchasedItems_Name")
        let reservationName = document.createTextNode(`台北一日遊： ${purchasedName}`)
        reservationName.className = "reservationText"
        purchasedItems_Name.appendChild(reservationName)

        const purchasedItems_Date = document.querySelector(".purchasedItems_Date")
        let reservationDate = document.createElement("span")
        reservationDate.appendChild(document.createTextNode(purchasedDate))
        reservationDate.className = "reservationText"
        purchasedItems_Date.appendChild(reservationDate)

        const purchasedItems_Time = document.querySelector(".purchasedItems_Time")
        let reservationTime = document.createElement("span")

        if (purchasedTime === "afternoon") {
            reservationTime.appendChild(document.createTextNode("10:00 - 14:00"))
        } else {
            reservationTime.appendChild(document.createTextNode("14:00 - 18:00"))
        }
        reservationTime.className = "reservationText"
        purchasedItems_Time.appendChild(reservationTime)

        const purchasedItems_Fee = document.querySelector(".purchasedItems_Fee")
        let reservationFee = document.createElement("span")
        reservationFee.appendChild(document.createTextNode(`新台幣 ${purchasedFee} 元`))
        reservationFee.className = "reservationText"
        purchasedItems_Fee.appendChild(reservationFee)

        const purchasedItems_Address = document.querySelector(".purchasedItems_Address")
        let reservationAddress = document.createElement("span")
        reservationAddress.appendChild(document.createTextNode(purchasedAddress))
        reservationAddress.className = "reservationText"
        purchasedItems_Address.appendChild(reservationAddress)

        const price = document.querySelector(".price")
        let totalPrice = document.createTextNode(`新台幣 ${purchasedFee} 元`)
        price.appendChild(totalPrice)
    }

}
