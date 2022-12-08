const navBarBtnLogin = document.querySelector(".navBarBtnLogin")
const overlay = document.querySelector(".overlay")
const registerContainer = document.querySelector(".registerContainer")
const signInContainer = document.querySelector(".signInContainer")
const signInToRegister = document.querySelector(".signInNoAccount")
const registerToSignIn = document.querySelector(".registerIsMember")
const navBarTpeText = document.querySelector(".navBarTpeText")

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

// =========== Check if loggedin when onload ================
const checkStatus = async () => {
    const response = await fetch(`/api/user/auth`)
    const data = await response.json()
    // console.log(data)
    let memberInfo = data.data
    if (memberInfo !== null) {
        navBarBtnLogout.style.display = "block"
        navBarBtnLogin.style.display = "none"
    }
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
            checkStatus()
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
const error = document.querySelector(".error")


// ============= Status message ======================
const statusMsg = (s) => {
    error.style.color = "#cd4f4f"
    error.style.display = "flex"
    error.innerHTML = s
    let cancel = document.createElement("div")
    cancel.className = "cancel"
    let cancelOk = document.createTextNode("ok")
    cancelOk.className = "cancelOk"
    // cancel = document.createTextNode("OK")
    error.appendChild(cancel)
    cancel.appendChild(cancelOk)
    cancel.onclick = () => {
        error.style.display = "none"
    }
}
// ======== Regex ========
const regexName = /^[\w\u4E00-\u9FFF]([^<>\s]){1,20}$/
const regexEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const regexPassword = /^[\w]([^<>\s]){7,20}$/
// console.log(regexName.test(" "))
// ==================== Register onclick ========================
registerButton.onclick = () => {
    let memberName = registerName.value
    let memberEmail = registerEmail.value
    let memberPassword = registerPassword.value
    // console.log(memberName)
    if (memberName === "" || memberEmail === "" || memberPassword === "") {

        statusMsg("註冊一下啦")
    } else if (!regexName.test(memberName)) {

        statusMsg("請輸入 2 - 20 字之使用者名稱 (不含空白)")
        console.log(memberName)
    } else if (!regexEmail.test(memberEmail)) {

        statusMsg("請輸入正確E-mail")
        console.log(memberEmail)
    } else if (!regexPassword.test(memberPassword)) {

        statusMsg("請輸入8 - 20 位密碼")
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
            console.log(data)
            if (data.ok) {
                statusMsg("註冊成功")
                error.style.color = "#6274c1"
            } else {

                statusMsg("Email已被註冊")
            }
        }).catch(() => {

            statusMsg("伺服器內部錯誤")
        })
    }
}


// ================== signIn =================
const signInButton = document.querySelector(".signInButton")
const navBarBtnLogout = document.querySelector(".navBarBtnLogout")

signInButton.onclick = async () => {
    let signInEmail = document.querySelector(".signInEmail").value
    let signInPassword = document.querySelector(".signInPassword").value
    // console.log(signInEmail)

    if (signInEmail === "" || signInPassword === "") {

        statusMsg("沒有會員嗎？")
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

            statusMsg("帳號或密碼錯誤")
        }
    }
}

// ============= Sign out ===================
navBarBtnLogout.onclick = async () => {
    const response = await fetch(`/api/user/auth`, {
        method: "DELETE",
        credentials: "include"
    })
    const data = await response.json()
    if (data.ok) {
        window.location.reload()
    }
}
