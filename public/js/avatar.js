const form = document.querySelector("#upload");
const progress = document.getElementById("progress");
const progressBar = progress.querySelector(".progress-bar");
const validate = document.getElementById("validate");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let file = this.querySelector(`#fileupload`).files[0];

    if (file == undefined) {
        return (validate.innerHTML = "لطفا تصویر را انتخاب کنید");
    }

    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
        return (validate.innerHTML = "فرمت فایل باید png یا jpg باشد");
    }

    let fsize = Math.floor(file.size / 1024);

    if (fsize >= 250) {
        return (validate.innerHTML = "فایل ارسالی شما باید از 250 کیلوباید کمتر باشد");
    }

    if (file) {
        progress.classList.remove("d-none");
        let formData = new FormData();
        formData.append("images", file);

        let ajax = new XMLHttpRequest();
        ajax.upload.addEventListener("progress", progressHandler);
        ajax.addEventListener("load", completeHandler);
        ajax.open("POST", "/api/panel/avatar");
        ajax.send(formData);
    }
    function progressHandler(event) {
        let percent = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = `${percent}%`;
        progressBar.innerHTML = `${percent}%`;
    }

    function completeHandler() {
        Swal.fire({
            title: " انجام شد ",
            text: "عکس شما با موفقیت آپلود شد ",
            icon: "success",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("ok");
                window.location = "/panel";
            }
        });
    }
});
