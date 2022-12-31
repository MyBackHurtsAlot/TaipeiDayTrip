const navBarBtnLogin = document.querySelector(".navBarBtnLogin")
const overlay = document.querySelector(".overlay")
const registerContainer = document.querySelector(".registerContainer")
const signInContainer = document.querySelector(".signInContainer")
const signInToRegister = document.querySelector(".signInNoAccount")
const registerToSignIn = document.querySelector(".registerIsMember")
const navBarTpeText = document.querySelector(".navBarTpeText")
const iconClose = document.querySelectorAll(".iconClose")
const error = document.querySelector(".error")

// showes signIn block
navBarBtnLogin.onclick = () => {
    signInContainer.style.display = "grid"
    overlay.style.display = "block"
}

// Hides all block
overlay.onclick = () => {
    signInContainer.style.display = "none"
    registerContainer.style.display = "none"
    overlay.style.display = "none"
    error.style.display = "none"
}

// Change to register block
signInToRegister.onclick = () => {
    signInContainer.style.display = "none"
    registerContainer.style.display = "grid"

}
// Change to signIn block
registerToSignIn.onclick = () => {
    signInContainer.style.display = "grid"
    registerContainer.style.display = "none"

}
// close block with iconClose
iconClose[0].onclick = () => {
    signInContainer.style.display = "none"
    registerContainer.style.display = "none"
    error.style.display = "none"
    overlay.style.display = "none"
}
iconClose[1].onclick = () => {
    signInContainer.style.display = "none"
    registerContainer.style.display = "none"
    error.style.display = "none"
    overlay.style.display = "none"
}

// =========== Check if loggedin when onload ================

// isolate fetchMemberInfo function for further usage
const fetchMemberInfo = async () => {
    const response = await fetch(`/api/user/auth`)
    const data = await response.json()
    memberInfo = data.data
}
const checkStatus = async () => {
    await fetchMemberInfo()
    // console.log(memberInfo)
    if (memberInfo !== null) {
        navBarBtnMember.style.display = "block"
        navBarBtnLogin.style.display = "none"
    }
    return memberInfo
}

// For futher flexable
let addLoadEvent = (checkStatus) => {
    let originalLoad = window.onload
    if (typeof window.onload !== "function") {
        window.onload = checkStatus
    } else {
        window.onload = () => {
            if (originalLoad) {
                originalLoad()
            }
            let memberInfo = checkStatus();
            // checkStatus()
        }
    }
}

addLoadEvent(checkStatus)

// =================== Register =========================
const registerButton = document.querySelector(".registerButton")
const registerName = document.querySelector(".registerName")
const registerEmail = document.querySelector(".registerEmail")
const registerPassword = document.querySelector(".registerPassword")
const registerContainerWrap = document.querySelector(".registerContainerWrap")
const signInContainerWrap = document.querySelector(".signInContainerWrap")
const regInput = document.querySelector(".regInput")



// ============= popUp message ======================
const popUpMsg = (message, cancelOkMessage, position) => {

    error.style.color = "#cd4f4f"
    error.style.display = "flex"
    error.innerHTML = message
    const cancel = document.createElement("div")
    cancel.className = "cancel"
    const cancelOk = document.createTextNode(cancelOkMessage)
    cancelOk.className = "cancelOk"
    // cancel = document.createTextNode("OK")
    error.appendChild(cancel)
    cancel.appendChild(cancelOk)
    cancel.onclick = () => {
        error.style.display = "none"
        // overlay.style.display = "none"
    }
    if (position === "center") {
        error.className = "cancelCenter"
    } else if (position === "bottom") {
        error.className = "cancelBottom"
    } else if (position === "top") {
        cancel.className = "cancel"
    }
}
// ======== Regex ========
const regexName = /^[\w\u4E00-\u9FFF]([^<>\s]){1,20}$/
const regexEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const regexPassword = /^[\w]([^<>\s]){7,20}$/
const regexPhone = /^09\d{8}$/
// console.log(regexName.test(" "))
// ==================== Register onclick ========================
registerButton.onclick = () => {
    let memberName = registerName.value
    let memberEmail = registerEmail.value
    let memberPassword = registerPassword.value
    // console.log(memberName)
    if (!memberName || !memberEmail || !memberPassword) {
        popUpMsg("註冊一下啦", "好的", "top")
    } else if (!regexName.test(memberName)) {

        popUpMsg("請輸入 2 - 20 字之使用者名稱 (不含空白)", "好的", "top")
        // console.log(memberName)
    } else if (!regexEmail.test(memberEmail)) {

        popUpMsg("請輸入正確E-mail", "好的", "top")
        // console.log(memberEmail)
    } else if (!regexPassword.test(memberPassword)) {

        popUpMsg("請輸入8 - 20 位密碼", "好的", "top")
    } else {
        let newMember = {
            "memberName": memberName,
            "memberEmail": memberEmail,
            "memberPassword": memberPassword
        }
        fetch(`/api/user`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(newMember),
            headers: new Headers({
                "Content-Type": "application/JSON"
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            // console.log(data)
            if (data.ok) {
                popUpMsg("註冊成功", "好的", "top")
                error.style.color = "#6274c1"
            } else {
                popUpMsg("Email已被註冊", "好的", "top")
            }
        }).catch(() => {

            popUpMsg("伺服器內部錯誤", "好的", "top")
        })
    }
}


// ================== signIn =================
const signInButton = document.querySelector(".signInButton")
const navBarBtnMember = document.querySelector(".navBarBtnMember")

signInButton.onclick = async () => {
    let signInEmail = document.querySelector(".signInEmail").value
    let signInPassword = document.querySelector(".signInPassword").value
    // console.log(signInEmail)

    if (!signInEmail || !signInPassword) {
        popUpMsg("沒有會員嗎？", "是的", "top")
    } else {
        let signInMember = {
            "signInEmail": signInEmail,
            "signInPassword": signInPassword
        }
        const response = await fetch(`/api/user/auth`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(signInMember),
            headers: new Headers({
                "Content-Type": "application/JSON"
            })
        })
        const data = await response.json()
        // console.log(data.ok)
        if (data.ok) {
            // window.location.assign(url) // 會被XXS!!!!!!!!!!!
            window.location.reload()
        } else if (data.error) {

            popUpMsg("帳號或密碼錯誤", "好的", "top")
        }
    }
}

// ============= MemberPage ===================
navBarBtnMember.onclick = async () => {

    window.location.assign("/memberPage")

}

//============= Booking ===================
const navBarBtnItinerary = document.querySelector(".navBarBtnItinerary")
navBarBtnItinerary.onclick = () => {
    const checkStatusOnItinerary = async () => {
        await fetchMemberInfo()
        // console.log(memberInfo)
        if (memberInfo === null) {
            signInContainer.style.display = "grid"
            overlay.style.display = "block"
        } else {
            window.location.href = "/booking"
        }
    }
    checkStatusOnItinerary()
}
