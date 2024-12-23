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

    self.removeFav = function(id, acronym) {
        // Find the favourite with the given ID and acronym
        var favourite = self.favourites().find(function(fav) {
            return fav.Id === id && fav.Acronym === acronym;
        });
        if (favourite) {
            self.favourites.remove(favourite);
        }
    
        var favTeams = JSON.parse(localStorage.favTeams || '[]');
        console.log(favTeams);
        // Remove the favourite from the array
        var index = favTeams.indexOf(id + ' ' + acronym)
        favTeams.splice(index,1);
        localStorage.setItem("favTeams", JSON.stringify(favTeams));
        //console.log(self.favourites());
        
    };

    //--- Page Events
    self.activate = async function () {
        console.log('CALL: getTeams...');

        // Retrieve the list of favorite arenas from local storage
        var favTeams = JSON.parse(localStorage.favTeams || '[]');

        if (favTeams.length === 0) {
            hideLoading();
            alert('There are no favourites yet.');
            return;
        }

        // Loop over each ID in the fav array
        for (var i = 0; i < favTeams.length; i++) {
            var team = favTeams[i].split(' ')
            var id = team[0];
            var acronym = team[1];

            // Create the URI for the request
            var composedUri = self.baseUri() + "/" + id + '?Acronym=' + acronym;
            // Send the request
            try {
                var data = await ajaxHelper(composedUri, 'GET');
                console.log(data);
                hideLoading();

                self.favourites.push(data);
            } catch (error) {
                console.log('Error: ', error);
            }
        }
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
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})