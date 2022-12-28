// ============= Sign out ===================
navBarBtnMember.setAttribute("class", "navBarBtnLogout");
document.getElementsByClassName("navBarBtnLogout")[0].innerHTML = "登出系統";
const navBarBtnLogout = document.querySelector(".navBarBtnLogout")
navBarBtnLogout.onclick = async () => {
    const response = await fetch(`/api/user/auth`, {
        method: "DELETE",
        credentials: "include"
    })
    const data = await response.json()
    if (data.ok) {
        window.location.assign("/")
    }
}
// ================= Member Data ===================

window.addEventListener("load", async () => {
    const initialLoad = await checkStatus()
    if (initialLoad === null) {
        window.location.href = "/"

    }
})
const change_input = document.createElement("input")
const change_password = document.createElement("input")
const change_password_again = document.createElement("input")
const buttonWrap = document.createElement("div")
buttonWrap.className = "buttonWrap"
const confirm = document.createElement("div")
const nevermind = document.createElement("div")

// ================== createInput =====================
const createInput = async (position) => {
    if (position === "userName") {
        change_input.type = "text"
        change_input.placeholder = "改成什麼呢"
        change_input.className = "change_input"

        confirm.className = "confirm"
        confirm.innerHTML = "改好了"

        nevermind.className = "nevermind"
        nevermind.innerHTML = "算了"

        memberPageAvotor_NameWrap.appendChild(change_input)
        memberPageAvotor_NameWrap.append(buttonWrap)
        buttonWrap.appendChild(confirm)
        buttonWrap.appendChild(nevermind)
        change_input.style.display = "block"
        confirm.style.display = "block"

    } else {
        change_password.type = "password"
        change_password.placeholder = "兩次都要一樣唷"
        change_password.className = "change_password"

        change_password_again.type = "password"
        change_password_again.placeholder = "兩次都要一樣唷"
        change_password_again.className = "change_password_again"

        confirm.className = "confirm"
        confirm.innerHTML = "改好了"

        nevermind.className = "nevermind"
        nevermind.innerHTML = "算了"

        memberPageAvator_PasswordWrap.appendChild(change_password)
        memberPageAvator_PasswordWrap.appendChild(change_password_again)
        memberPageAvator_PasswordWrap.appendChild(buttonWrap)
        buttonWrap.appendChild(confirm)
        buttonWrap.appendChild(nevermind)
    }
}

// ================== ClearInput =====================
const clearInput = async (position) => {
    if (position === "userName") {
        change_input.style.display = "none"
        confirm.style.display = "none"
        nevermind.style.display = "none"
    } else {
        change_password.style.display = "none"
        change_password_again.style.display = "none"
        confirm.style.display = "none"
        nevermind.style.display = "none"
    }

}

// ================== GETMemberData =====================
const GetMemberData = async () => {
    const response = await fetch(`/api/memberPage`)
    const data = await response.json()
    const memberName = data.name
    const memberPassword = data.password
    const avator = data.avator
    loadMemberData(memberName, avator)
}
GetMemberData()

// ================== loadMemberData =====================
const memberPageAvotor_NameWrap = document.querySelector(".memberPageAvotor_NameWrap")
const memberPageAvator_PasswordWrap = document.querySelector(".memberPageAvator_PasswordWrap")
const memberPageAvator_Password = document.querySelector(".memberPageAvator_Password")
const changeName_input = document.querySelector(".changeName_input")
const memberPageAvator_img = document.querySelector(".memberPageAvator_img")
const fileUploader = document.querySelector(".fileUploader")

const loadMemberData = async (memberName, avator) => {
    // Avator
    if (!avator) {
        memberPageAvator_img.style.backgroundImage = `url(static/imgs/MemberPage/ori.png)`
    } else {
        const avatorSplit = avator.split("./")
        memberPageAvator_img.style.backgroundImage = `url(${avatorSplit[1]})`
    }

    // Name
    const memberPageAvator_name = document.createElement("div")
    memberPageAvator_name.className = "memberPageAvator_name"
    const memberPageName = document.createTextNode(`你好，${memberName}`)

    const memberPageAvator_name_change = document.createElement("div")
    memberPageAvator_name_change.className = "memberPageAvator_name_change"
    const memberNameChange = document.createTextNode(`改名字嗎`)

    memberPageAvotor_NameWrap.appendChild(memberPageAvator_name)
    memberPageAvator_name.appendChild(memberPageName)
    memberPageAvotor_NameWrap.appendChild(memberPageAvator_name_change)
    memberPageAvator_name_change.appendChild(memberNameChange)

    const memberPageAvator_Password_change = document.createElement("div")
    memberPageAvator_Password_change.className = "memberPageAvator_Password_change"
    const memberPasswordChange = document.createTextNode("改密碼嗎")

    memberPageAvator_PasswordWrap.appendChild(memberPageAvator_Password_change)
    memberPageAvator_Password_change.appendChild(memberPasswordChange)

    // Change Name
    memberPageAvator_name_change.onclick = () => {
        createInput("userName")

        memberPageAvator_name_change.style.display = "none"
        nevermind.style.display = "block"
        change_password.style.display = "none"
        change_password_again.style.display = "none"
        memberPageAvator_Password_change.style.display = "block"

        const confirm = document.querySelector(".confirm")
        const change_input = document.querySelector(".change_input")
        confirm.onclick = async () => {
            newName = change_input.value
            const updatedName = await changeName(newName)
            memberPageName.nodeValue = `你好，${updatedName}`;
            clearInput("userName")
            memberPageAvator_name_change.style.display = "block"
        }
        nevermind.onclick = async () => {
            change_input.style.display = "none"
            confirm.style.display = "none"
            nevermind.style.display = "none"
            change_password.style.display = "none"
            change_password_again.style.display = "none"
            memberPageAvator_name_change.style.display = "block"
            memberPageAvator_Password_change.style.display = "block"
        }
    }

    // Change Password
    memberPageAvator_Password_change.onclick = () => {
        createInput("userPassword")

        memberPageAvator_name_change.style.display = "block"
        memberPageAvator_Password_change.style.display = "none"
        change_input.style.display = "none"

        const confirm = document.querySelector(".confirm")
        const change_password = document.querySelector(".change_password")
        const change_password_again = document.querySelector(".change_password_again")

        change_password.style.display = "block"
        change_password_again.style.display = "block"
        confirm.style.display = "block"
        nevermind.style.display = "block"

        confirm.onclick = async () => {
            let newPassword = change_password.value
            let newPasswordAgain = change_password_again.value

            if (newPassword !== newPasswordAgain) {
                popUpMsg("兩次都要一樣請問你哪個字看不懂呢", "抱歉", "center")
            } else if (!regexPassword.test(newPassword) || !regexPassword.test(newPasswordAgain)) {
                popUpMsg("還記得密碼的規則嗎", "記得", "center")
            } else {
                changePassword(newPassword)
                clearInput("userPassword")
                memberPageAvator_Password_change.style.display = "block"
            }

        }
        nevermind.onclick = async () => {
            change_input.style.display = "none"
            confirm.style.display = "none"
            nevermind.style.display = "none"
            change_password.style.display = "none"
            change_password_again.style.display = "none"
            memberPageAvator_Password_change.style.display = "block"
            memberPageAvator_name_change.style.display = "block"
        }
    }
}

// ================== Change Name =====================
const changeName = async (newName) => {
    const newUserName = {
        "name": newName
    }
    const response = await fetch("/api/memberPage/name", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(newUserName),
        headers: new Headers({
            "Content-Type": "application/JSON"
        })
    })
    const data = await response.json()
    const nameUpdate = data.name
    return nameUpdate
}



// ================== Change password =====================
const changePassword = async (newPassword) => {
    const newUserPassword = {
        "password": newPassword
    }
    const response = await fetch("/api/memberPage/password", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(newUserPassword),
        headers: new Headers({
            "Content-Type": "application/JSON"
        })
    })
    const data = await response.json()
    if (data) {
        popUpMsg("改好了", "謝謝你", "center")
        error.style.color = "#6274c1"
    }
}

// ================== Change AvotorImg =====================
memberPageAvator_img.onclick = () => {
    fileUploader.click()
    const newAvator = document.querySelector(".fileUploader")
    newAvator.addEventListener("change", (e) => {
        if (e.target.files.length > 0) { // stops when img === null
            const formData = new FormData()

            formData.append("file", e.target.files[0])
            updateAvator(formData)
        }
    })
}

const updateAvator = async (formData) => {
    const response = await fetch(`/api/memberPage/avator`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
    })
    const data = await response.json()
    let avatorSplit = data.avator_path.split("./")
    if (data) {
        memberPageAvator_img.style.backgroundImage = `url(${avatorSplit[1]})`
    }
}

// ================== load History =====================
const historyWrap = document.querySelector(".historyWrap")
// const historyInfoContainer = document.querySelector(".historyInfoContainer")
const historyInfoContainer = document.createElement("div")
const historyInfoContainerLeft = document.createElement("div")
const historyInfoContainerRight = document.createElement("div")

historyInfoContainer.className = "historyInfoContainer"
historyWrap.appendChild(historyInfoContainer)
historyInfoContainer.style.display = "none"
historyInfoContainerLeft.className = "historyInfoContainerLeft"
historyInfoContainerRight.className = "historyInfoContainerRight"

const getHistory = async () => {
    const response = await fetch(`/api/order`)
    const data = await response.json()
    historyInfoContainer.style.display = "flex"
    historyInfoContainer.style.gap = "75px"

    historyInfoContainer.appendChild(historyInfoContainerLeft)


    const historyImg = data.data.trip.attraction.image
    const historyImgWrap = document.createElement("div")
    historyImgWrap.className = "historyImgWrap"
    historyImgWrap.style.backgroundImage = `url(${historyImg})`
    historyInfoContainer.appendChild(historyInfoContainerLeft)
    historyInfoContainerLeft.appendChild(historyImgWrap)

    historyInfoContainer.appendChild(historyInfoContainerRight)

    const historyAtrractionWrap = document.createElement("div")
    historyAtrractionWrap.className = "historyAtrractionWrap"
    const historyAtrraction = document.createTextNode(`地點：${data.data.trip.attraction.name}`)
    historyAtrraction.className = "historyAtrraction"
    historyInfoContainerRight.appendChild(historyAtrractionWrap)
    historyAtrractionWrap.appendChild(historyAtrraction)

    const historyDateWrap = document.createElement("div")
    historyDateWrap.className = "historyDateWrap"
    const historyDate = document.createTextNode(`日期：${data.data.trip.date}`)
    historyDate.className = "historyDate"
    historyInfoContainerRight.appendChild(historyDateWrap)
    historyDateWrap.appendChild(historyDate)

    const historyTimeWrap = document.createElement("div")
    historyTimeWrap.className = "historyTimeWrap"
    const historyTime = document.createTextNode(`時間：${data.data.trip.time}`)
    historyTime.className = "historyTime"
    historyInfoContainerRight.appendChild(historyTimeWrap)
    historyTimeWrap.appendChild(historyTime)

    const historypriceWrap = document.createElement("div")
    historypriceWrap.className = "historypriceWrap"
    const historyprice = document.createTextNode(`你花在我身上的錢：${data.data.price} 元`)
    historyprice.className = "historyprice"
    historyInfoContainerRight.appendChild(historyprice)


}
const showHistory = async () => {
    historyInfoContainer.style.display = 'flex';
}

const hideHistory = async () => {
    historyInfoContainer.style.display = 'none';
}
historyWrap.addEventListener("mouseenter", getHistory);
historyWrap.addEventListener('mouseenter', () => {
    historyWrap.removeEventListener('mouseenter', getHistory);
});
historyWrap.addEventListener('mouseenter', showHistory);
historyWrap.addEventListener('mouseleave', hideHistory);

