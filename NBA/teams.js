// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Teams');
    self.displayName = 'NBA Teams List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };
    self.favourites = ko.observableArray([]);
    self.team = ko.observableArray([]);

    //Favourites
    self.toggleFavourite = function (id, acronym) {
        let newteam = id + " " + acronym
        if (self.favourites().includes(newteam)) {
            self.favourites.remove(newteam);
        }
        else {
            self.favourites.push(newteam);
        }
        localStorage.setItem("favTeams", JSON.stringify(self.favourites()));
    };
    console.log(self.favourites())
    self.SetFavourites = function () {
        let storage;
        try {
            storage = JSON.parse(localStorage.getItem("favTeams"));
        }
        catch (e) {
            ;
        }
        if (Array.isArray(storage)) {
            self.favourites(storage);
        }
    }

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getTeams...');
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
            self.SetFavourites();
        });
    };

    // Function to check if data is present
    self.hasData = function (record) {
        return (
            record.Name !== null && record.Name !== ''
        );
    };

    // Function to check if data is present for HTML binding
    self.hasDataForHTML = function (record) {
        return self.hasData(record);
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

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

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");

    //Barra de pesquisa
    self.search = function() {
        console.log("searching")
        if ($("#searchbar").val() === "") {
            showLoading();
            var pg = getUrlParameter('page');
            console.log(pg);
            if (pg == undefined)
                self.activate(1);
            else {
                self.activate(pg);
            }
        } else {
            var changeUrl = 'http://192.168.160.58/NBA/API/Teams/Search?q=' + $("#searchbar").val();
            self.teamslist = [];
            ajaxHelper(changeUrl, 'GET').done(function(data) {
            console.log(data.length)
            if (data.length == 0) {
                return alert('No results found')
            }
            var term = $("#searchbar").val().toLowerCase();
            var filteredData = data.filter(function(record) {
                return record.Name.toLowerCase().includes(term);
            }).sort(function(a, b) {
                if (a.Name.toLowerCase().startsWith(term)) {
                    return -1;
                }
                if (b.Name.toLowerCase().startsWith(term)) {
                    return 1;
                }
                return 0;
            })
            self.totalPages(1)
            console.log(filteredData);
            showLoading();
            self.records(filteredData);
            self.totalRecords(filteredData.length);
            hideLoading();
            for (var i in filteredData) {
                self.teamslist.push(filteredData[i]);
            }
            });
        };
    };
        self.onEnter = function(d,e) {
            e.keyCode === 13 && self.search();
            return true;
        };

    $.ui.autocomplete.filter = function (array, term) {
    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
    return $.grep(array, function (value) {
        return matcher.test(value.label || value.value || value);
    });
    };

    $("#searchbar").autocomplete({
    source: function( request, response ) {
        $.ajax({
        url: "http://192.168.160.58/NBA/API/Teams/Search?q=" + request.term,
        dataType: "json",
        success: function( data ) {
            var teamNames = data.map(function(record) {
            return record.Name;
            });
            var filteredNames = $.ui.autocomplete.filter(teamNames, request.term);
            response( filteredNames );
        }
        });
    },
    minLength: 1,
    select: function( event, ui ) {
        log( "Selected: " + ui.item.value + " aka " + ui.item.id );
    },
    messages: {
        noResults: '',
        results: function() {}
        }
    });

};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})