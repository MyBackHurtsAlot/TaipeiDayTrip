const params = new URLSearchParams(window.location.search);
const orderNumber = params.get('orderNumber');
const thankyouWrap = document.querySelector(".thankyouWrap")

getNumber = async () => {
    const response = await fetch(`/api/order?orderNumber=${orderNumber}`)
    const data = await response.json()
    const userName = data.data.contact.name
    if (data.data.status === 1) {
        const contentWrap = document.createElement("div")
        contentWrap.className = "contentWrap"
        const customerWrap = document.createElement("div")
        customerWrap.className = "customerWrap"
        const customer = document.createTextNode(`!!!!!! 恭喜${userName}，您被 Google 隨機選中，提供您一個在今天贏取 iPhone14 Pro Max 的機會，以下是您的訂單編號，請點擊這個視窗領取您的 iPhone14 Pro Max !!!!!!`)
        customer.className = customer

        const numberWrap = document.createElement("div")
        numberWrap.className = "numberWrap"
        const number = document.createTextNode(orderNumber)
        number.className = number

        thankyouWrap.appendChild(contentWrap)
        contentWrap.appendChild(customerWrap)
        customerWrap.appendChild(customer)

        contentWrap.appendChild(numberWrap)
        numberWrap.appendChild(number)


        contentWrap.addEventListener("click", () => {
            popUpMsg("小笨蛋", "QQ")
            const cancel = document.querySelector(".cancel")
            cancel.onclick = () => {
                window.location.href = "/"
            }
        })
    } else {
        popUpMsg("有地方出錯啦", "QQ")
    }
}
getNumber()