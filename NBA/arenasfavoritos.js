function vm() {
    const self = this;
    // Define your observables and methods here
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Arenas/');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable();
    self.hasNext = ko.observable();
    self.hasPrevious = ko.observable();
    self.pagesize = ko.observable();
    self.totalPages = ko.observable();
    self.totalRecords = ko.observable();



    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getAthletes...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
        });
    };
};
function showLoading() {
    $("#myModal").modal('show', {
        keyboard: false
    });
}
function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    });
}

function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    })
}

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
            }
        });
    };


    function removeFav(Id) {
        console.log("remove fav")
        $("#fav-" + Id).remove();

        let fav = JSON.parse(localStorage.fav || '[]');

        const index = fav.indexOf(Id);

        if (index != -1)
            fav.splice(index, 1);

        localStorage.setItem("fav", JSON.stringify(fav));
    };


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function () {
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})




$(document).ready(function () {
    showLoading();

    let fav = JSON.parse(localStorage.fav || '[]');

    console.log(fav);

    (async function() {
        for (const Id of fav) {
            console.log(Id);
            await sleep(1000);
            ajaxHelper('http://192.168.160.58/NBA/API/Arenas/' + Id, 'GET').done(function (data) {
                console.log(data)
                if (localStorage.fav && localStorage.fav.length != 0) {
                    $("#table-favourites").show();
                    $('#noadd').hide();
                    $('#nofav').hide();
                    $("#table-favourites").append(
                        `<tr id="fav-${Id}">
                            <td class="align-middle"><img class="card-image" style="width:100px;height:100px" src="${data.Photo}"></td>
                            <td class="align-middle">${data.Name}</td>
                            <td class="align-middle">${data.StateName}</td>
                            <td class="align-middle">${data.TeamName}</td>
                            <td class="align-middle">${data.Location}</td>
                            <td class="text-end align-middle">
                                <a class="btn btn-default btn-sm btn-favourite" onclick="removeFav(${Id})"><i class="fa fa-heart text-danger" title="Selecione para remover dos favoritos"></i></a>
                            </td>
                        </tr>`
                    )

                }
            });
        }
    })();
    hideLoading();
})