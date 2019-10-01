var app = new Vue({
    el: "#app",
    data: {
        name: "",
        pass: "",
        dataUser: {}
    },
    methods: {
        fetchData() {
            let url = "/api/players"
            fetch(url, {
                method: "POST",
                body: JSON.stringify({username: this.name, password: this.pass}),
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            }).then(response=>{
                if (response.ok) {
                    alert ("Saved OK");
                } else {
                    throw new Error(response.statusText);
                }
            }).catch(error=>{
                alert("Not saved. Error: " + error);
            })
            fetch("/api/players").then(response=>{
                return response.json();
            }).then(values=>{
                this.dataUser = values;
                console.log(this.dataUser);
            })
        },
        getValues(event) {
            this.name = document.querySelector("#newUsername").value;
            this.pass = document.querySelector("#newPassword").value;

            this.fetchData();
        }
    }
});