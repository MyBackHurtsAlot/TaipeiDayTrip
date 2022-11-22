fetch(`http://18.139.142.46:3000/api/attraction/10`), {
    headers: new Headers({
        credentials: "include",
        "content-type": "application/json"
    }).then((response) => {
        console.log(response)
    })
}
